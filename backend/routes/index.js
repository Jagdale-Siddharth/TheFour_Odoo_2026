const express = require("express");
const vehicleRoutes = require("./vehicleRoutes");
const driverRoutes = require("./driverRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");

const router = express.Router();

// Mounted by the main app as: app.use("/api", require("./routes/fleet"))
router.use("/vehicles", vehicleRoutes);
router.use("/drivers", driverRoutes);
router.use("/maintenance", maintenanceRoutes);

module.exports = router;
