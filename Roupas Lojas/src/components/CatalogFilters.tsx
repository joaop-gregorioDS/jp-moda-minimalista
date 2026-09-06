"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { APPAREL_SIZES, SHOE_SIZES, catalogHref } from "@/lib/sizes";
import { cn } from "@/lib/utils";

const ORDER_OPTIONS = [
  { value: "", label: "Relevância" },
  { value: "novidades", label: "Novidades" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "promocao", label: "Em promoção" },
];

interface Category {
  id: number;
  slug: string;
  name: string;
}

function SizeLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-all",
        active ? "border-gold bg-gold text-ink" : "border-ink/15 text-ink hover:border-ink/40"
      )}
    >
      {children}
    </Link>
  );
}

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("categoria") ?? "";
  const ordem = params.get("ordem")?.replace(/[_-]/g, "-") ?? "";
  const tamanho = params.get("tamanho") ?? "";
  const orderValue = ORDER_OPTIONS.some((o) => o.value === ordem) ? ordem : "";

  const href = (patch: Record<string, string | undefined>) => catalogHref(patch, params);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative z-30 min-w-0 flex-1">
          <SearchAutocomplete categories={categories} />
        </div>
        <select
          aria-label="Ordenar por"
          value={orderValue}
          onChange={(e) => router.push(href({ ordem: e.target.value }))}
          className="h-[42px] w-full cursor-pointer rounded-full border border-ink/15 bg-white px-5 text-sm font-medium text-ink shadow-sm focus:outline-none sm:w-auto"
        >
          {ORDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Link
          href={href({ categoria: "" })}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
            !category ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white text-ink hover:border-ink/40"
          )}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={href({ categoria: c.slug })}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
              category === c.slug
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-white text-ink hover:border-ink/40"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-mist">Tamanho</span>
          {tamanho && (
            <Link href={href({ tamanho: "" })} className="text-xs font-medium text-gold-dark underline-offset-2 hover:underline">
              Limpar tamanho
            </Link>
          )}
        </div>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          <SizeLink href={href({ tamanho: "" })} active={!tamanho}>
            Todos
          </SizeLink>
          {APPAREL_SIZES.map((s) => (
            <SizeLink key={s} href={href({ tamanho: tamanho === s ? "" : s })} active={tamanho === s}>
              {s}
            </SizeLink>
          ))}
          <span className="mx-1 hidden h-11 w-px shrink-0 bg-ink/10 sm:block" aria-hidden />
          {SHOE_SIZES.map((s) => (
            <SizeLink key={s} href={href({ tamanho: tamanho === s ? "" : s })} active={tamanho === s}>
              {s}
            </SizeLink>
          ))}
        </div>
      </div>
    </div>
  );
}
