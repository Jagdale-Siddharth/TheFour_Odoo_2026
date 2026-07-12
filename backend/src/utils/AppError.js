// Every business rule violation throws one of these with a specific,
// user-friendly message - never a generic "Something went wrong".
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
