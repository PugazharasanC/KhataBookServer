import express from "express";
import { getBalance, updateBalance } from "../controllers/balanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBalance); // Retrieve current balance & loan
router.post("/", authMiddleware, updateBalance); // Update balance manually if needed

export default router;
