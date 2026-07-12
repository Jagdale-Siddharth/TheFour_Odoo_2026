const { z } = require("zod");

const driverCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  licenseNumber: z.string().trim().min(1, "License Number is required"),
  licenseCategory: z.string().trim().min(1, "License Category is required"),
  licenseExpiryDate: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
    message: "License Expiry Date must be in the future",
  }),
  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  safetyScore: z.coerce.number().int().min(0).max(100).optional(),
});

const driverUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  licenseNumber: z.string().trim().min(1).optional(),
  licenseCategory: z.string().trim().min(1).optional(),
  licenseExpiryDate: z.coerce
    .date()
    .refine((d) => d.getTime() > Date.now(), {
      message: "License Expiry Date must be in the future",
    })
    .optional(),
  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number")
    .optional(),
  safetyScore: z.coerce.number().int().min(0).max(100).optional(),
});

module.exports = { driverCreateSchema, driverUpdateSchema };
