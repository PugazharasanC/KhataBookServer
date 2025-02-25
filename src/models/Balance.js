import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currentBalance: { type: Number, default: 0 },
    loanBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Balance", balanceSchema);
