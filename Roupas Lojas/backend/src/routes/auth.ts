import { Router } from "express";
import { User } from "../models/User";
import { hashPassword, signToken, verifyPassword } from "../auth";
import { nextId } from "../lib/ids";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { ah } from "../lib/async";

export const authRouter = Router();

function publicUser(row: { id: number; name: string; email: string; phone?: string | null }) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone ?? null };
}

authRouter.post("/login", ah(async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const row = await User.findOne({ email }).lean();
    if (!row || !verifyPassword(password, row.passwordHash)) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }
    return res.json({ token: signToken(row.id), user: publicUser(row) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Não foi possível entrar." });
  }
}));

authRouter.post("/register", ah(async (req, res) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const phone = String(req.body.phone ?? "").trim() || null;

    if (name.length < 2) return res.status(400).json({ error: "Informe seu nome." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "E-mail inválido." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "A senha precisa de ao menos 6 caracteres." });
    }

    const dup = await User.findOne({ email }).lean();
    if (dup) return res.status(409).json({ error: "Já existe uma conta com esse e-mail." });

    const id = await nextId("users");
    await User.create({
      id,
      name,
      email,
      passwordHash: hashPassword(password),
      phone,
    });

    return res.status(201).json({
      token: signToken(id),
      user: { id, name, email, phone },
    });
  } catch (error) {
    console.error("register error", error);
    return res.status(500).json({ error: "Não foi possível cadastrar agora." });
  }
}));

authRouter.get("/me", requireAuth, ah(async (req: AuthedRequest, res) => {
  const row = await User.findOne({ id: req.userId }).lean();
  if (!row) return res.status(401).json({ user: null });
  return res.json({ user: publicUser(row) });
}));
