import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, isParent, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      isParent: isParent || false,
      name,
    });

    res.status(201).json({
      message: "User registered",
      user: { email, id: user._id, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const loginUser = (
  req: Request,
  res: Response,
  err: any,
  user: any,
  info: any
) => {
  if (err)
    return res.status(500).json({ success: false, message: "Server error" });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: info?.message || "Login failed" });

  req.logIn(user, (err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Login error" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
    });
  });
};
