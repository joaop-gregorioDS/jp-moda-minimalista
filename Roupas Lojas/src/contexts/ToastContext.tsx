"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { uuid } from "@/lib/utils";

export type ToastVariant = "cart" | "favorite" | "success" | "info" | "error";

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  /** Duração em ms. Padrão: 10 segundos. */
  duration?: number;
  title?: string;
  action?: ToastAction;
}

export interface ToastItem extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options: string | ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const DEFAULT_DURATION = 10_000;
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: string | ToastOptions) => {
      const normalized: ToastOptions = typeof options === "string" ? { message: options } : options;
      const id = uuid();
      const item: ToastItem = {
        ...normalized,
        id,
        variant: normalized.variant ?? "success",
        duration: normalized.duration ?? DEFAULT_DURATION,
      };

      setToasts((prev) => [...prev, item]);

      const timer = setTimeout(() => dismissToast(id), item.duration);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}
