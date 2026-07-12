const vehicleRepository = require("../repositories/vehicleRepository");
const AppError = require("../utils/AppError");
const { VehicleStatus } = require("../constants/status");

const vehicleService = {
  async list({ search, status, vehicleType, page = 1, pageSize = 10 }) {
    const where = {};
    if (status) where.status = status;
    if (vehicleType) where.vehicleType = vehicleType;
    if (search) {
      where.OR = [
        { registrationNumber: { contains: search } },
        { vehicleName: { contains: search } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const [items, total] = await Promise.all([
      vehicleRepository.findMany({ where, skip, take: Number(pageSize) }),
      vehicleRepository.count(where),
    ]);

    return { items, total, page: Number(page), pageSize: Number(pageSize) };
  },

  async getById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    return vehicle;
  },

  async create(data) {
    const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
    if (existing) throw new AppError("Registration Number already exists", 409);
    return vehicleRepository.create({ ...data, status: VehicleStatus.AVAILABLE });
  },

  async update(id, data) {
    const vehicle = await this.getById(id);

    if (vehicle.status === VehicleStatus.RETIRED) {
      throw new AppError("Vehicle already retired", 400);
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
      if (existing) throw new AppError("Registration Number already exists", 409);
    }

    return vehicleRepository.update(id, data);
  },

  async retire(id) {
    const vehicle = await this.getById(id);
    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new AppError("Vehicle currently on a trip, cannot retire", 400);
    }
    return vehicleRepository.update(id, { status: VehicleStatus.RETIRED });
  },

  async remove(id) {
    const vehicle = await this.getById(id);
    if (vehicle.status === VehicleStatus.IN_SHOP) {
      throw new AppError("Vehicle currently under maintenance", 400);
    }
    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new AppError("Vehicle currently on a trip, cannot delete", 400);
    }
    await vehicleRepository.delete(id);
    return { id };
  },
};

module.exports = vehicleService;
