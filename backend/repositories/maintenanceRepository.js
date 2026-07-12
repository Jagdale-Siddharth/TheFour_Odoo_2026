const prisma = require("../config/db");

const maintenanceRepository = {
  findMany({ where, skip, take }) {
    return prisma.maintenance.findMany({
      where,
      skip,
      take,
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
  },

  count(where) {
    return prisma.maintenance.count({ where });
  },

  findById(id) {
    return prisma.maintenance.findUnique({
      where: { id: Number(id) },
      include: { vehicle: true },
    });
  },

  create(data) {
    return prisma.maintenance.create({ data });
  },

  update(id, data) {
    return prisma.maintenance.update({ where: { id: Number(id) }, data });
  },

  delete(id) {
    return prisma.maintenance.delete({ where: { id: Number(id) } });
  },

  // Vehicle status changes must happen atomically with the
  // maintenance record change (create -> IN_SHOP, complete -> AVAILABLE)
  // so a crash mid-way can never leave the two out of sync.
  transaction(fn) {
    return prisma.$transaction(fn);
  },
};

module.exports = maintenanceRepository;
