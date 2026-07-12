const maintenanceRepository = require("../repositories/maintenanceRepository");
const vehicleRepository = require("../repositories/vehicleRepository");
const AppError = require("../utils/AppError");
const { VehicleStatus, MaintenanceStatus } = require("../constants/status");

const maintenanceService = {
  async list({ vehicleId, status, page = 1, pageSize = 10 }) {
    const where = {};
    if (vehicleId) where.vehicleId = Number(vehicleId);
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(pageSize);
    const [items, total] = await Promise.all([
      maintenanceRepository.findMany({ where, skip, take: Number(pageSize) }),
      maintenanceRepository.count(where),
    ]);

    return { items, total, page: Number(page), pageSize: Number(pageSize) };
  },

  async getById(id) {
    const record = await maintenanceRepository.findById(id);
    if (!record) throw new AppError("Maintenance record not found", 404);
    return record;
  },

  // MANDATORY RULE: creating a maintenance record puts the vehicle
  // IN_SHOP. Rejected if the vehicle is on a trip, retired, or
  // already in the shop (avoid overlapping maintenance windows).
  async create(data) {
    return maintenanceRepository.transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: Number(data.vehicleId) } });
      if (!vehicle) throw new AppError("Vehicle not found", 404);

      if (vehicle.status === VehicleStatus.RETIRED) {
        throw new AppError("Vehicle already retired", 400);
      }
      if (vehicle.status === VehicleStatus.ON_TRIP) {
        throw new AppError("Vehicle currently on a trip, cannot start maintenance", 400);
      }
      if (vehicle.status === VehicleStatus.IN_SHOP) {
        throw new AppError("Vehicle currently under maintenance", 400);
      }

      const record = await tx.maintenance.create({
        data: { ...data, status: MaintenanceStatus.OPEN },
      });

      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.IN_SHOP },
      });

      return record;
    });
  },

  async update(id, data) {
    await this.getById(id);
    return maintenanceRepository.update(id, data);
  },

  // MANDATORY RULE: completing maintenance frees the vehicle back to
  // AVAILABLE - unless the vehicle has been retired in the meantime,
  // in which case it stays RETIRED.
  async complete(id, { actualCost } = {}) {
    return maintenanceRepository.transaction(async (tx) => {
      const record = await tx.maintenance.findUnique({
        where: { id: Number(id) },
        include: { vehicle: true },
      });
      if (!record) throw new AppError("Maintenance record not found", 404);
      if (record.status === MaintenanceStatus.COMPLETED) {
        throw new AppError("Maintenance record already completed", 400);
      }

      const updated = await tx.maintenance.update({
        where: { id: Number(id) },
        data: {
          status: MaintenanceStatus.COMPLETED,
          completedDate: new Date(),
          ...(actualCost !== undefined ? { actualCost } : {}),
        },
      });

      if (record.vehicle.status !== VehicleStatus.RETIRED) {
        await tx.vehicle.update({
          where: { id: record.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
      }

      return updated;
    });
  },

  async remove(id) {
    const record = await this.getById(id);
    if (record.status !== MaintenanceStatus.COMPLETED) {
      throw new AppError(
        "Only completed maintenance records can be deleted; complete or cancel it first",
        400
      );
    }
    await maintenanceRepository.delete(id);
    return { id };
  },
};

module.exports = maintenanceService;
