"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCloseGuard } from "@/lib/useCloseGuard";
import { ShoppingBag, Truck, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { buttonStyles } from "@/components/ui/Button";
import { formatBRL, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, count, subtotal } = useCart();
  const router = useRouter();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const canClose = useCloseGuard(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const go = (href: string) => {
    closeCart();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[80]" aria-hidden={!isOpen}>
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={() => {
          if (canClose()) closeCart();
        }}
      />
      <aside className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <ShoppingBag size={19} /> Sua sacola
            {count > 0 && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar sacola"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-mist">
              <ShoppingBag size={26} />
            </span>
            <div>
              <p className="font-semibold text-ink">Sua sacola está vazia</p>
              <p className="mt-1 text-sm text-mist">Que tal começar pelo essencial?</p>
            </div>
            <button onClick={() => go("/catalogo")} className={buttonStyles("primary", "md")}>
              Explorar catálogo
            </button>
          </div>
        ) : (
          <>
            {remaining > 0 ? (
              <div className="border-b border-ink/10 px-5 py-4">
                <p className="flex items-center gap-1.5 text-xs text-ink/80">
                  <Truck size={14} className="text-gold-dark" />
                  Adicione <b className="font-semibold text-gold-dark">{formatBRL(remaining)}</b> para ganhar
                  frete grátis
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="border-b border-ink/10 bg-gold/10 px-5 py-3 text-xs font-semibold text-gold-dark">
                Você ganhou frete grátis nesta compra
              </div>
            )}

            <ul className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} compact />
              ))}
            </ul>

            <div className="border-t border-ink/10 px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-mist">Subtotal</span>
                <span className="text-xl font-bold tracking-tight text-ink">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-mist">Impostos e entrega calculados no checkout.</p>
              <button
                onClick={() => go("/checkout")}
                className={cn(buttonStyles("primary", "lg"), "mt-4 w-full")}
              >
                Finalizar compra
              </button>
              <Link
                href="/carrinho"
                onClick={closeCart}
                className="mt-3 block text-center text-sm font-medium text-ink/80 underline underline-offset-4 transition-colors hover:text-ink"
              >
                Ver sacola completa
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-1 w-full text-center text-sm text-mist transition-colors hover:text-ink"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}