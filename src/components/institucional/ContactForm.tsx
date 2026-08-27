"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/Button";

const subjects = ["Pedido", "Troca e devolução", "Pagamento", "Meus dados (LGPD)", "Outro assunto"];

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-mist/70 transition-colors focus:border-ink focus:outline-none";

const labelBase = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-mist";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 size={26} />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-ink">Mensagem enviada!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
          Recebemos a sua solicitação. Nosso time responde em até <strong>2 dias úteis</strong>{" "}
          para o e-mail informado.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-ink underline underline-offset-4 hover:text-gold-dark"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className={labelBase}>
            Nome
          </label>
          <input id="nome" name="nome" type="text" required placeholder="Seu nome completo" className={inputBase} />
        </div>
        <div>
          <label htmlFor="email" className={labelBase}>
            E-mail
          </label>
          <input id="email" name="email" type="email" required placeholder="voce@email.com.br" className={inputBase} />
        </div>
      </div>

      <div>
        <label htmlFor="assunto" className={labelBase}>
          Assunto
        </label>
        <select id="assunto" name="assunto" required defaultValue="" className={cn(inputBase, "appearance-none")}>
          <option value="" disabled>
            Selecione um assunto
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className={labelBase}>
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          placeholder="Conte para a gente o que você precisa…"
          className={cn(inputBase, "resize-y")}
        />
      </div>

      <button type="submit" className={cn(buttonStyles("primary", "md"), "w-full sm:w-auto")}>
        <Send size={15} /> Enviar mensagem
      </button>

      <p className="text-xs leading-relaxed text-mist">
        Ao enviar, você concorda com o tratamento dos seus dados conforme nossa{" "}
        <a href="/institucional/politica-de-privacidade" className="underline underline-offset-2 hover:text-ink">
          Política de Privacidade
        </a>{" "}
        e com a{" "}
        <a href="/institucional/lgpd-e-cookies" className="underline underline-offset-2 hover:text-ink">
          LGPD
        </a>
        . Usamos seus dados apenas para responder ao seu contato.
      </p>
    </form>
  );
}