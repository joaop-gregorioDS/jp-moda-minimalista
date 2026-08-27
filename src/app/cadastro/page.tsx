"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-mist/70 focus:border-ink focus:outline-none transition-colors";

export default function CadastroPage() {
  const router = useRouter();
  const { register, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password, phone);
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
        <h1 className="mt-2 text-2xl font-bold text-ink">Criar conta</h1>
        <p className="mt-1 text-sm text-mist">Cupons, pedidos e favoritos num só lugar.</p>
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
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">Nome</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Maria da Silva" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">E-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="voce@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">Telefone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="(11) 99999-9999" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">Senha</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" minLength={6} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">Confirmar</span>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} placeholder="••••••••" />
          </label>
        </div>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className={cn(buttonStyles("primary", "lg"), "mt-1 w-full disabled:opacity-50")}
        >
          {busy ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={17} />}
          {busy ? "Criando…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-8 border-t border-ink/10 pt-6 text-center text-sm text-mist">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dark">
          Faça login
        </Link>
      </p>
    </div>
  );
}