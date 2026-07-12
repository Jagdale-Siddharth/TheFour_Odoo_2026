const prisma = require("../config/db");

// Repository layer: ONLY database access. No business logic, no validation here.

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function findAll({ skip = 0, take = 20 } = {}) {
  return prisma.user.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function countAll() {
  return prisma.user.count();
}

async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  findAll,
  countAll,
  updateUser,
  deleteUser,
};
