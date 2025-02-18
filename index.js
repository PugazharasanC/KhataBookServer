// index.js

import express from "express"; // Import express framework
import cors from "cors"; // Middleware for enabling CORS
import dotenv from "dotenv"; // Load environment variables from .env file
import connectDB from "./src/config/db.js";
import "./src/config/passport.js"
import passport from "passport"; // Passport.js for authentication
import session from "express-session"; // Express session management
import authRoutes from "./src/routes/authRoutes.js"; // Import authentication routes
import dashboardRoutes from './src/routes/dashboard.js';  // Dashboard routes for authenticated users

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware Setup
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
)); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
connectDB();
// Routes
app.use("/auth", authRoutes); // Use the authentication routes
app.use('/dashboard', dashboardRoutes);  // Protected Dashboard Routes

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Khatabook Backend!");
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
