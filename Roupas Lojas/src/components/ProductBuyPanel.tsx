"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { cn, formatBRL } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductBuyPanel({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const requestedSize = searchParams.get("tamanho");
  const [color, setColor] = useState(product.colors[0] ?? { name: "Noir", hex: "#111111" });
  const [size, setSize] = useState<string | null>(
    requestedSize && product.sizes.includes(requestedSize) ? requestedSize : product.sizes[0] ?? null
  );
  const [qty, setQty] = useState(1);
  const fav = isFavorite(product.id);
  const outOfStock = product.stock <= 0;

  const add = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      visual: product.visual,
      color,
      size: size ?? "Único",
      quantity: qty,
      stock: product.stock,
    });
    openCart();
    showToast({
      message: "Produto adicionado ao carrinho de compras.",
      variant: "cart",
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-bold text-ink">{formatBRL(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="text-mist line-through">{formatBRL(product.compareAtPrice)}</span>
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold text-gold-dark">
                -{product.discountPct}%
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-mist">ou 6x de {formatBRL(product.price / 6)} sem juros</p>
      </div>

      {outOfStock ? (
        <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-dark">
          Produto esgotado. Cadastre-se para avisar quando voltar.
        </p>
      ) : product.stock <= 5 ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Últimas {product.stock} unidades
        </p>
      ) : (
        <p className="text-xs font-medium uppercase tracking-wider text-mist">Em estoque</p>
      )}

      {/* Cores */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Cor</p>
          <p className="text-sm text-mist">{color.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.hex + c.name}
              type="button"
              aria-label={`Cor ${c.name}`}
              onClick={() => setColor(c)}
              className={cn(
                "h-11 w-11 overflow-hidden rounded-full ring-offset-2 transition-all duration-300",
                color.hex === c.hex ? "ring-2 ring-ink" : "ring-1 ring-ink/15 hover:ring-ink/40"
              )}
            >
              <span className="block h-full w-full" style={{ backgroundColor: c.hex }} />
            </button>
          ))}
        </div>
      </div>

      {/* Tamanhos */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">
              Tamanho{size ? <span className="ml-2 font-medium text-mist">{size}</span> : null}
            </p>
            <Link
              href="/institucional/guia-de-medidas"
              className="text-xs font-medium text-mist underline underline-offset-2 hover:text-ink"
            >
              Guia de medidas
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2 xs:grid-cols-5 sm:flex sm:flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-h-11 min-w-0 rounded-lg border px-2 text-sm font-semibold transition-all sm:min-w-12 sm:px-4",
                  size === s
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink hover:border-ink/50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + Add */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-ink/15 px-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
            >
              <Minus size={15} />
            </button>
            <span className="w-8 text-center text-base font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))}
              aria-label="Aumentar quantidade"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleFavorite(product.id, product.name);
              if (!fav) {
                showToast({
                  message: "Produto adicionado aos favoritos.",
                  variant: "favorite",
                  action: { label: "Ver lista", href: "/favoritos" },
                });
              }
            }}
            aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:hidden",
              fav
                ? "border-ink bg-ink text-gold"
                : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper"
            )}
          >
            <Heart size={19} fill={fav ? "currentColor" : "none"} />
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={outOfStock}
          className="flex h-12 w-full flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-all duration-300 hover:bg-black hover:shadow-[0_18px_40px_-16px_rgba(17,17,17,0.5)] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[52px]"
        >
          <ShoppingBag size={18} />
          {outOfStock ? "Indisponível" : "Adicionar à sacola"}
        </button>
        <button
          type="button"
          onClick={() => {
            toggleFavorite(product.id, product.name);
            if (!fav) {
              showToast({
                message: "Produto adicionado aos favoritos.",
                variant: "favorite",
                action: { label: "Ver lista", href: "/favoritos" },
              });
            }
          }}
          aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className={cn(
            "hidden h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:flex",
            fav
              ? "border-ink bg-ink text-gold"
              : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper"
          )}
        >
          <Heart size={19} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Accordeon-like info */}
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {[
          { t: "Descrição", b: product.description },
          { t: "Envio & devolução", b: "Envio em 24h úteis. Frete grátis acima de R$ 299 e troca gratuita em até 30 dias." },
          { t: "SKU", b: product.sku },
        ].map(({ t, b }) => (
          <details key={t} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
              {t}
              <span className="text-mist transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-mist">{b}</p>
          </details>
        ))}
      </div>
    </div>
  );
}