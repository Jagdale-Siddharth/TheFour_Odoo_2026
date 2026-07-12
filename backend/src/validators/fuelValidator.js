const { z } = require("zod");

const fuelLogSchema = z.object({
  tripId: z.number().int().positive("Trip is required"),
  vehicleId: z.number().int().positive("Vehicle is required"),
  liters: z.number().positive("Liters must be greater than 0"),
  cost: z.number().positive("Cost must be greater than 0"),
  fuelDate: z.coerce.date({ errorMap: () => ({ message: "Valid fuel date is required" }) }),
  odometer: z.number().nonnegative("Odometer reading cannot be negative"),
});

const updateFuelLogSchema = fuelLogSchema.partial();

module.exports = { fuelLogSchema, updateFuelLogSchema };
