const expenseRepository = require("../repositories/expenseRepository");
const tripRepository = require("../repositories/tripRepository");
const AppError = require("../utils/AppError");

async function listExpenses(filters) {
  return expenseRepository.findAll(filters);
}

async function getExpenseById(id) {
  const expense = await expenseRepository.findById(id);
  if (!expense) throw new AppError("Expense not found", 404);
  return expense;
}

async function createExpense(input) {
  const trip = await tripRepository.findById(input.tripId);
  if (!trip) throw new AppError("Trip does not exist", 404);

  return expenseRepository.create(input);
}

async function updateExpense(id, input) {
  await getExpenseById(id);
  return expenseRepository.update(id, input);
}

async function deleteExpense(id) {
  await getExpenseById(id);
  return expenseRepository.remove(id);
}

module.exports = { listExpenses, getExpenseById, createExpense, updateExpense, deleteExpense };
