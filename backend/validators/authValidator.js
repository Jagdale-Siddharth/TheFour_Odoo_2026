const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long"),
  role: z.enum(
    ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"],
    { required_error: "Role is required" }
  ),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z
    .enum(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"])
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

module.exports = { registerSchema, loginSchema, updateUserSchema };
