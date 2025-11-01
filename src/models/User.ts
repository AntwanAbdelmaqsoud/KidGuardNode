import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  photoUrl?: string;
  isParent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    isParent: { type: Boolean, default: false },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
