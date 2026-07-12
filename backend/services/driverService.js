const driverRepository = require("../repositories/driverRepository");
const AppError = require("../utils/AppError");
const { DriverStatus } = require("../constants/status");

const driverService = {
  async list({ search, status, page = 1, pageSize = 10 }) {
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { licenseNumber: { contains: search } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const [items, total] = await Promise.all([
      driverRepository.findMany({ where, skip, take: Number(pageSize) }),
      driverRepository.count(where),
    ]);

    return { items, total, page: Number(page), pageSize: Number(pageSize) };
  },

  async getById(id) {
    const driver = await driverRepository.findById(id);
    if (!driver) throw new AppError("Driver not found", 404);
    return driver;
  },

  async create(data) {
    const existing = await driverRepository.findByLicenseNumber(data.licenseNumber);
    if (existing) throw new AppError("License Number already exists", 409);
    return driverRepository.create({ ...data, status: DriverStatus.AVAILABLE });
  },

  async update(id, data) {
    const driver = await this.getById(id);

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
      const existing = await driverRepository.findByLicenseNumber(data.licenseNumber);
      if (existing) throw new AppError("License Number already exists", 409);
    }

    return driverRepository.update(id, data);
  },

  async setStatus(id, status) {
    await this.getById(id);
    return driverRepository.update(id, { status });
  },

  async remove(id) {
    const driver = await this.getById(id);
    if (driver.status === DriverStatus.ON_TRIP) {
      throw new AppError("Driver currently on a trip, cannot delete", 400);
    }
    await driverRepository.delete(id);
    return { id };
  },
};

module.exports = driverService;
