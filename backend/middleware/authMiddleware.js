const { verifyToken } = require("../utils/token");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/db");

// Verifies the JWT on protected routes and attaches the user to req.user.
// Every other module (Vehicles, Trips, etc.) should reuse this middleware
// rather than writing their own token verification logic.

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Missing authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    throw new AppError("Invalid token", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Account is inactive", 403);
  }

  // Never trust frontend-supplied role — always use the DB record.
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  next();
});

module.exports = authMiddleware;
