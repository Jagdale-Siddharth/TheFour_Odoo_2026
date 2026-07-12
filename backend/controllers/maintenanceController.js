const maintenanceService = require("../services/maintenanceService");
const { success } = require("../utils/apiResponse");

const maintenanceController = {
  async list(req, res) {
    const { vehicleId, status, page, pageSize } = req.query;
    const result = await maintenanceService.list({ vehicleId, status, page, pageSize });
    return success(res, "Maintenance records fetched", result);
  },

  async getOne(req, res) {
    const record = await maintenanceService.getById(req.params.id);
    return success(res, "Maintenance record fetched", record);
  },

  async create(req, res) {
    const record = await maintenanceService.create(req.body);
    return success(res, "Maintenance record created, vehicle moved to IN_SHOP", record, 201);
  },

  async update(req, res) {
    const record = await maintenanceService.update(req.params.id, req.body);
    return success(res, "Maintenance record updated", record);
  },

  async complete(req, res) {
    const record = await maintenanceService.complete(req.params.id, req.body);
    return success(res, "Maintenance completed, vehicle available again", record);
  },

  async remove(req, res) {
    const result = await maintenanceService.remove(req.params.id);
    return success(res, "Maintenance record deleted", result);
  },
};

module.exports = maintenanceController;
