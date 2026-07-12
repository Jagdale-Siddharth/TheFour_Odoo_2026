const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/AppError");

async function getAllUsers({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    userRepository.findAll({ skip, take: limit }),
    userRepository.countAll(),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getUserById(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

async function updateUser(id, data) {
  const existing = await userRepository.findById(id);

  if (!existing) {
    throw new AppError("User not found", 404);
  }

  const updated = await userRepository.updateUser(id, data);
  const { password, ...safeUser } = updated;
  return safeUser;
}

async function deleteUser(id) {
  const existing = await userRepository.findById(id);

  if (!existing) {
    throw new AppError("User not found", 404);
  }

  await userRepository.deleteUser(id);
  return { id };
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
