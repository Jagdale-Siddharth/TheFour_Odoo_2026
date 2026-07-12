const { failure } = require("../utils/apiResponse");

// Central error handler. Keeps controllers free of try/catch and guarantees
// every error - expected or not - comes back in the {success,message,data}
// shape, never a raw stack trace to the client.
function errorHandler(err, req, res, next) {
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (!err.isOperational) {
    // Unexpected errors: log full detail server-side, never leak to client.
    console.error("[UNEXPECTED ERROR]", err);
  }

  return failure(res, { message, statusCode });
}

module.exports = errorHandler;
