const { z } = require("zod");

const maintenanceCreateSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  maintenanceType: z.string().trim().min(1, "Maintenance Type is required"),
  description: z.string().trim().min(1, "Description is required"),
  estimatedCost: z.coerce.number().min(0, "Cost must be zero or more").optional(),
});

const maintenanceUpdateSchema = z.object({
  maintenanceType: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
  actualCost: z.coerce.number().min(0).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]).optional(),
});

module.exports = { maintenanceCreateSchema, maintenanceUpdateSchema };
