"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { formatBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <li className={cn("flex gap-4", !compact && "border-b border-ink/10 py-6 first:pt-0 last:border-0 last:pb-0")}>
      <Link
        href={`/produto/${item.slug}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-sand ring-1 ring-ink/10",
          compact ? "h-20 w-16 sm:h-24 sm:w-20" : "h-24 w-20 sm:h-32 sm:w-24 lg:h-36 lg:w-28"
        )}
      >
        <ProductVisual motif={item.visual} color={item.color.hex} className="h-full w-full" size={compact ? "sm" : "md"} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/produto/${item.slug}`}
            className="text-sm font-semibold leading-snug text-ink transition-colors hover:text-gold-dark"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label="Remover item"
            className="shrink-0 rounded-full p-1.5 text-mist transition-colors hover:bg-ink/5 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="mt-1 text-xs text-mist">
          {item.color.name} · Tam <b className="font-semibold">{item.size}</b>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="inline-flex items-center rounded-lg border border-ink/15">
            <button
              type="button"
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
              aria-label="Diminuir quantidade"
              className={cn(
                "flex items-center justify-center text-ink transition-colors hover:bg-ink/5",
                compact ? "h-10 w-10" : "h-10 w-10 sm:h-9 sm:w-9"
              )}
            >
              <Minus size={14} />
            </button>
            <span className={cn("text-center text-sm font-semibold tabular-nums", compact ? "w-7" : "w-9")}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
              aria-label="Aumentar quantidade"
              className={cn(
                "flex items-center justify-center text-ink transition-colors hover:bg-ink/5",
                compact ? "h-10 w-10" : "h-10 w-10 sm:h-9 sm:w-9"
              )}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-ink">{formatBRL(item.price * item.quantity)}</p>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <p className="text-xs text-mist line-through">{formatBRL(item.compareAtPrice * item.quantity)}</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}