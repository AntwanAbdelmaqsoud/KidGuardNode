import { Schema, model, Document } from "mongoose";

export interface IParentChildLink extends Document {
  parentId: string;
  childId: string;
  code: string | null;
  expiresAt: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const ParentChildLinkSchema = new Schema<IParentChildLink>(
  {
    parentId: { type: String, required: true, index: true },
    childId: { type: String },
    code: { type: String, default: null },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 2000), // 2 minutes from now
      index: { expires: 0 }, // TTL enabled: Delete document at expiresAt
    },
  },
  { timestamps: true }
);

export const ParentChildLink = model<IParentChildLink>(
  "ParentChildLink",
  ParentChildLinkSchema
);
