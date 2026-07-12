const express = require("express");
const maintenanceController = require("../controllers/maintenanceController");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  maintenanceCreateSchema,
  maintenanceUpdateSchema,
} = require("../validators/maintenanceValidator");
const { Roles } = require("../constants/status");

const router = express.Router();

router.use(verifyToken);

router.get("/", asyncHandler(maintenanceController.list));
router.get("/:id", asyncHandler(maintenanceController.getOne));

router.post(
  "/",
  requireRole(Roles.FLEET_MANAGER),
  validate(maintenanceCreateSchema),
  asyncHandler(maintenanceController.create)
);

router.put(
  "/:id",
  requireRole(Roles.FLEET_MANAGER),
  validate(maintenanceUpdateSchema),
  asyncHandler(maintenanceController.update)
);

router.put(
  "/:id/complete",
  requireRole(Roles.FLEET_MANAGER),
  asyncHandler(maintenanceController.complete)
);

router.delete(
  "/:id",
  requireRole(Roles.FLEET_MANAGER),
  asyncHandler(maintenanceController.remove)
);

module.exports = router;
