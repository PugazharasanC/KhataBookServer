// backend/routes/categories.js
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addCategory, getCategories,  } from "../controllers/categoryController.js";

const categoryRouter = Router();

// Get categories for a type
categoryRouter.get("/", authMiddleware, getCategories);

// Add new category (if needed - optional explicit add endpoint)
categoryRouter.post("/", authMiddleware, addCategory);

export default categoryRouter;
