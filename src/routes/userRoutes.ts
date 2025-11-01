import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  updateUserNameOrPhoto,
  deleteUserAccount,
} from "../controllers/userController";

const router = Router(); //api/user/

// Get current user info - Authenticated through passport session
router.get("/", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Update user information: name and photoUrl
router.put("/", isAuthenticated, updateUserNameOrPhoto);

// Delete the currently authenticated user's account
router.delete("/", isAuthenticated, deleteUserAccount);

export default router;
