const prisma = require("../config/db");

async function findAll({ tripId, vehicleId } = {}) {
  const where = {};
  if (tripId) where.tripId = Number(tripId);
  if (vehicleId) where.vehicleId = Number(vehicleId);

  return prisma.fuelLog.findMany({ where, orderBy: { fuelDate: "desc" } });
}

async function findById(id) {
  return prisma.fuelLog.findUnique({ where: { id: Number(id) } });
}

async function create(data) {
  return prisma.fuelLog.create({ data });
}

async function update(id, data) {
  return prisma.fuelLog.update({ where: { id: Number(id) }, data });
}

async function remove(id) {
  return prisma.fuelLog.delete({ where: { id: Number(id) } });
}

module.exports = { findAll, findById, create, update, remove };
