const { z } = require("zod");

const vehicleCreateSchema = z.object({
  registrationNumber: z.string().trim().min(1, "Registration Number is required"),
  vehicleName: z.string().trim().min(1, "Vehicle Name is required"),
  vehicleType: z.string().trim().min(1, "Vehicle Type is required"),
  maxLoadCapacity: z.coerce.number().positive("Capacity must be greater than zero"),
  odometer: z.coerce.number().min(0).optional(),
  acquisitionCost: z.coerce.number().min(0).optional().nullable(),
});

const vehicleUpdateSchema = vehicleCreateSchema.partial();

module.exports = { vehicleCreateSchema, vehicleUpdateSchema };
