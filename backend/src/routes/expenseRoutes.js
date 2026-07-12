const express = require("express");
const expenseController = require("../controllers/expenseController");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { expenseSchema, updateExpenseSchema } = require("../validators/expenseValidator");

const router = express.Router();

router.use(authenticate);

router.get("/", expenseController.listExpenses);
router.get("/:id", expenseController.getExpense);
router.post("/", validate(expenseSchema), expenseController.createExpense);
router.put("/:id", validate(updateExpenseSchema), expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
