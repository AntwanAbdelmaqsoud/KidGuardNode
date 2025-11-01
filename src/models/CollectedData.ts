import { Schema, model, Document } from "mongoose";

export interface IParentChildLink extends Document {
  childId: string;
  heartRate: number;
  stepCount: number;
  recordedAudio: Blob | null;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
}
const CollectedDataSchema = new Schema<IParentChildLink>(
  {
    childId: { type: String, required: true, index: true },
    heartRate: { type: Number, required: true },
    stepCount: { type: Number, required: true },
    recordedAudio: { type: Buffer, required: false },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CollectedData = model<IParentChildLink>(
  "CollectedData",
  CollectedDataSchema
);
