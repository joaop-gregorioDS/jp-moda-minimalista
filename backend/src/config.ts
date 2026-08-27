import "dotenv/config";

function splitOrigins(value: string) {
  return value
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jp_store",
  appSecret: process.env.APP_SECRET || "jp-local-secret-dev",
  origins: Array.from(new Set([...defaults, ...splitOrigins(process.env.FRONTEND_ORIGIN || "")])),
};
