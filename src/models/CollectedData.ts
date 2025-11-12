import { Schema, model, Document } from "mongoose";

export interface ICollectedData extends Document {
  childId: string;
  heartRate: number | null;
  stepCount: number | null;
  recordedAudio: Buffer | null;
  longitude: number | null;
  latitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}
const CollectedDataSchema = new Schema<ICollectedData>(
  {
    childId: { type: String, required: true, index: true },
    heartRate: { type: Number, required: false },
    stepCount: { type: Number, required: false },
    recordedAudio: { type: Buffer, required: false },
    longitude: { type: Number, required: false },
    latitude: { type: Number, required: false },
  },
  { timestamps: true }
);

export const CollectedData = model<ICollectedData>(
  "CollectedData",
  CollectedDataSchema
);
