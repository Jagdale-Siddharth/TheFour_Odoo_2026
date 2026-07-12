// Every rejected business rule throws one of these with a message
// that is safe and useful to show directly in the UI - never a raw
// "Something went wrong".
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
