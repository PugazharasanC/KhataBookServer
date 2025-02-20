import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "expense",
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Capitalize the first letter of the title
ExpenseSchema.pre("save", function (next) {
  this.title =
    this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
  next();
});

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
