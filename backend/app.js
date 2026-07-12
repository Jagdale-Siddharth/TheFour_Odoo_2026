// ============================================================
// STANDALONE runner for testing the Fleet module in isolation
// ("Test your own module before pushing" - master guide).
//
// This is NOT the project's real entrypoint. Member 1 owns the
// main app.js / server.js. When merging, just:
//   app.use("/api", require("./routes/fleet"));
// into their Express app and drop this file.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fleetRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", fleetRoutes);

app.get("/health", (req, res) => res.json({ success: true, message: "Fleet module OK" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Fleet module standalone server running on port ${PORT}`);
});
