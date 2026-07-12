const fuelRepository = require("../repositories/fuelRepository");
const tripRepository = require("../repositories/tripRepository");
const AppError = require("../utils/AppError");

async function listFuelLogs(filters) {
  return fuelRepository.findAll(filters);
}

async function getFuelLogById(id) {
  const log = await fuelRepository.findById(id);
  if (!log) throw new AppError("Fuel log not found", 404);
  return log;
}

async function createFuelLog(input) {
  const trip = await tripRepository.findById(input.tripId);
  if (!trip) throw new AppError("Trip does not exist", 404);

  return fuelRepository.create(input);
}

async function updateFuelLog(id, input) {
  await getFuelLogById(id);
  return fuelRepository.update(id, input);
}

async function deleteFuelLog(id) {
  await getFuelLogById(id);
  return fuelRepository.remove(id);
}

module.exports = { listFuelLogs, getFuelLogById, createFuelLog, updateFuelLog, deleteFuelLog };
