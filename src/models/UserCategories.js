import mongoose from "mongoose";

const userCategoriesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["income", "expense", "loan", "loan_repayment"],
    required: true,
  },
  categories: [String],
});

export default mongoose.model("UserCategories", userCategoriesSchema);
