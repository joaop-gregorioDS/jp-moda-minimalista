import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    number: { type: String, default: "" },
    complement: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    productId: { type: Number, default: null },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    color: { type: String, default: null },
    size: { type: String, default: null },
    visual: { type: String, default: "tee" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: Number, default: null, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true, index: true },
    address: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, default: "pendente" },
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Order = model("Order", orderSchema);
