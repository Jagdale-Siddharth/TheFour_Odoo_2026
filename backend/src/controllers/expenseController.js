const expenseService = require("../services/expenseService");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.listExpenses(req.query);
  return success(res, { message: "Expenses fetched", data: expenses });
});

const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  return success(res, { message: "Expense fetched", data: expense });
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  return success(res, { message: "Expense created", data: expense, statusCode: 201 });
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body);
  return success(res, { message: "Expense updated", data: expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.id);
  return success(res, { message: "Expense deleted" });
});

module.exports = { listExpenses, getExpense, createExpense, updateExpense, deleteExpense };
