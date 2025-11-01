import { Request, Response } from "express";
import { ParentChildLink } from "../models/ParentChildLink";

export const generateLink = async (req: Request, res: Response) => {
  // Generates a link code for parent-child linking
  // Places the parentID and generated code into ParentChildLink collection
  // Link should be used by child to verify and link accounts
  const { parentID } = req.body;
  if (!parentID) {
    return res.status(400).json({ message: "Parent ID is required" });
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    const link = await ParentChildLink.create({
      parentId: parentID,
      childId: "",
      code: verificationCode,
    });
    return res.status(200).json({
      message: "Verification code generated",
      code: verificationCode,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save link", error: err });
  }
};

export const verifyLink = async (req: Request, res: Response) => {
  // Verify code and link child to parent
  const { childID, code } = req.body;
  if (!childID || !code) {
    return res.status(400).json({ message: "Child ID and code are required" });
  }

  try {
    const link = await ParentChildLink.findOne({ code });
    if (!link) {
      return res
        .status(404)
        .json({ message: "Link not found or code invalid" });
    }

    // Link the child to the parent
    link.childId = childID;
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
