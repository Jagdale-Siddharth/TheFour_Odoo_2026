const driverService = require("../services/driverService");
const { success } = require("../utils/apiResponse");

const driverController = {
  async list(req, res) {
    const { search, status, page, pageSize } = req.query;
    const result = await driverService.list({ search, status, page, pageSize });
    return success(res, "Drivers fetched", result);
  },

  async getOne(req, res) {
    const driver = await driverService.getById(req.params.id);
    return success(res, "Driver fetched", driver);
  },

  async create(req, res) {
    const driver = await driverService.create(req.body);
    return success(res, "Driver created", driver, 201);
  },

  async update(req, res) {
    const driver = await driverService.update(req.params.id, req.body);
    return success(res, "Driver updated", driver);
  },

  async remove(req, res) {
    const result = await driverService.remove(req.params.id);
    return success(res, "Driver deleted", result);
  },
};

module.exports = driverController;
