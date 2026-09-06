"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CarrinhoPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-mist">
          <ShoppingBag size={30} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Sua sacola está vazia</h1>
        <p className="mt-2 text-sm text-mist">
          Adicione peças que você ama para ver o resumo aqui.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-all hover:bg-black"
        >
          Explorar catálogo <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Sua sacola
        <span className="ml-3 align-middle text-sm font-medium text-mist">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <section aria-label="Itens da sacola">
          <ul className="py-2">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} />
            ))}
          </ul>
        </section>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}