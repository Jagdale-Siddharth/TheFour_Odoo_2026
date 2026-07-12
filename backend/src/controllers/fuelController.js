const fuelService = require("../services/fuelService");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listFuelLogs = asyncHandler(async (req, res) => {
  const logs = await fuelService.listFuelLogs(req.query);
  return success(res, { message: "Fuel logs fetched", data: logs });
});

const getFuelLog = asyncHandler(async (req, res) => {
  const log = await fuelService.getFuelLogById(req.params.id);
  return success(res, { message: "Fuel log fetched", data: log });
});

const createFuelLog = asyncHandler(async (req, res) => {
  const log = await fuelService.createFuelLog(req.body);
  return success(res, { message: "Fuel log created", data: log, statusCode: 201 });
});

const updateFuelLog = asyncHandler(async (req, res) => {
  const log = await fuelService.updateFuelLog(req.params.id, req.body);
  return success(res, { message: "Fuel log updated", data: log });
});

const deleteFuelLog = asyncHandler(async (req, res) => {
  await fuelService.deleteFuelLog(req.params.id);
  return success(res, { message: "Fuel log deleted" });
});

module.exports = { listFuelLogs, getFuelLog, createFuelLog, updateFuelLog, deleteFuelLog };
