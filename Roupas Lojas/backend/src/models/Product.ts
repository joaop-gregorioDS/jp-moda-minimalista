import { Schema, model } from "mongoose";

const colorSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, index: true },
    compareAtPrice: { type: Number, default: null },
    categoryId: { type: Number, default: null, index: true },
    categorySlug: { type: String, default: "", index: true },
    categoryName: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    sizes: { type: [String], default: [] },
    visual: { type: String, default: "tee" },
    colors: { type: [colorSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ featured: 1, stock: 1 });
productSchema.index({ categorySlug: 1, price: 1 });
productSchema.index({ name: "text", slug: "text", sku: "text" });

export const Product = model("Product", productSchema);
