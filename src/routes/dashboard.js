// src/routes/dashboard.js
import express from "express";
const router = express.Router();

// Protected route for the dashboard
router.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/login"); // Redirect if not authenticated
  }

  // Send user data as a response (you can customize the data sent)
  res.json({
    name: req.user.displayName,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    currencyPreference: req.user.currencyPreference,
  });
});

export default router;
