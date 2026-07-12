const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const routes = require("./routes");
const requestLogger = require("./middleware/requestLogger");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// Rate limiting (applied globally; tighten further on /auth if needed)
const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api", limiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy", data: {} });
});

// API routes
app.use("/api", routes);

// 404 + global error handler (must be last)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`TransitOps backend running on port ${env.port} [${env.nodeEnv}]`);
});

module.exports = app;
