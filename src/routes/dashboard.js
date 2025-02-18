import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard route (after successful Google login)
router.get("/", ensureAuthenticated, (req, res) => {
  // Send the user's profile picture, name, and email to the frontend
  res.json({
    name: req.user.name,
    email: req.user.email,
    profilePicture: req.user.profilePicture, // User's profile picture
  });
});

export default router;
