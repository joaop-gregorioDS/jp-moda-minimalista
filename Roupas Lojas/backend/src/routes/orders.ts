import { Router } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { nextId } from "../lib/ids";
import { toOrder } from "../lib/serialize";
import { optionalAuth, requireAuth, type AuthedRequest } from "../middleware/auth";
import { ah } from "../lib/async";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth, ah(async (req: AuthedRequest, res) => {
  const user = await User.findOne({ id: req.userId }).lean();
  if (!user) return res.status(401).json({ orders: [] });

  const orders = await Order.find({ customerEmail: user.email })
    .sort({ createdAt: -1, id: -1 })
    .limit(40)
    .lean();

  res.json({ orders: orders.map(toOrder) });
}));

ordersRouter.post("/", optionalAuth, ah(async (req: AuthedRequest, res) => {
  try {
    const body = req.body ?? {};
    const items = Array.isArray(body.items) ? body.items : [];
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? body.userEmail ?? "").trim().toLowerCase();
    const address = body.address;

    if (items.length === 0) {
      return res.status(400).json({ error: "Sua sacola está vazia." });
    }
    if (name.length < 2 || !address?.street) {
      return res.status(400).json({ error: "Preencha seus dados de entrega." });
    }

    const subtotal = Math.round(Number(body.subtotal) * 100) / 100;
    const shipping = Math.round(Number(body.shipping ?? 0) * 100) / 100;
    const discount = Math.round(Number(body.discount ?? 0) * 100) / 100;
    const total = Math.max(0, Math.round((subtotal + shipping - discount) * 100) / 100);

    let userId: number | null = req.userId ?? null;
    if (!userId && email) {
      const found = await User.findOne({ email }).lean();
      if (found) userId = found.id;
    }

    const normalizedItems = items.map((it: Record<string, unknown>) => ({
      productId: it.productId != null ? Number(it.productId) : null,
      productName: String(it.productName ?? "").slice(0, 180),
      price: Math.round(Number(it.price) * 100) / 100,
      quantity: Math.max(1, Math.floor(Number(it.quantity) || 1)),
      color: it.color ? String(it.color).slice(0, 60) : null,
      size: it.size ? String(it.size).slice(0, 20) : null,
      visual: it.visual ? String(it.visual).slice(0, 40) : "tee",
    }));

    for (const it of normalizedItems) {
      if (!it.productId) continue;
      const updated = await Product.findOneAndUpdate(
        { id: it.productId, stock: { $gte: it.quantity } },
        { $inc: { stock: -it.quantity } },
        { new: true }
      );
      if (!updated) {
        const existing = await Product.findOne({ id: it.productId }).lean();
        if (existing && existing.stock < it.quantity) {
          return res.status(409).json({
            error: `Estoque insuficiente para ${it.productName}.`,
          });
        }
        if (existing) {
          await Product.updateOne({ id: it.productId }, { $set: { stock: 0 } });
        }
      }
    }

    const id = await nextId("orders");
    const created = await Order.create({
      id,
      userId,
      customerName: name,
      customerEmail: email,
      address,
      subtotal,
      shipping,
      discount,
      total,
      status: "pendente",
      items: normalizedItems,
    });

    return res.status(201).json({ order: toOrder(created.toObject()) });
  } catch (error) {
    console.error("order error", error);
    return res.status(500).json({ error: "Não foi possível finalizar o pedido." });
  }
}));
