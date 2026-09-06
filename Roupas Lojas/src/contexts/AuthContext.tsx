"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const SESSION_KEY = "jp_session_v1";

function asAuthError(error: unknown, fallback: string) {
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return new Error("Servidor demorou para responder. Tente novamente.");
  }
  if (error instanceof Error) return error;
  return new Error(fallback);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("sessão inválida");
        const data = await res.json();
        if (active) setUser(data.user ?? null);
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(12000),
      });
      const data = await res.json().catch(() => ({} as { error?: string; token?: string; user?: User }));
      if (!res.ok) throw new Error(data.error || "Não foi possível entrar.");
      localStorage.setItem(SESSION_KEY, data.token);
      setUser(data.user);
      return data.user as User;
    } catch (error) {
      throw asAuthError(error, "Não foi possível entrar.");
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
          signal: AbortSignal.timeout(12000),
        });
        const data = await res.json().catch(() => ({} as { error?: string; token?: string; user?: User }));
        if (!res.ok) throw new Error(data.error || "Não foi possível cadastrar.");
        localStorage.setItem(SESSION_KEY, data.token);
        setUser(data.user);
        return data.user as User;
      } catch (error) {
        throw asAuthError(error, "Não foi possível cadastrar.");
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}