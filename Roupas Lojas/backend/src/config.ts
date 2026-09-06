import "dotenv/config";

function splitOrigins(value: string) {
  return value
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];

const appSecret = process.env.APP_SECRET;
if (!appSecret || appSecret === "jp-local-secret-dev") {
  throw new Error("APP_SECRET must be set to a non-default value");
}

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jp_store",
  appSecret,
  origins: Array.from(new Set([...defaults, ...splitOrigins(process.env.FRONTEND_ORIGIN || "")])),
};
