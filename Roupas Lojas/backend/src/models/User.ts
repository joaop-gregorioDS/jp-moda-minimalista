import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = model("User", userSchema);
