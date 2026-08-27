import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { connectDb } from "./db";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { categoriesRouter } from "./routes/categories";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";

async function main() {
  await connectDb();

  const app = express();
  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || config.origins.includes(origin)) return cb(null, true);
        if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return cb(null, true);
        if (/^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({
      name: "JP Store API",
      status: "ok",
      health: "/api/health",
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({ error: "Erro interno." });
  });

  app.listen(config.port, () => {
    console.log(`JP Store API ouvindo na porta ${config.port}`);
  });
}

main().catch((error) => {
  console.error("Falha ao iniciar a API", error);
  process.exit(1);
});
