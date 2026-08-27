"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Heart, Info, ShoppingBag, X } from "lucide-react";
import { useToast, type ToastItem, type ToastVariant } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

const iconByVariant: Record<ToastVariant, { Icon: LucideIcon; iconCls: string; barCls: string }> = {
  cart: {
    Icon: ShoppingBag,
    iconCls: "bg-gold/15 text-gold",
    barCls: "bg-gold",
  },
  favorite: {
    Icon: Heart,
    iconCls: "bg-gold/15 text-gold",
    barCls: "bg-gold",
  },
  success: {
    Icon: CheckCircle2,
    iconCls: "bg-emerald-400/15 text-emerald-400",
    barCls: "bg-emerald-400",
  },
  info: {
    Icon: Info,
    iconCls: "bg-paper/10 text-paper",
    barCls: "bg-paper/40",
  },
  error: {
    Icon: AlertCircle,
    iconCls: "bg-red-400/15 text-red-400",
    barCls: "bg-red-400",
  },
};

type LucideIcon = React.ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
}>;

function ToastCard({ toast }: { toast: ToastItem }) {
  const { dismissToast } = useToast();
  const { Icon, iconCls, barCls } = iconByVariant[toast.variant];

  return (
    <div
      className={cn(
        "animate-toast-in relative flex w-[min(92vw,24rem)] items-center gap-3 overflow-hidden rounded-2xl",
        "glass-dark py-4 pl-4 pr-3 shadow-2xl shadow-black/30"
      )}
      role="status"
      aria-live="polite"
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", barCls)} />
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          iconCls
        )}
      >
        <Icon size={20} fill={toast.variant === "favorite" ? "currentColor" : "none"} />
      </span>

      <div className={cn("min-w-0 flex-1", toast.action && "py-0.5")}>
        {toast.title && (
          <p className="text-sm font-semibold text-paper">{toast.title}</p>
        )}
        <p
          className={cn(
            "text-sm leading-snug text-paper/80",
            toast.action && "mt-0.5 text-xs text-paper/65"
          )}
        >
          {toast.message}
        </p>
      </div>

      {toast.action?.href ? (
        <Link
          href={toast.action.href}
          onClick={() => dismissToast(toast.id)}
          className="shrink-0 rounded-full border border-paper/20 px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          {toast.action.label}
        </Link>
      ) : toast.action?.onClick ? (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick?.();
            dismissToast(toast.id);
          }}
          className="shrink-0 rounded-full border border-paper/20 px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          {toast.action.label}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Fechar notificação"
        className="absolute right-2 top-2 rounded-full p-1 text-paper/40 transition-colors hover:text-paper"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastComponent() {
  const { toasts } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[95] flex w-auto max-w-full flex-col gap-3 sm:inset-x-auto sm:left-4 sm:max-w-md"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
}