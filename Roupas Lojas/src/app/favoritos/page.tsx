"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@/lib/queries";

export default function FavoritosPage() {
  const { ids, ready } = useFavorites();
  const [products, setProducts] = useState<ProductCardData[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (ids.length === 0) {
      setProducts([]);
      return;
    }

    setProducts(null);
    const ac = new AbortController();
    const timer = window.setTimeout(() => ac.abort(), 8000);

    fetch(`/api/products/by-ids?ids=${ids.join(",")}`, { signal: ac.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [ready, ids.join(",")]);

  if (!ready || (ids.length > 0 && products === null)) {
    return (
      <div className="mx-auto flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-mist">Carregando favoritos…</p>
      </div>
    );
  }

  if (ids.length === 0 || !products || products.length === 0) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-mist">
          <Heart size={30} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Lista de desejos vazia</h1>
        <p className="mt-2 text-sm text-mist">Toque no coração de uma peça para salvá-la aqui.</p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-black"
        >
          Explorar catálogo <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Favoritos
        <span className="ml-3 align-middle text-sm font-semibold text-mist">
          {products.length} {products.length === 1 ? "peça" : "peças"}
        </span>
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
