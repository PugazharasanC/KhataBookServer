import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import "./src/config/passport.js";
import passport from "passport";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import transactionRouter from "./src/routes/transactionRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/auth", authRoutes);
app.use("/transactions", transactionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Khatabook Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
