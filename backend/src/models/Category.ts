import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    accent: { type: String, default: "#c6a87c" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Category = model("Category", categorySchema);
