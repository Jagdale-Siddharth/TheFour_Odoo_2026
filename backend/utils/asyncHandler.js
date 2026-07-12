// Wraps async route handlers so thrown errors are forwarded to errorMiddleware
// instead of crashing the process or needing try/catch in every controller.

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
