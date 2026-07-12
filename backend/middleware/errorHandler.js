const { failure } = require("../utils/apiResponse");

// Prisma-specific error codes we translate into readable messages.
// P2002 = unique constraint violation, P2025 = record not found.
function translatePrismaError(err) {
  if (err.code === "P2002") {
    const field = Array.isArray(err.meta?.target)
      ? err.meta.target[0]
      : err.meta?.target;
    if (field === "registrationNumber") return "Registration Number already exists";
    if (field === "licenseNumber") return "License Number already exists";
    return "A record with this value already exists";
  }
  if (err.code === "P2025") {
    return "Record not found";
  }
  return null;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    return failure(res, err.message, err.statusCode || 400);
  }

  const prismaMessage = translatePrismaError(err);
  if (prismaMessage) {
    return failure(res, prismaMessage, 409);
  }

  console.error("[Fleet module] Unexpected error:", err);
  return failure(res, "Unable to process request. Please try again.", 500);
}

module.exports = errorHandler;
