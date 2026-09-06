import { Router } from "express";
import type { FilterQuery } from "mongoose";
import { Product } from "../models/Product";
import { toCard, toProduct, toSuggestion, type ProductDoc } from "../lib/serialize";
import { ah } from "../lib/async";

export const productsRouter = Router();

const CARD_FIELDS =
  "id slug name price compareAtPrice visual stock sizes colors categoryName categorySlug";

function asDoc(row: unknown) {
  return row as unknown as ProductDoc;
}

productsRouter.get("/", ah(async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const category = String(req.query.category ?? req.query.categoria ?? "").trim();
  const size = String(req.query.size ?? req.query.tamanho ?? "").trim();
  const order = String(req.query.order ?? req.query.ordem ?? "").trim();
  const featured = String(req.query.featured ?? "") === "1" || String(req.query.featured ?? "") === "true";
  const page = Math.max(1, Number(req.query.page ?? req.query.pagina) || 1);
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize) || 24));

  const filter: FilterQuery<typeof Product> = {};
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(escaped, "i");
    filter.$or = [{ name: rx }, { slug: rx }];
  }
  if (category) filter.categorySlug = category;
  if (size) filter.sizes = size;
  if (featured) filter.featured = true;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    name: { name: 1 },
    newest: { createdAt: -1, id: -1 },
    novidades: { createdAt: -1, id: -1 },
  };

  const total = await Product.countDocuments(filter);
  let rows;

  if (order === "sale" || order === "promocao") {
    rows = await Product.aggregate([
      { $match: filter },
      {
        $addFields: {
          discountRatio: {
            $cond: [
              { $and: [{ $ne: ["$compareAtPrice", null] }, { $gt: ["$price", 0] }] },
              { $divide: [{ $subtract: ["$compareAtPrice", "$price"] }, "$price"] },
              0,
            ],
          },
        },
      },
      { $sort: { discountRatio: -1, price: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);
  } else {
    const sort = sortMap[order] ?? sortMap.newest;
    rows = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(CARD_FIELDS)
      .lean();
  }

  res.json({
    products: rows.map((r) => toCard(asDoc(r))),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}));

productsRouter.get("/search", ah(async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (q.length < 2) return res.json({ results: [] });

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(escaped, "i");
  const rows = await Product.find({
    $or: [{ name: rx }, { slug: rx }, { sku: rx }, { categoryName: rx }, { categorySlug: rx }],
  })
    .sort({ price: 1 })
    .limit(10)
    .lean();

  const prefix = q.toLowerCase();
  const sorted = rows.sort((a, b) => {
    const aPref = a.name.toLowerCase().startsWith(prefix) ? 0 : 1;
    const bPref = b.name.toLowerCase().startsWith(prefix) ? 0 : 1;
    return aPref - bPref || a.price - b.price;
  });

  res.json({ results: sorted.map((r) => toSuggestion(asDoc(r))) });
}));

productsRouter.get("/by-ids", ah(async (req, res) => {
  const ids = String(req.query.ids ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n))
    .slice(0, 60);

  if (ids.length === 0) return res.json({ products: [] });

  const rows = await Product.find({ id: { $in: ids } }).select(CARD_FIELDS).lean();
  const order = new Map(ids.map((id, i) => [id, i]));
  const products = rows
    .map((r) => toCard(asDoc(r)))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  res.json({ products });
}));

productsRouter.get("/featured", ah(async (req, res) => {
  const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 8));
  const match = { featured: true, stock: { $gt: 0 } };
  const available = await Product.countDocuments(match);
  if (available === 0) return res.json({ products: [] });
  const rows = await Product.aggregate([
    { $match: match },
    { $sample: { size: Math.min(limit, available) } },
  ]);
  res.json({ products: rows.map((r) => toCard(asDoc(r))) });
}));

productsRouter.get("/latest", ah(async (req, res) => {
  const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 8));
  const rows = await Product.find({ stock: { $gt: 0 } })
    .sort({ createdAt: -1, id: -1 })
    .limit(limit)
    .select(CARD_FIELDS)
    .lean();
  res.json({ products: rows.map((r) => toCard(asDoc(r))) });
}));

productsRouter.get("/:id/related", ah(async (req, res) => {
  const raw = req.params.id;
  const asNum = Number(raw);
  const product = await Product.findOne(Number.isFinite(asNum) ? { id: asNum } : { slug: raw }).lean();
  if (!product) return res.status(404).json({ products: [] });

  const limit = Math.min(16, Math.max(1, Number(req.query.limit) || 8));
  const rows = await Product.find({
    id: { $ne: product.id },
    stock: { $gt: 0 },
    $or: [{ categorySlug: product.categorySlug }, { price: { $gte: product.price - 60, $lte: product.price + 60 } }],
  })
    .sort({ featured: -1, price: 1 })
    .limit(limit)
    .select(CARD_FIELDS)
    .lean();

  res.json({ products: rows.map((r) => toCard(asDoc(r))) });
}));

productsRouter.get("/:id", ah(async (req, res) => {
  const raw = req.params.id;
  const asNum = Number(raw);
  const row = await Product.findOne(Number.isFinite(asNum) && /^\d+$/.test(raw) ? { id: asNum } : { slug: raw }).lean();
  if (!row) return res.status(404).json({ error: "Produto não encontrado.", product: null });
  res.json({ product: toProduct(asDoc(row)) });
}));
