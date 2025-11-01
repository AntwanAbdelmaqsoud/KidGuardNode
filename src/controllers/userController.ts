import { Request, Response } from "express";
import { User } from "../models/User";

export const updateUserNameOrPhoto = async (req: Request, res: Response) => {
  try {
    const { name, photoUrl } = req.body;
    if (!name && !photoUrl) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const userId = (req.user as any)?._id ?? (req.user as any)?.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(photoUrl && { photo: photoUrl }),
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "User information updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id ?? (req.user as any)?.id;
    await User.findByIdAndDelete(userId);
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json({ message: "User account deleted" });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
