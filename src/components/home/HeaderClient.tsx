"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/profile/UserMenu";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { APPAREL_SIZES } from "@/lib/sizes";
import type { Category } from "@/lib/types";

type Cat = Pick<Category, "id" | "slug" | "name">;

const iconBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink";

export function HeaderClient({ categories }: { categories: Cat[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { ids } = useFavorites();
  const { user } = useAuth();
  const pathname = usePathname();
  const megaTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const searchRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setUserMenuOpen(false);
    menuRef.current?.removeAttribute("open");
    searchRef.current?.removeAttribute("open");
  }, [pathname]);

  const scheduleClose = () => {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };
  const openMega = () => {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };

  const closeMobilePanels = () => {
    menuRef.current?.removeAttribute("open");
    searchRef.current?.removeAttribute("open");
  };

  const directLinks = categories.filter((c) =>
    ["camisetas", "calcas", "vestidos", "acessorios"].includes(c.slug)
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-paper",
        scrolled && "shadow-[0_8px_24px_-16px_rgba(17,17,17,0.35)]"
      )}
      onMouseLeave={() => {
        if (window.matchMedia("(hover: hover)").matches) scheduleClose();
      }}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-1 px-2 sm:gap-3 sm:px-4 md:h-[74px] md:px-6">
        <div className="relative z-10 flex min-w-0 items-center gap-0.5 sm:gap-2">
          <details
            ref={menuRef}
            className="relative lg:hidden"
            onToggle={(e) => {
              if (e.currentTarget.open) searchRef.current?.removeAttribute("open");
            }}
          >
            <summary
              className={cn(iconBtn, "cursor-pointer list-none marker:content-none")}
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </summary>
            <div className="absolute left-0 top-full z-[120] mt-1 w-[min(calc(100vw-1.5rem),20rem)] overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-xl">
              <MobilePanel categories={categories} onNavigate={closeMobilePanels} />
            </div>
          </details>

          <Link href="/" className="group flex items-center gap-2" onClick={closeMobilePanels}>
            <span className="text-[26px] font-black tracking-tight text-ink md:text-[30px]">JP</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-mist sm:inline">
              minimal
            </span>
          </Link>
        </div>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          <button
            type="button"
            onClick={() => setMegaOpen((v) => !v)}
            onMouseEnter={openMega}
            aria-expanded={megaOpen}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5"
          >
            Comprar
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-300", megaOpen && "rotate-180")}
            />
          </button>
          {directLinks.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo?categoria=${c.slug}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5 hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/catalogo?ordem=novidades"
            className="rounded-full px-3 py-2 text-sm font-medium text-gold-dark hover:bg-gold/10"
          >
            Novidades
          </Link>
        </nav>

        <div className="ml-3 hidden min-w-0 flex-1 md:block lg:max-w-md xl:max-w-lg">
          <SearchAutocomplete categories={categories} />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[5] flex items-center justify-center md:hidden">
          <details
            ref={searchRef}
            className="pointer-events-auto relative"
            onToggle={(e) => {
              if (e.currentTarget.open) menuRef.current?.removeAttribute("open");
            }}
          >
            <summary
              className={cn(iconBtn, "cursor-pointer list-none marker:content-none")}
              aria-label="Buscar"
            >
              <Search size={19} />
            </summary>
            <div className="absolute left-1/2 top-full z-[120] mt-1 w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-ink/10 bg-paper p-3 shadow-xl">
              <SearchAutocomplete categories={categories} autoFocus onClose={closeMobilePanels} />
            </div>
          </details>
        </div>

        <div className="relative z-10 ml-auto flex items-center">
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Menu da conta"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                className={cn(iconBtn, userMenuOpen && "bg-ink/5")}
              >
                <User size={19} />
              </button>
              <UserMenu open={userMenuOpen} onClose={() => setUserMenuOpen(false)} />
            </div>
          ) : (
            <Link href="/login" aria-label="Entrar" className={iconBtn} onClick={closeMobilePanels}>
              <User size={19} />
            </Link>
          )}

          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className={cn(iconBtn, "relative")}
            onClick={closeMobilePanels}
          >
            <Heart size={19} />
            {ids.length > 0 && (
              <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {ids.length}
              </span>
            )}
          </Link>

          <Link
            href="/carrinho"
            aria-label="Sacola"
            className={cn(iconBtn, "relative")}
            onClick={(e) => {
              closeMobilePanels();
              if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
                e.preventDefault();
                openCart();
              }
            }}
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <MegaMenu open={megaOpen} categories={categories} onClose={() => setMegaOpen(false)} />
    </header>
  );
}

