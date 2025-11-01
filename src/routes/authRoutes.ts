import express, { Request, Response } from "express";
import passport from "../config/passport";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router(); // api/auth/

// Local signup/login
router.post("/register", registerUser);
router.post("/login", passport.authenticate("local"), loginUser);

// Google OAuth signup/login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: process.env.BASE_URL || "http://localhost:5173",
  })
);

// Logout user
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.redirect(process.env.BASE_URL || "http://localhost:5173");
  });
});

export default router;
