const express = require("express");
const fuelController = require("../controllers/fuelController");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { fuelLogSchema, updateFuelLogSchema } = require("../validators/fuelValidator");

const router = express.Router();

router.use(authenticate);

router.get("/", fuelController.listFuelLogs);
router.get("/:id", fuelController.getFuelLog);
router.post("/", validate(fuelLogSchema), fuelController.createFuelLog);
router.put("/:id", validate(updateFuelLogSchema), fuelController.updateFuelLog);
router.delete("/:id", fuelController.deleteFuelLog);

module.exports = router;
