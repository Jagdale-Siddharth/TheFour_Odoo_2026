const prisma = require("../config/db");

const driverRepository = {
  findMany({ where, skip, take }) {
    return prisma.driver.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(where) {
    return prisma.driver.count({ where });
  },

  findById(id) {
    return prisma.driver.findUnique({ where: { id: Number(id) } });
  },

  findByLicenseNumber(licenseNumber) {
    return prisma.driver.findUnique({ where: { licenseNumber } });
  },

  create(data) {
    return prisma.driver.create({ data });
  },

  update(id, data) {
    return prisma.driver.update({ where: { id: Number(id) }, data });
  },

  delete(id) {
    return prisma.driver.delete({ where: { id: Number(id) } });
  },
};

module.exports = driverRepository;
