import { Response, Request } from "express";
import { AllowedZone } from "../models/AllowedZone";

export const addZone = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const { childId, zoneName, centerLat, centerLng, radiusMeters } = req.body;
  if (!zoneName || !centerLat || !centerLng || !radiusMeters) {
    return res
      .status(400)
      .json({ message: "All zone parameters are required" });
  }
  try {
    const newZone = await AllowedZone.create({
      childId,
      zoneName,
      centerLat,
      centerLng,
      radiusMeters,
    });
    return res.status(201).json(newZone);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add zone", error });
  }
};

export const listZones = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const { childId } = req.params;
  if (!childId) {
    return res.status(400).json({ message: "Child ID is required" });
  }
  try {
    const zones = await AllowedZone.find({ childId });
    return res.status(200).json(zones);
  } catch (error) {
    return res.status(500).json({ message: "Failed to list zones", error });
  }
};

export const removeZone = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent !== true) {
    return res
      .status(403)
      .json({ message: "Forbidden: user must be a parent" });
  }
  const { zoneId } = req.params;
  if (!zoneId) {
    return res.status(400).json({ message: "Zone ID is required" });
  }
  try {
    await AllowedZone.findByIdAndDelete(zoneId);
    return res.status(204).json({ message: "Zone removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove zone", error });
  }
};
