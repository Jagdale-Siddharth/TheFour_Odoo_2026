const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/token");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 10;

async function register({ name, email, password, role }) {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Account is inactive", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function getMe(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
}

// Never send password hash back to the client.
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = { register, login, getMe };
