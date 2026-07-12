// Lightweight request logger. In server.js we also use morgan for dev logs;
// this one is a simple custom fallback / can be extended (e.g. write to file).

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
