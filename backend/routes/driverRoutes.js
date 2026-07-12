const express = require("express");
const driverController = require("../controllers/driverController");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { driverCreateSchema, driverUpdateSchema } = require("../validators/driverValidator");
const { Roles } = require("../constants/status");

const router = express.Router();

router.use(verifyToken);

router.get("/", asyncHandler(driverController.list));
router.get("/:id", asyncHandler(driverController.getOne));

router.post(
  "/",
  requireRole(Roles.FLEET_MANAGER, Roles.SAFETY_OFFICER),
  validate(driverCreateSchema),
  asyncHandler(driverController.create)
);

router.put(
  "/:id",
  requireRole(Roles.FLEET_MANAGER, Roles.SAFETY_OFFICER),
  validate(driverUpdateSchema),
  asyncHandler(driverController.update)
);

router.delete(
  "/:id",
  requireRole(Roles.FLEET_MANAGER),
  asyncHandler(driverController.remove)
);

module.exports = router;
