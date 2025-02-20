import Expense from "../models/ExpenseModel.js";
import Income from "../models/IncomeModel.js";

// Helper function to validate required fields
const validateFields = (fields) => {
  for (let field of fields) {
    if (!field) {
      return false;
    }
  }
  return true;
};

// Helper function to validate amount
const validateAmount = (amount) => {
  return amount > 0 && !isNaN(amount);
};

// Helper function to create an entry (Expense/Income)
const createEntry = async (Model, data, user) => {
  const { title, amount, category, date } = data;

  if (!validateFields([title, amount, category, date])) {
    return { status: false, message: "All fields are required" };
  }

  if (!validateAmount(amount)) {
    return { status: false, message: "Amount must be a positive number" };
  }

  const entry = new Model({
    title,
    amount,
    category,
    date,
    user,
  });

  try {
    await entry.save();
    return { status: true, message: `${Model.modelName} added` };
  } catch (error) {
    return { status: false, message: "Server error" };
  }
};

// Add Expense
export const addExpense = async (req, res) => {
  const result = await createEntry(Expense, req.body, req.user._id);
  return res.status(result.status ? 200 : 400).json(result);
};

// Get Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res
        .status(400)
        .json({ status: false, message: "Expense not found" });
    }

    await Expense.findByIdAndDelete(id);
    return res.status(200).json({ status: true, message: "Expense deleted" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Add Income
export const addIncome = async (req, res) => {
  const result = await createEntry(Income, req.body, req.user._id);
  return res.status(result.status ? 200 : 400).json(result);
};

// Get Incomes
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    return res.status(200).json(incomes);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Delete Income
export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findById(id);

    if (!income) {
      return res
        .status(400)
        .json({ status: false, message: "Income not found" });
    }

    await Income.findByIdAndDelete(id);
    return res.status(200).json({ status: true, message: "Income deleted" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res
        .status(400)
        .json({ status: false, message: "Expense not found" });
    }

    if (!validateFields([title, amount, category, date])) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    if (!validateAmount(amount)) {
      return res
        .status(400)
        .json({ status: false, message: "Amount must be a positive number" });
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    await expense.save();
    return res.status(200).json({ status: true, message: "Expense updated" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const updateIncome = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const income = await Income.findById(id);

    if (!income) {
      return res
        .status(400)
        .json({ status: false, message: "Income not found" });
    }

    if (!validateFields([title, amount, category, date])) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    if (!validateAmount(amount)) {
      return res
        .status(400)
        .json({ status: false, message: "Amount must be a positive number" });
    }

    income.title = title;
    income.amount = amount;
    income.category = category;
    income.date = date;

    await income.save();
    return res.status(200).json({ status: true, message: "Income updated" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
