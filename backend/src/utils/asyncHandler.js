// Wraps async route handlers so rejected promises land in Express's error
// middleware instead of crashing the process or being silently swallowed.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
