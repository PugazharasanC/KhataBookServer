import { Router } from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
} from "../controllers/transactionController.js";

const router = Router();

router.post("/expenses", ensureAuthenticated, addExpense);
router.get("/expenses", ensureAuthenticated, getExpenses);
router.delete("/expenses/:id", ensureAuthenticated, deleteExpense);
router.put("/expenses/:id", ensureAuthenticated, updateExpense);

router.post("/incomes", ensureAuthenticated, addIncome);
router.get("/incomes", ensureAuthenticated, getIncomes);
router.delete("/incomes/:id", ensureAuthenticated, deleteIncome);
router.put("/incomes/:id", ensureAuthenticated, updateIncome);

export default router;
