const vehicleService = require("../services/vehicleService");
const { success } = require("../utils/apiResponse");

const vehicleController = {
  async list(req, res) {
    const { search, status, vehicleType, page, pageSize } = req.query;
    const result = await vehicleService.list({ search, status, vehicleType, page, pageSize });
    return success(res, "Vehicles fetched", result);
  },

  async getOne(req, res) {
    const vehicle = await vehicleService.getById(req.params.id);
    return success(res, "Vehicle fetched", vehicle);
  },

  async create(req, res) {
    const vehicle = await vehicleService.create(req.body);
    return success(res, "Vehicle created", vehicle, 201);
  },

  async update(req, res) {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    return success(res, "Vehicle updated", vehicle);
  },

  async retire(req, res) {
    const vehicle = await vehicleService.retire(req.params.id);
    return success(res, "Vehicle retired", vehicle);
  },

  async remove(req, res) {
    const result = await vehicleService.remove(req.params.id);
    return success(res, "Vehicle deleted", result);
  },
};

module.exports = vehicleController;
