const prisma = require("../config/db");

async function findAll({ tripId, expenseType } = {}) {
  const where = {};
  if (tripId) where.tripId = Number(tripId);
  if (expenseType) where.expenseType = expenseType;

  return prisma.expense.findMany({ where, orderBy: { expenseDate: "desc" } });
}

async function findById(id) {
  return prisma.expense.findUnique({ where: { id: Number(id) } });
}

async function create(data) {
  return prisma.expense.create({ data });
}

async function update(id, data) {
  return prisma.expense.update({ where: { id: Number(id) }, data });
}

async function remove(id) {
  return prisma.expense.delete({ where: { id: Number(id) } });
}

module.exports = { findAll, findById, create, update, remove };
