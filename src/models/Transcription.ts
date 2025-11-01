import { Schema, model, Document } from "mongoose";

export interface ITranscription extends Document {
  collectedDataId: string;
  transcriptionText: string;
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptionSchema = new Schema<ITranscription>(
  {
    collectedDataId: { type: String, required: true, index: true },
    transcriptionText: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transcription = model<ITranscription>(
  "Transcription",
  TranscriptionSchema
);
