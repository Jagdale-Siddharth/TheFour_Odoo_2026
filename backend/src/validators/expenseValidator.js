const { z } = require("zod");
const { EXPENSE_TYPE } = require("../constants/expenseTypes");

const expenseSchema = z.object({
  tripId: z.number().int().positive("Trip is required"),
  expenseType: z.enum(Object.values(EXPENSE_TYPE), {
    errorMap: () => ({ message: "Invalid expense type" }),
  }),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().trim().min(1, "Description is required"),
  expenseDate: z.coerce.date({ errorMap: () => ({ message: "Valid expense date is required" }) }),
});

const updateExpenseSchema = expenseSchema.partial();

module.exports = { expenseSchema, updateExpenseSchema };
