const prisma = require("../config/db");

const vehicleRepository = {
  findMany({ where, skip, take }) {
    return prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(where) {
    return prisma.vehicle.count({ where });
  },

  findById(id) {
    return prisma.vehicle.findUnique({
      where: { id: Number(id) },
      include: { maintenanceRecords: true },
    });
  },

  findByRegistration(registrationNumber) {
    return prisma.vehicle.findUnique({ where: { registrationNumber } });
  },

  create(data) {
    return prisma.vehicle.create({ data });
  },

  update(id, data) {
    return prisma.vehicle.update({ where: { id: Number(id) }, data });
  },

  delete(id) {
    return prisma.vehicle.delete({ where: { id: Number(id) } });
  },
};

module.exports = vehicleRepository;
