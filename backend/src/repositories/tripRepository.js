const prisma = require("../config/db");

// Pure data access. No business rules here - the service layer decides
// what's allowed; this file only knows how to talk to the DB.

function buildWhere({ status, vehicleId, driverId, source, destination, dateFrom, dateTo, search }) {
  const where = {};

  if (status) where.status = status;
  if (vehicleId) where.vehicleId = Number(vehicleId);
  if (driverId) where.driverId = Number(driverId);
  if (source) where.source = { contains: source };
  if (destination) where.destination = { contains: destination };

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  if (search) {
    where.OR = [
      { tripNumber: { contains: search } },
      { source: { contains: search } },
      { destination: { contains: search } },
    ];
  }

  return where;
}

async function findAll(filters, { page = 1, pageSize = 20 } = {}) {
  const where = buildWhere(filters);
  const skip = (page - 1) * pageSize;

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      include: { fuelLogs: true, expenses: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.trip.count({ where }),
  ]);

  return { trips, total, page, pageSize };
}

async function findById(id) {
  return prisma.trip.findUnique({
    where: { id: Number(id) },
    include: { fuelLogs: true, expenses: true },
  });
}

async function findActiveTripForVehicle(vehicleId) {
  return prisma.trip.findFirst({
    where: { vehicleId: Number(vehicleId), status: "DISPATCHED" },
  });
}

async function findActiveTripForDriver(driverId) {
  return prisma.trip.findFirst({
    where: { driverId: Number(driverId), status: "DISPATCHED" },
  });
}

async function create(data) {
  return prisma.trip.create({ data });
}

async function update(id, data) {
  return prisma.trip.update({ where: { id: Number(id) }, data });
}

async function remove(id) {
  return prisma.trip.delete({ where: { id: Number(id) } });
}

module.exports = {
  findAll,
  findById,
  findActiveTripForVehicle,
  findActiveTripForDriver,
  create,
  update,
  remove,
};
