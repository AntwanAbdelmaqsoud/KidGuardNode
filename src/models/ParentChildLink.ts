import { Schema, model, Document } from "mongoose";

export interface IParentChildLink extends Document {
  parentId: string;
  childId: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParentChildLinkSchema = new Schema<IParentChildLink>(
  {
    parentId: { type: String, required: true, index: true },
    childId: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);

export const ParentChildLink = model<IParentChildLink>(
  "ParentChildLink",
  ParentChildLinkSchema
);
