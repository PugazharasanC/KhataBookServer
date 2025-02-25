// backend/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["income", "expense", "loan", "loan_repayment"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "salary",
        "freelance",
        "gift",
        "investment", // Income categories
        "groceries",
        "entertainment",
        "utilities",
        "rent", // Expense categories
        "personal loan",
        "mortgage",
        "education loan",
        "car loan", // Loan categories
      ],
    },
    source: { type: String, default: "" },
    description: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
