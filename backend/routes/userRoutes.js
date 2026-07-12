const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const { updateUserSchema } = require("../validators/authValidator");

const router = express.Router();

// All user management routes require login.
// Only Fleet Manager can manage users — adjust roles here if the team decides otherwise.
router.get("/", authMiddleware, authorize(["FLEET_MANAGER"]), userController.getUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put(
  "/:id",
  authMiddleware,
  authorize(["FLEET_MANAGER"]),
  validate(updateUserSchema),
  userController.updateUser
);
router.delete("/:id", authMiddleware, authorize(["FLEET_MANAGER"]), userController.deleteUser);

module.exports = router;
