"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-mist/70 focus:border-ink focus:outline-none transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace("/perfil");
  }, [user, router]);

  if (user) {
    return (
      <div className="mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-sm text-mist">Redirecionando para sua conta…</p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/perfil");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8 md:py-14">
      <div className="mb-8 text-center">
        <span className="inline-block text-3xl font-black tracking-tight text-ink">JP</span>
        <h1 className="mt-2 text-2xl font-bold text-ink">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-mist">Entre para ver seus pedidos e favoritos.</p>
      </div>

      <form
        method="post"
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(e);
        }}
        className="flex flex-col gap-4"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">E-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="voce@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">Senha</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
        </label>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className={cn(buttonStyles("primary", "lg"), "mt-1 w-full disabled:opacity-50")}
        >
          {busy ? <Loader2 size={17} className="animate-spin" /> : <LogIn size={17} />}
          {busy ? "Entrando…" : "Entrar"}
        </button>
        <Link href="/catalogo" className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-ink">
          Continuar visitando sem entrar <ArrowRight size={14} />
        </Link>
      </form>

      <p className="mt-8 border-t border-ink/10 pt-6 text-center text-sm text-mist">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dark">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}