function MobilePanel({
  categories,
  onNavigate,
}: {
  categories: Cat[];
  onNavigate: () => void;
}) {
  return (
    <nav className="max-h-[min(70vh,32rem)] overflow-y-auto p-3">
      <Link href="/" onClick={onNavigate} className="block rounded-lg px-3 py-3 text-base font-medium">
        Início
      </Link>
      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
        Categorias
      </p>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/catalogo?categoria=${c.slug}`}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-sm text-ink/80"
        >
          {c.name}
        </Link>
      ))}
      <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
        Tamanhos
      </p>
      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {APPAREL_SIZES.map((s) => (
          <Link
            key={s}
            href={`/catalogo?tamanho=${encodeURIComponent(s)}`}
            onClick={onNavigate}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-ink/15 px-2.5 text-xs font-semibold"
          >
            {s}
          </Link>
        ))}
      </div>
      <Link href="/catalogo" onClick={onNavigate} className="block rounded-lg px-3 py-3 text-base font-medium">
        Catálogo completo
      </Link>
      <Link
        href="/catalogo?ordem=novidades"
        onClick={onNavigate}
        className="block rounded-lg px-3 py-3 text-base font-medium"
      >
        Novidades
      </Link>
      <Link href="/favoritos" onClick={onNavigate} className="block rounded-lg px-3 py-3 text-base font-medium">
        Favoritos
      </Link>
      <Link href="/pedidos" onClick={onNavigate} className="block rounded-lg px-3 py-3 text-base font-medium">
        Meus pedidos
      </Link>
      <Link href="/perfil" onClick={onNavigate} className="block rounded-lg px-3 py-3 text-base font-medium">
        Minha conta
      </Link>
    </nav>
  );
}

function MegaMenu({
  open,
  categories,
  onClose,
}: {
  open: boolean;
  categories: Cat[];
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-x-0 top-full z-40 hidden border-b border-ink/5 bg-paper shadow-lg lg:block">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-9">
        <div className="col-span-3">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">Categorias</p>
          <div className="grid grid-cols-2 gap-1">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo?categoria=${c.slug}`}
                onClick={onClose}
                className="py-1.5 text-sm text-ink/80 hover:text-gold-dark"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">Tamanhos</p>
          <div className="mb-6 flex flex-wrap gap-1.5">
            {APPAREL_SIZES.map((s) => (
              <Link
                key={s}
                href={`/catalogo?tamanho=${encodeURIComponent(s)}`}
                onClick={onClose}
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-ink/15 px-2.5 text-xs font-semibold hover:bg-ink hover:text-paper"
              >
                {s}
              </Link>
            ))}
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">Destaques</p>
          <ul className="space-y-1">
            {[
              { label: "Novidades", href: "/catalogo?ordem=novidades" },
              { label: "Em promoção", href: "/catalogo?ordem=promocao" },
              { label: "Camisetas", href: "/catalogo?categoria=camisetas" },
              { label: "Outerwear", href: "/catalogo?categoria=jaquetas" },
              { label: "Favoritos", href: "/favoritos" },
            ].map((d) => (
              <li key={d.label}>
                <Link
                  href={d.href}
                  onClick={onClose}
                  className="group flex items-center gap-2 py-1.5 text-sm text-ink/80 hover:text-gold-dark"
                >
                  <Sparkles size={13} className="text-gold" />
                  {d.label}
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-6">
          <Link
            href="/catalogo?ordem=promocao"
            onClick={onClose}
            className="group relative block overflow-hidden rounded-xl"
          >
            <div className="relative aspect-[21/9]">
              <Image
                src="/banners/slate-1280.webp"
                alt="Coleção Winter In"
                fill
                sizes="(min-width: 1280px) 640px, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Coleção FW</p>
                <p className="mt-1 text-xl font-semibold">Winter In Essentials</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
