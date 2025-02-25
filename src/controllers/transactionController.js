import Transaction from "../models/Transaction.js";
import Balance from "../models/Balance.js";
import mongoose from "mongoose";

export const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const { userId } = req.user;

    // Validate transaction type
    const validTypes = ["income", "expense", "loan", "loan_repayment"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: userId,
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
    });

    // Update balance
    let balance = await Balance.findOne({ user: userId });
    if (!balance) {
      balance = await Balance.create({ user: userId });
    }

    switch (type) {
      case "income":
        balance.currentBalance += amount;
        break;
      case "expense":
        balance.currentBalance -= amount;
        break;
      case "loan":
        balance.currentBalance += amount;
        balance.loanBalance += amount;
        break;
      case "loan_repayment":
        balance.currentBalance -= amount;
        balance.loanBalance -= amount;
        break;
    }

    await balance.save();

    // Get updated balance summary
    const transactionSummary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: { $in: ["income", "expense", "loan"] },
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

    // Return same structure as getBalance
    res.status(201).json({
      transaction,
      balance: {
        currentBalance: balance.currentBalance,
        loanBalance: balance.loanBalance,
        income: totals.income || 0,
        expense: totals.expense || 0,
        loan: totals.loan || 0,
      },
    });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({
      message: "Error adding transaction",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
