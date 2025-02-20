import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
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
      default: "income",
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
IncomeSchema.pre("save", function (next) {
  this.title =
    this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
  next();
});

const Income = mongoose.model("Income", IncomeSchema);

export default Income;
