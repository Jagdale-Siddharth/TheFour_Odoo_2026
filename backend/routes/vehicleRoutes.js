const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { vehicleCreateSchema, vehicleUpdateSchema } = require("../validators/vehicleValidator");
const { Roles } = require("../constants/status");

const router = express.Router();

router.use(verifyToken);

router.get("/", asyncHandler(vehicleController.list));
router.get("/:id", asyncHandler(vehicleController.getOne));

router.post(
  "/",
  requireRole(Roles.FLEET_MANAGER),
  validate(vehicleCreateSchema),
  asyncHandler(vehicleController.create)
);

router.put(
  "/:id",
  requireRole(Roles.FLEET_MANAGER),
  validate(vehicleUpdateSchema),
  asyncHandler(vehicleController.update)
);

router.put(
  "/:id/retire",
  requireRole(Roles.FLEET_MANAGER),
  asyncHandler(vehicleController.retire)
);

router.delete(
  "/:id",
  requireRole(Roles.FLEET_MANAGER),
  asyncHandler(vehicleController.remove)
);

module.exports = router;
