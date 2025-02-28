import { defaultCategories } from "../config/categories.js";
import UserCategories from "../models/UserCategories.js";

export const getCategories = async (req, res) => {
  try {
    // Fetch user categories in one query and immediately process them
    const userCategories = await UserCategories.find({ user: req.user.userId });
    // console.log(userCategories);
    // Create an object to store the categories response
    const categoriesResponse = {};

    // Initialize categories for each type, merging with user categories
    ["income", "expense", "loan", "loan_repayment"].forEach((type) => {
      // Find the user-specific categories for the given type
      const userCategory = userCategories.find(
        (category) => category.type === type
      );

      // Merge the default categories and user-specific categories (if any)
      categoriesResponse[type] = [
        ...(defaultCategories[type] || []),
        ...(userCategory ? userCategory.categories : []),
      ];
    });

    // Send the categories response as a JSON object
    res.json(categoriesResponse);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};

export const addCategory = async (req, res) => {
  const { type, category } = req.body;

  let userCategories = await UserCategories.findOneAndUpdate(
    { user: req.user.id, type },
    { $addToSet: { categories: category.toLowerCase() } },
    { new: true, upsert: true }
  );

  res.json(userCategories.categories);
};
