"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, FileText, Headphones, RefreshCcw, Ruler, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/institucional/troca-e-devolucao", label: "Troca e Devolução", icon: RefreshCcw },
  { href: "/institucional/guia-de-medidas", label: "Guia de Medidas", icon: Ruler },
  { href: "/institucional/fale-conosco", label: "Fale Conosco", icon: Headphones },
  { href: "/institucional/politica-de-privacidade", label: "Política de Privacidade", icon: ShieldCheck },
  { href: "/institucional/termos-de-uso", label: "Termos de Uso", icon: FileText },
  { href: "/institucional/lgpd-e-cookies", label: "LGPD e Cookies", icon: Cookie },
];

export function InstitutionalSidebar() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Páginas institucionais"
        className="no-scrollbar -mx-4 mb-2 flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden"
      >
        {items.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              pathname === href
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-ink/10 bg-white p-3">
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
            Institucional
          </p>
          <nav aria-label="Páginas institucionais" className="space-y-0.5">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-ink/[0.04] font-semibold text-ink"
                      : "text-ink/65 hover:bg-ink/[0.04] hover:text-ink"
                  )}
                >
                  <Icon size={16} className={cn("shrink-0", active ? "text-ink" : "text-mist")} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}