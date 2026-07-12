// Global error handler. Must be the LAST middleware registered in server.js.
// Ensures no raw "Internal Server Error" / stack traces ever reach the client.

function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Prisma known errors
  if (err.code === "P2002") {
    statusCode = 409;
    const field = err.meta?.target?.[0] || "field";
    message = `${field} already exists`;
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (process.env.NODE_ENV === "development" && !err.isOperational) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorMiddleware;
