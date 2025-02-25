import mongoose from "mongoose";
import Balance from "../models/Balance.js";
import Transaction from "../models/Transaction.js";

// Get balance and calculate income and expenses
export const getBalance = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get the balance
    let balance = await Balance.findOne({ user: userId });
    if (!balance) {
      balance = await Balance.create({ user: userId });
    }
    // Single aggregation query for all transaction types
    const transactionSummary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: { $in: ["income", "expense", "loan", "loanrepayment"] },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Convert array to object for easier access
    const totals = transactionSummary.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});

    res.status(200).json({
      currentBalance: balance?.currentBalance || 0,
      loanBalance: balance?.loanBalance || 0,
      income: totals.income || 0,
      expense: totals.expense || 0,
      loan: totals.loan || 0,
      loanrepayment: totals.loanrepayment || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching balance", error });
  }
};

export const updateBalance = async (req, res) => {
  try {
    const { currentBalance, loanBalance } = req.body;
    const balance = await Balance.findOneAndUpdate(
      { user: req.user._id },
      { currentBalance, loanBalance },
      { new: true, upsert: true }
    );
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: "Error updating balance", error });
  }
};
