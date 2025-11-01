import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ensure Passport's isAuthenticated exists and returns true
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }
  return next();
};
