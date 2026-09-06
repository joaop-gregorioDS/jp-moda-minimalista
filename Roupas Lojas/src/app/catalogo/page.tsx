import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/queries";
import { Suspense } from "react";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explore as peças JP — coleção curada de moda minimalista.",
};

function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const sp = await searchParams;

  const order = getOne(sp.ordem) ?? "";
  const page = Math.max(1, parseInt(getOne(sp.pagina) ?? "1", 10) || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      q: getOne(sp.q),
      category: getOne(sp.categoria),
      size: getOne(sp.tamanho),
      order,
      page,
      pageSize: 24,
    }),
  ]);

  const { products, total, totalPages } = result;
  const active = new URLSearchParams(
    Object.entries(sp).filter(([, v]) => v !== undefined) as [string, string][]
  );
  active.delete("pagina");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark">
          {total} peças
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl">
          Catálogo completo
        </h1>
      </header>

      <Suspense fallback={<div className="h-28 rounded-2xl bg-sand/60" />}>
        <CatalogFilters categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <div className="my-16 flex flex-col items-center gap-3 text-center">
          <p className="font-semibold text-ink">Nenhum resultado</p>
          <p className="max-w-sm text-sm text-mist">
            Não achamos peças com esses filtros. Tente remover alguns.
          </p>
          <Link href="/catalogo" className="mt-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i < 4} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Paginação">
          {page > 1 && (
            <Link
              href={`/catalogo?${active.toString()}&pagina=${page - 1}`}
              aria-label="Página anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
            >
              <ChevronLeft size={16} />
            </Link>
          )}
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const show =
              p === 1 || p === totalPages || Math.abs(p - page) <= 1;
            if (!show) return null;
            return (
              <Link
                key={p}
                href={`/catalogo?${active.toString()}&pagina=${p}`}
                aria-current={p === page ? "page" : undefined}
                className={[
                  "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors",
                  p === page
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink hover:bg-ink/5",
                ].join(" ")}
              >
                {p}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link
              href={`/catalogo?${active.toString()}&pagina=${page + 1}`}
              aria-label="Próxima página"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}