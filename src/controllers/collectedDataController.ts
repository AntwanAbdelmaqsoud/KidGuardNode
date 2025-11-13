import { Request, Response } from "express";
import { CollectedData } from "../models/CollectedData";

// POST /api/collected-data
export const uploadCollectedData = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.isParent === true) {
    return res.status(403).json({ message: "Forbidden: user must be a child" });
  }
  const childId = user._id;

  try {
    const { heartRate, stepCount, longitude, latitude } = req.body;
    const recordedAudio = req.file ? req.file.buffer : null;

    const collectedData = await CollectedData.create({
      childId,
      heartRate: heartRate ? Number(heartRate) : null,
      stepCount: stepCount ? Number(stepCount) : null,
      recordedAudio,
      longitude: longitude ? Number(longitude) : null,
      latitude: latitude ? Number(latitude) : null,
    });

    res.status(201).json({
      message: "Collected data saved successfully",
      id: collectedData._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving collected data" });
  }
};

// GET /api/collected-data/:id/audio
export const getAudioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await CollectedData.findById(id).select("recordedAudio");

    if (!data || !data.recordedAudio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    res.set({
      "Content-Type": "audio/mpeg", // or "audio/wav"
      "Content-Disposition": `inline; filename="audio-${id}.mp3"`,
    });
    res.send(data.recordedAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving audio" });
  }
};

// GET /api/collected-data
export const listCollectedData = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const dataList = await CollectedData.find({ childId }).sort({
      createdAt: -1,
    });
    res.json(dataList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving collected data" });
  }
};
