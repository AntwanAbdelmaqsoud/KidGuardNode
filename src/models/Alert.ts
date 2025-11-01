import { Schema, model, Document } from "mongoose";

export interface IAlert extends Document {
  childId: string;
  parentId: string;
  data_id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    childId: { type: String, required: true, index: true },
    parentId: { type: String, required: true, index: true },
    data_id: { type: String, required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alert = model<IAlert>("Alert", AlertSchema);
