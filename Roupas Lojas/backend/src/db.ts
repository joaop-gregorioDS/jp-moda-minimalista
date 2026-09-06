import mongoose from "mongoose";
import { config } from "./config";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB conectado");
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}
