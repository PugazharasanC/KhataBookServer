// backend/routes/transactionRoutes.js
import express from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);

export default router;
