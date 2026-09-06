"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, LogOut, Package, RefreshCcw, User, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/perfil", icon: User, label: "Minha conta" },
  { href: "/pedidos", icon: Package, label: "Pedidos" },
  { href: "/perfil/devolucoes", icon: RefreshCcw, label: "Devoluções" },
  { href: "/favoritos", icon: Heart, label: "Meus favoritos" },
];

export function UserMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-scale-in rounded-2xl border border-ink/10 bg-white shadow-lg shadow-ink/10">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist">
            Olá, {firstName.toUpperCase()}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="p-2">
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Icon size={16} className="shrink-0 text-mist" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-ink/10 p-2">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <LogOut size={16} className="shrink-0 text-mist" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
}