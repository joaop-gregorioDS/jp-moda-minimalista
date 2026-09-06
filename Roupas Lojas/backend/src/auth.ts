import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { config } from "./config";

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length) as Buffer;
  return timingSafeEqual(actual, expected);
}

function b64url(buf: Buffer) {
  return buf.toString("base64url");
}

export function signToken(userId: number) {
  const payload = b64url(Buffer.from(`${userId}.${Date.now()}`));
  const sig = b64url(createHmac("sha256", config.appSecret).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): number | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", config.appSecret).update(payload).digest();
    const given = Buffer.from(sig, "base64url");
    if (given.length === 0 || !timingSafeEqual(given, expected)) return null;
    const [idStr] = Buffer.from(payload, "base64url").toString().split(".");
    const id = Number(idStr);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export function bearerToToken(authHeader: string | undefined) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}
