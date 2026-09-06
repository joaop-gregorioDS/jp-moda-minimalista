"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/lib/types";

export function CardActions({
  productId,
  productName,
  slug,
  price,
  compareAtPrice,
  visual,
  color,
  sizes,
  inStock,
}: {
  productId: number;
  productName: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  visual: string;
  color: ProductColor;
  sizes: string[];
  inStock: boolean;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const fav = isFavorite(productId);
  const size = sizes[0] ?? "Único";

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-between gap-2 p-2 sm:p-3 opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
      <button
        type="button"
        aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(productId, productName);
          if (!fav) {
            showToast({
              message: "Produto adicionado aos favoritos.",
              variant: "favorite",
              action: { label: "Ver lista", href: "/favoritos" },
            });
          }
        }}
        className={cn(
          "pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 sm:h-10 sm:w-10",
          fav
            ? "bg-ink text-gold scale-100"
            : "bg-paper/80 backdrop-blur text-ink hover:bg-ink hover:text-paper hover:scale-105"
        )}
      >
        <Heart
          size={18}
          fill={fav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={fav ? 0 : 1.7}
        />
      </button>
      {inStock && (
        <button
          type="button"
          aria-label={`Adicionar ${productName} ao carrinho`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem({
              productId,
              name: productName,
              slug,
              price,
              compareAtPrice,
              visual,
              color,
              size,
              quantity: 1,
              stock: 99,
            });
            showToast({
              message: "Produto adicionado ao carrinho de compras.",
              variant: "cart",
            });
          }}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink/90 text-paper backdrop-blur transition-all duration-300 hover:bg-ink hover:scale-[1.03] sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:font-semibold"
        >
          <ShoppingBag size={14} />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      )}
    </div>
  );
}