const express = require("express");
const tripRoutes = require("./tripRoutes");
const fuelRoutes = require("./fuelRoutes");
const expenseRoutes = require("./expenseRoutes");

const router = express.Router();

// NOTE: /vehicles, /drivers, /auth routes are owned by other members and are
// mounted by them in the shared app.js - not duplicated here.
router.use("/trips", tripRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);

module.exports = router;
