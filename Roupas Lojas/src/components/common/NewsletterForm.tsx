"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        setDone(true);
        try {
          localStorage.setItem("jp_newsletter", email);
        } catch {
          void 0;
        }
      }}
    >
      {done ? (
        <p className="flex items-center gap-2 text-sm text-gold">
          <Check size={15} /> Inscrito (a). Bem-vindo ao clube JP.
        </p>
      ) : (
        <div className="flex overflow-hidden rounded-full border border-paper/20 bg-paper/5 p-1 focus-within:border-gold/60">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            aria-label="E-mail para newsletter"
            className="w-full bg-transparent px-4 py-2 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Assinar newsletter"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-colors hover:bg-gold-dark hover:text-paper"
          >
            <Send size={15} />
          </button>
        </div>
      )}
    </form>
  );
}