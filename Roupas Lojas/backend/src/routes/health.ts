import { Router } from "express";
import { isDbReady } from "../db";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const db = isDbReady();
  res.status(db ? 200 : 503).json({
    ok: db,
    service: "jp-store-api",
    db: db ? "connected" : "disconnected",
  });
});
