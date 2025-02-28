import Transaction from "../models/Transaction.js";
import Balance from "../models/Balance.js";
import mongoose from "mongoose";
import { defaultCategories } from "../config/categories.js";
import UserCategories from "../models/UserCategories.js";

export const addTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { amount, type, category, description, date } = req.body;
    const { userId } = req.user;

    const validTypes = ["income", "expense", "loan", "loan_repayment"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    session.startTransaction();

    // Validate category against defaults and user-specific categories
    if (!defaultCategories[type].includes(category.toLowerCase())) {
      // Add to user's custom categories if not already present
      await UserCategories.findOneAndUpdate(
        { user: userId, type },
        { $addToSet: { categories: category.toLowerCase() } },
        { session, upsert: true }
      );
    }

    const transaction = await Transaction.create(
      [
        {
          user: userId,
          amount,
          type,
          category: category.toLowerCase(),
          description,
          date: date || Date.now(),
        },
      ],
      { session }
    );

    let balance = await Balance.findOne({ user: userId }).session(session);
    if (!balance) {
      balance = await Balance.create(
        [
          {
            user: userId,
            currentBalance: 0,
            loanBalance: 0,
          },
        ],
        { session }
      );
    }

    switch (type) {
      case "income":
        balance.currentBalance += Number(amount);
        break;
      case "expense":
        if (balance.currentBalance < amount) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: "Insufficient funds for expense" });
        }
        balance.currentBalance -= Number(amount);
        break;
      case "loan":
        balance.currentBalance += Number(amount);
        balance.loanBalance += Number(amount);
        break;
      case "loan_repayment":
        if (balance.loanBalance < amount) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: "Repayment exceeds loan balance" });
        }
        if (balance.currentBalance < amount) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: "Insufficient funds for repayment" });
        }
        balance.currentBalance -= Number(amount);
        balance.loanBalance -= Number(amount);
        break;
    }

    await balance.save({ session });

    await session.commitTransaction();

    const transactionSummary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: { $in: ["income", "expense", "loan", "loan_repayment"] },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totals = transactionSummary.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});

    res.status(201).json({
      transaction: transaction[0],
      balance: {
        currentBalance: balance.currentBalance,
        loanBalance: balance.loanBalance,
        income: totals.income || 0,
        expense: totals.expense || 0,
        loan: totals.loan || 0,
        loanRepayment: totals.loan_repayment || 0,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction error:", error);
    res.status(500).json({
      message: "Error adding transaction",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.userId }).sort(
      {
        date: -1,
      }
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
