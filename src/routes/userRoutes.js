// routes/userRoutes.js
import { Router } from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = Router();

// GET profile route (protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
      const { userId } = req.user; // Get the userId from the decoded token
      console.log(userId    )
    const user = await User.findById(userId)//.select("-password"); // Fetch user data, excluding password
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user profile information
    return res.status(200).json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
