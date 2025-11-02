import { Request, Response } from "express";
import { ParentChildLink } from "../models/ParentChildLink";

export const generateLink = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const parentId = user._id;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    const link = await ParentChildLink.create({
      parentId,
      childId: "",
      code: verificationCode,
      // expiresAt is set automatically by the schema to two minutes from now
    });
    return res.status(200).json({
      message: "Verification code generated",
      code: verificationCode,
      expiresAt: link.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save link", error: err });
  }
};

export const verifyLink = async (req: Request, res: Response) => {
  // Verify code and link child to parent
  const user = req.user as any;
  if (user.isParent !== false) {
    return res.status(403).json({ message: "Forbidden: user must be a child" });
  }
  const childId = user._id;
  const { code } = req.body;
  if (!code) {
    return res
      .status(400)
      .json({ message: "Code is required for verification" });
  }

  try {
    const link = await ParentChildLink.findOne({ code });
    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or code invalid" });
    }

    // Link the child to the parent
    link.childId = childId;
    link.expiresAt = undefined; // Clear expiration since it's now used
    link.code = null; // Clear code since it's now used
    await link.save();

    return res
      .status(200)
      .json({ message: "Child linked to parent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to verify link", error: err });
  }
};

export const getChildrenOfParent = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const parentId = user._id;

  try {
    const links = await ParentChildLink.find({ parentId })
      .select("childId")
      .lean();

    const childIds: string[] = links
      .map((l: any) => l.childId)
      .filter(
        (id: string | undefined) => typeof id === "string" && id.length > 0
      );

    return res.status(200).json({ children: childIds });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve children", error: err });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  // Delete a parent-child link
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const { childId } = req.body;
  if (!childId) {
    return res.status(400).json({ message: "Child ID is required" });
  }
  try {
    await ParentChildLink.deleteOne({ childId });
    return res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete link", error: err });
  }
};
