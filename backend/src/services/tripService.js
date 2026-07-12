const tripRepository = require("../repositories/tripRepository");
const vehicleApi = require("./vehicleApiClient");
const driverApi = require("./driverApiClient");
const generateTripNumber = require("../utils/generateTripNumber");
const AppError = require("../utils/AppError");
const { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } = require("../constants/status");

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function assertVehicleDispatchable(vehicle) {
  switch (vehicle.status) {
    case VEHICLE_STATUS.IN_SHOP:
      throw new AppError("Vehicle is currently under maintenance", 409);
    case VEHICLE_STATUS.RETIRED:
      throw new AppError("Vehicle has been retired and cannot be dispatched", 409);
    case VEHICLE_STATUS.ON_TRIP:
      throw new AppError("Vehicle is already on another trip", 409);
    case VEHICLE_STATUS.AVAILABLE:
      return;
    default:
      throw new AppError("Vehicle is not in a dispatchable state", 409);
  }
}

function assertDriverDispatchable(driver) {
  switch (driver.status) {
    case DRIVER_STATUS.SUSPENDED:
      throw new AppError("Driver is suspended and cannot be dispatched", 409);
    case DRIVER_STATUS.ON_TRIP:
      throw new AppError("Driver is already on another trip", 409);
    case DRIVER_STATUS.OFF_DUTY:
      throw new AppError("Driver is off duty and unavailable", 409);
    case DRIVER_STATUS.AVAILABLE:
      return;
    default:
      throw new AppError("Driver is not in a dispatchable state", 409);
  }
}

function assertLicenseValid(driver) {
  if (!driver.licenseExpiryDate) return; // Member 2 hasn't set one; nothing to check
  const expiry = new Date(driver.licenseExpiryDate);
  if (expiry.getTime() < Date.now()) {
    throw new AppError("Driver license has expired", 409);
  }
}

function assertCapacity(vehicle, cargoWeight) {
  if (typeof vehicle.capacity === "number" && cargoWeight > vehicle.capacity) {
    throw new AppError("Cargo weight exceeds vehicle capacity", 422);
  }
}

// -----------------------------------------------------------------------------
// CRUD
// -----------------------------------------------------------------------------

async function listTrips(filters, pagination) {
  return tripRepository.findAll(filters, pagination);
}

async function getTripById(id) {
  const trip = await tripRepository.findById(id);
  if (!trip) throw new AppError("Trip not found", 404);
  return trip;
}

async function createTrip(input, userId, authHeader) {
  // Fail fast on typos: confirm both vehicle and driver actually exist.
  await vehicleApi.getVehicleById(input.vehicleId, authHeader);
  await driverApi.getDriverById(input.driverId, authHeader);

  const tripNumber = generateTripNumber();

  return tripRepository.create({
    tripNumber,
    source: input.source,
    destination: input.destination,
    vehicleId: input.vehicleId,
    driverId: input.driverId,
    cargoWeight: input.cargoWeight,
    plannedDistance: input.plannedDistance,
    status: TRIP_STATUS.DRAFT,
    createdBy: userId,
  });
}

async function updateTrip(id, input) {
  const trip = await getTripById(id);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw new AppError("Only draft trips can be edited", 409);
  }

  return tripRepository.update(id, input);
}

async function deleteTrip(id) {
  const trip = await getTripById(id);

  if (trip.status === TRIP_STATUS.DISPATCHED) {
    throw new AppError("Cannot delete a trip that is currently dispatched", 409);
  }

  return tripRepository.remove(id);
}

// -----------------------------------------------------------------------------
// Dispatch workflow - the most important feature in this module.
// -----------------------------------------------------------------------------

async function dispatchTrip(id, authHeader) {
  const trip = await getTripById(id);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw new AppError(`Trip cannot be dispatched from status ${trip.status}`, 409);
  }

  const [vehicle, driver] = await Promise.all([
    vehicleApi.getVehicleById(trip.vehicleId, authHeader),
    driverApi.getDriverById(trip.driverId, authHeader),
  ]);

  // Belt-and-suspenders: our own Trip table is authoritative for "already on
  // a trip", since Member 2's status field could theoretically be stale.
  const [vehicleBusy, driverBusy] = await Promise.all([
    tripRepository.findActiveTripForVehicle(trip.vehicleId),
    tripRepository.findActiveTripForDriver(trip.driverId),
  ]);
  if (vehicleBusy) throw new AppError("Vehicle is already on another trip", 409);
  if (driverBusy) throw new AppError("Driver is already on another trip", 409);

  assertVehicleDispatchable(vehicle);
  assertDriverDispatchable(driver);
  assertLicenseValid(driver);
  assertCapacity(vehicle, trip.cargoWeight);

  // All checks passed - flip statuses. Vehicle first, then driver, then the
  // trip itself; if a later step fails, we compensate by rolling back the
  // earlier ones so nothing is left half-dispatched.
  await vehicleApi.setVehicleStatus(trip.vehicleId, VEHICLE_STATUS.ON_TRIP, authHeader);

  try {
    await driverApi.setDriverStatus(trip.driverId, DRIVER_STATUS.ON_TRIP, authHeader);
  } catch (err) {
    await vehicleApi.setVehicleStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE, authHeader).catch(() => {});
    throw err;
  }

  try {
    return await tripRepository.update(id, {
      status: TRIP_STATUS.DISPATCHED,
      dispatchDate: new Date(),
    });
  } catch (err) {
    await vehicleApi.setVehicleStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE, authHeader).catch(() => {});
    await driverApi.setDriverStatus(trip.driverId, DRIVER_STATUS.AVAILABLE, authHeader).catch(() => {});
    throw err;
  }
}

async function completeTrip(id, input, authHeader) {
  const trip = await getTripById(id);

  if (trip.status !== TRIP_STATUS.DISPATCHED) {
    throw new AppError("Only a dispatched trip can be completed", 409);
  }

  const updated = await tripRepository.update(id, {
    status: TRIP_STATUS.COMPLETED,
    actualDistance: input.actualDistance,
    completionDate: input.completionDate,
  });

  // Free up the vehicle and driver automatically - no manual status update.
  await vehicleApi.setVehicleStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE, authHeader);
  await driverApi.setDriverStatus(trip.driverId, DRIVER_STATUS.AVAILABLE, authHeader);

  return updated;
}

async function cancelTrip(id, authHeader) {
  const trip = await getTripById(id);

  if (trip.status === TRIP_STATUS.COMPLETED) {
    throw new AppError("Trip is already completed", 409);
  }
  if (trip.status === TRIP_STATUS.CANCELLED) {
    throw new AppError("Trip is already cancelled", 409);
  }

  const wasDispatched = trip.status === TRIP_STATUS.DISPATCHED;

  const updated = await tripRepository.update(id, { status: TRIP_STATUS.CANCELLED });

  // Only need to free up vehicle/driver if they were actually locked in -
  // a DRAFT trip never touched their status.
  if (wasDispatched) {
    await vehicleApi.setVehicleStatus(trip.vehicleId, VEHICLE_STATUS.AVAILABLE, authHeader);
    await driverApi.setDriverStatus(trip.driverId, DRIVER_STATUS.AVAILABLE, authHeader);
  }

  return updated;
}

module.exports = {
  listTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
