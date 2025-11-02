import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import parentChildRoutes from "./routes/parentChildLinkRoutes";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(morgan("dev")); //http request logger

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parentChild", parentChildRoutes);

export default app;
