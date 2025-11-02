import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, isParent } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      isParent: isParent || false,
    });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const loginUser = (req: Request, res: Response) => {
  // User is authenticated via Passport middleware
  res.json({ message: "Login successful", user: req.user });
};
