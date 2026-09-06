"use client";

import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatBRL, FREE_SHIPPING_THRESHOLD, SHIPPING_FIXED } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartSummary({ className }: { className?: string }) {
  const { subtotal } = useCart();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FIXED;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <aside className={cn("rounded-2xl border border-ink/10 bg-sand/50 p-6", className)}>
      <h2 className="text-lg font-bold tracking-tight text-ink">Resumo</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-mist">Subtotal</dt>
          <dd className="font-semibold text-ink">{formatBRL(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="flex items-center gap-1.5 text-mist">
            <Truck size={14} className="text-gold-dark" />
            Entrega
          </dt>
          <dd
            className={cn(
              "font-semibold",
              shipping === 0 ? "text-gold-dark" : "text-ink"
            )}
          >
            {shipping === 0 ? "Grátis" : formatBRL(shipping)}
          </dd>
        </div>
      </dl>

      {remaining > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-mist">
          Faltam <b className="font-semibold text-gold-dark">{formatBRL(remaining)}</b> para o
          frete grátis.
        </p>
      )}
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <span className="text-base font-semibold text-ink">Total</span>
        <span className="text-2xl font-bold tracking-tight text-ink">{formatBRL(total)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold text-paper transition-all duration-300 hover:bg-black"
      >
        Finalizar compra <ArrowRight size={16} />
      </Link>

      <Link
        href="/"
        className="mt-3 block text-center text-sm text-mist transition-colors hover:text-ink hover:underline underline-offset-4"
      >
        Continuar comprando
      </Link>
    </aside>
  );
}