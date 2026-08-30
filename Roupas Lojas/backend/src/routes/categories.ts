import { Router } from "express";
import { Category } from "../models/Category";
import { toCategory } from "../lib/serialize";
import { ah } from "../lib/async";

export const categoriesRouter = Router();

categoriesRouter.get("/", ah(async (_req, res) => {
  const rows = await Category.find().sort({ sortOrder: 1 }).lean();
  res.json({ categories: rows.map(toCategory) });
}));
