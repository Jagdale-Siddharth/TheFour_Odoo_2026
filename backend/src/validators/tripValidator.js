const { z } = require("zod");

const createTripSchema = z.object({
  source: z.string().trim().min(1, "Source is required"),
  destination: z.string().trim().min(1, "Destination is required"),
  vehicleId: z.number().int().positive("Vehicle is required"),
  driverId: z.number().int().positive("Driver is required"),
  cargoWeight: z.number().positive("Cargo weight must be greater than 0"),
  plannedDistance: z.number().positive("Planned distance must be greater than 0"),
});

// Editing is only allowed while a trip is DRAFT - service layer enforces that,
// this schema just allows partial updates to the same fields.
const updateTripSchema = createTripSchema.partial();

const completeTripSchema = z.object({
  actualDistance: z.number().positive("Actual distance must be greater than 0"),
  completionDate: z.coerce.date({ errorMap: () => ({ message: "Valid completion date is required" }) }),
});

module.exports = { createTripSchema, updateTripSchema, completeTripSchema };
