import { Router } from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

import {
  addExpense,
  getExpenses,
  deleteExpense,
  addIncome,
  getIncomes,
  deleteIncome,
} from "../controllers/transactionController.js";

const router = Router();

router.post("/add-expense", ensureAuthenticated, addExpense);
router.get("/get-expenses", ensureAuthenticated, getExpenses);
router.delete("/delete-expense/:id", ensureAuthenticated, deleteExpense);
router.post("/add-income", ensureAuthenticated, addIncome);
router.get("/get-incomes", ensureAuthenticated, getIncomes);
router.delete("/delete-income/:id", ensureAuthenticated, deleteIncome);

export default router;
