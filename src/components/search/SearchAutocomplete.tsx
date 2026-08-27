"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { cn, formatBRL } from "@/lib/utils";
import { APPAREL_SIZES, productSizeHref } from "@/lib/sizes";
import type { SearchSuggestion } from "@/lib/types";

type Cat = { slug: string; name: string };

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-gold/35 text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchAutocomplete({
  categories = [],
  onClose,
  overlay = false,
  autoFocus = false,
  className,
}: {
  categories?: Cat[];
  onClose?: () => void;
  overlay?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(overlay);
  const [active, setActive] = useState(0);

  const q = query.trim();
  const preview = results[active] ?? results[0] ?? null;
  const matchedCats = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.includes(q.toLowerCase())).slice(0, 4)
    : [];

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (overlay) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [overlay]);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        const list = (data.results as SearchSuggestion[]) ?? [];
        setResults(list);
        setActive(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  const goCatalog = () => {
    const href = q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo";
    setOpen(false);
    onClose?.();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(results.length - 1, i + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    }
    if (e.key === "Enter") {
      if (open && results[active]) {
        e.preventDefault();
        setOpen(false);
        onClose?.();
        router.push(`/produto/${results[active].slug}`);
      }
    }
  };

  const showPanel = open && (q.length >= 1 || overlay);

  return (
    <div ref={rootRef} className={cn("relative w-full", overlay && "flex h-full min-h-0 flex-col", className)}>
      <form
        role="search"
        className={cn(
          "flex items-center gap-2",
          overlay ? "border-b border-ink/10 px-4 py-3" : "rounded-full border border-ink/15 bg-white px-3.5 py-2 shadow-sm focus-within:border-ink"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          goCatalog();
        }}
      >
        {overlay && (
          <button
            type="button"
            aria-label="Fechar busca"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-ink/5"
          >
            <X size={20} />
          </button>
        )}
        <Search size={17} className="shrink-0 text-mist" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Buscar peças, categorias, tamanhos…"
          className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-mist focus:outline-none sm:text-[15px]"
        />
        {query && (
          <button
            type="button"
            aria-label="Limpar"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="text-mist hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
        <button
          type="submit"
          className="hidden rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper sm:inline-flex"
        >
          Buscar
        </button>
      </form>

      {showPanel && (
        <div
          className={cn(
            "z-50 overflow-hidden bg-white",
            overlay
              ? "flex min-h-0 flex-1 flex-col"
              : "absolute inset-x-0 top-[calc(100%+8px)] rounded-2xl border border-ink/10 shadow-[0_24px_60px_-24px_rgba(17,17,17,0.4)]"
          )}
        >
          <div className={cn("md:grid md:grid-cols-[minmax(0,1fr)_220px]", overlay && "flex min-h-0 flex-1 flex-col md:grid")}>
            <div id={listId} role="listbox" className={cn("min-h-0 overflow-y-auto p-2", overlay ? "flex-1" : "max-h-[min(58vh,28rem)]")}>
              {q.length < 2 && (
                <div className="space-y-4 p-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">Tamanhos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {APPAREL_SIZES.map((s) => (
                        <Link
                          key={s}
                          href={`/catalogo?tamanho=${encodeURIComponent(s)}`}
                          onClick={onClose}
                          className="min-h-10 min-w-10 rounded-lg border border-ink/15 px-3 text-center text-xs font-semibold leading-10 text-ink hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {categories.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">Categorias</p>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.slice(0, 8).map((c) => (
                          <Link
                            key={c.slug}
                            href={`/catalogo?categoria=${c.slug}`}
                            onClick={onClose}
                            className="rounded-full border border-ink/15 px-3 py-2 text-xs font-medium text-ink hover:border-ink hover:bg-ink hover:text-paper"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {q.length >= 2 && loading && <p className="px-3 py-4 text-sm text-mist">Buscando…</p>}

              {q.length >= 2 && !loading && matchedCats.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5 px-2">
                  {matchedCats.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/catalogo?categoria=${c.slug}`}
                      onClick={onClose}
                      className="rounded-full bg-sand px-3 py-1.5 text-xs font-medium text-ink hover:bg-gold/30"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}

              {q.length >= 2 && !loading && results.length === 0 && (
                <p className="px-3 py-4 text-sm text-mist">Nada encontrado para “{q}”.</p>
              )}

              {results.map((r, i) => (
                <div
                  key={r.id}
                  id={`${listId}-${r.id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "rounded-xl p-2 transition-colors",
                    i === active ? "bg-ink/5" : "hover:bg-ink/[0.03]"
                  )}
                >
                  <Link
                    href={`/produto/${r.slug}`}
                    onClick={onClose}
                    className="flex items-start gap-3"
                  >
                    <ProductVisual
                      motif={r.visual}
                      color={r.colorHex}
                      className="h-14 w-12 shrink-0 overflow-hidden rounded-lg"
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        <Highlight text={r.name} query={q} />
                      </p>
                      <p className="text-xs text-mist">{r.categoryName}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">{formatBRL(r.price)}</span>
                  </Link>
                  {r.sizes?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 sm:pl-[60px]">
                      {r.sizes.slice(0, 8).map((s) => (
                        <Link
                          key={s}
                          href={productSizeHref(r.slug, s)}
                          onClick={onClose}
                          className="inline-flex min-h-8 min-w-8 items-center justify-center rounded border border-ink/15 px-1.5 text-[10px] font-semibold text-ink hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {q.length >= 2 && results.length > 0 && (
                <button
                  type="button"
                  onClick={goCatalog}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gold-dark hover:bg-gold/10"
                >
                  Ver todos os resultados <ArrowRight size={14} />
                </button>
              )}
            </div>

            {preview && (
              <aside className="hidden border-l border-ink/8 bg-sand/40 p-4 md:flex md:flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">Pré-visualização</p>
                <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-ink/10">
                  <div className="relative aspect-[4/5]">
                    <div className="absolute inset-0">
                      <ProductVisual
                        motif={preview.visual}
                        color={preview.colorHex}
                        size="lg"
                        label={preview.name}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold text-ink">{preview.name}</p>
                <p className="text-xs text-mist">{preview.categoryName}</p>
                <p className="mt-1 text-base font-bold tabular-nums">{formatBRL(preview.price)}</p>
                {preview.sizes?.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-mist">Tamanhos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preview.sizes.map((s) => (
                        <Link
                          key={s}
                          href={productSizeHref(preview.slug, s)}
                          onClick={onClose}
                          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-ink/15 px-2 text-xs font-semibold hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <Link
                  href={`/produto/${preview.slug}`}
                  onClick={onClose}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-black"
                >
                  Ver peça <ArrowRight size={14} />
                </Link>
              </aside>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
