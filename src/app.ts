import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import parentChildRoutes from "./routes/parentChildLinkRoutes";
import cors from "cors";
import morgan from "morgan";
import allowedZoneRoutes from "./routes/allowedZoneRoutes";
import collectedDataRoutes from "./routes/collectedDataRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(cors());
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

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parent-child", parentChildRoutes);
app.use("/api/allowed-zone", allowedZoneRoutes);
app.use("/api/collected-data", collectedDataRoutes);

// Catch-all for unknown routes (invalid calls)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({
    error: message,
    details: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

export default app;
