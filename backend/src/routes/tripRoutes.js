const express = require("express");
const tripController = require("../controllers/tripController");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createTripSchema,
  updateTripSchema,
  completeTripSchema,
} = require("../validators/tripValidator");

const router = express.Router();

router.use(authenticate);

router.get("/", tripController.listTrips);
router.get("/:id", tripController.getTrip);

router.post(
  "/",
  authorize("Dispatcher", "Fleet Manager"),
  validate(createTripSchema),
  tripController.createTrip
);

router.put(
  "/:id",
  authorize("Dispatcher", "Fleet Manager"),
  validate(updateTripSchema),
  tripController.updateTrip
);

router.delete("/:id", authorize("Fleet Manager"), tripController.deleteTrip);

router.post("/:id/dispatch", authorize("Dispatcher", "Fleet Manager"), tripController.dispatchTrip);

router.post(
  "/:id/complete",
  authorize("Dispatcher", "Fleet Manager"),
  validate(completeTripSchema),
  tripController.completeTrip
);

router.post("/:id/cancel", authorize("Dispatcher", "Fleet Manager"), tripController.cancelTrip);

module.exports = router;
