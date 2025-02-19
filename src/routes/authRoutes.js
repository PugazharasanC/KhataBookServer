// src/routes/authRoutes.js
import express from "express";
import passport from "passport";

const router = express.Router();

// Redirect to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Scope for requesting user profile & email
  })
);

// Google OAuth callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  }),
  (req, res) => {
    // On successful login, redirect to the frontend URL
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend dashboard (localhost:5173)
  }
);

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/"); // Redirect to the homepage or login page
  });
});

export default router;
