import type { Request, Response, NextFunction } from "express";
import { bearerToToken, verifyToken } from "../auth";

export interface AuthedRequest extends Request {
  userId?: number;
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = bearerToToken(req.headers.authorization);
  req.userId = token ? verifyToken(token) ?? undefined : undefined;
  next();
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = bearerToToken(req.headers.authorization);
  const userId = token ? verifyToken(token) : null;
  if (!userId) {
    return res.status(401).json({ error: "Não autorizado.", orders: [], user: null });
  }
  req.userId = userId;
  next();
}
