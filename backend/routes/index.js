const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// Other members mount their own route files here, e.g.:
// const vehicleRoutes = require("./vehicleRoutes");
// router.use("/vehicles", vehicleRoutes);
//
// const tripRoutes = require("./tripRoutes");
// router.use("/trips", tripRoutes);

module.exports = router;
