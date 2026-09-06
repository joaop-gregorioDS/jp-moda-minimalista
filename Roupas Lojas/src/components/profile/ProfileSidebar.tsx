"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  CreditCard,
  Heart,
  KeyRound,
  LogOut,
  MapPin,
  Package,
  RefreshCcw,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const items = [
  { href: "/perfil", icon: User, label: "Dados pessoais" },
  { href: "/perfil/enderecos", icon: MapPin, label: "Endereços" },
  { href: "/pedidos", icon: Package, label: "Pedidos" },
  { href: "/perfil/devolucoes", icon: RefreshCcw, label: "Devolução" },
  { href: "/perfil/autenticacao", icon: KeyRound, label: "Autenticação" },
  { href: "/favoritos", icon: Heart, label: "Minha Lista de Favoritos" },
  { href: "/perfil/vale-credito", icon: CreditCard, label: "Vale Crédito" },
];

export function ProfileSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const name = user?.name?.trim() ?? "";

  return (
    <aside className="w-full md:w-60">
      <div className="flex items-center gap-4 border-b border-ink/10 pb-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink">
          <User size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="truncate text-xs text-mist">{user?.email}</p>
        </div>
      </div>

      <nav className="mt-1">
        {items.map(({ href, icon: Icon, label }) => {
          const active = href === "/perfil" ? pathname === "/perfil" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "group flex items-center gap-3 border-b border-ink/10 py-3 text-[13px] text-ink/70 transition-colors hover:text-ink",
                active && "font-semibold text-ink"
              )}
            >
              <Icon
                size={16}
                className="shrink-0 transition-colors group-hover:text-ink"
              />
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="shrink-0 text-mist transition-colors group-hover:text-ink" />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="group flex w-full items-center gap-3 py-3 text-left text-[13px] text-ink/70 transition-colors hover:text-ink"
        >
          <LogOut size={16} className="shrink-0 transition-colors group-hover:text-ink" />
          <span className="flex-1">Sair</span>
        </button>
      </nav>
    </aside>
  );
}