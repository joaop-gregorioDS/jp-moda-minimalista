"use client";

import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jp_cookie_notice_demo_v1";

const CATEGORIES = [
  {
    id: "necessarios",
    label: "Estritamente necessários",
    desc: "Lembram sua sessão, carrinho e preferências de segurança. Sem eles o site não funciona.",
    required: true,
    on: true,
  },
  {
    id: "desempenho",
    label: "Desempenho",
    desc: "Medem como você usa o site, de forma agregada e anônima.",
    on: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    desc: "Personalizam ofertas e medem campanhas, com o seu consentimento.",
    on: false,
  },
];

export function CookieNoticeDemo() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem(STORAGE_KEY) === null;
    } catch {
      return true;
    }
  });
  const [managing, setManaging] = useState(false);
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, c.on]))
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window === "undefined") return;
      try {
        if (localStorage.getItem(STORAGE_KEY) === null) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const save = (all: boolean) => {
    const next = all
      ? Object.fromEntries(CATEGORIES.map((c) => [c.id, true]))
      : { ...choices, necessarios: true };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      void 0;
    }
    setVisible(false);
    setManaging(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[90] w-[min(calc(100vw-2rem),400px)] animate-slide-up">
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xl shadow-ink/15">
        {!managing ? (
          <div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                <Cookie size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-ink">Nossa política de cookies</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/70">
                  Usamos cookies para garantir o funcionamento da loja e, com a sua
                  permissão, melhorar sua experiência e exibir ofertas relevantes. Saiba
                  mais na nossa página de{" "}
                  <a
                    href="/institucional/lgpd-e-cookies"
                    className="text-ink underline underline-offset-2 hover:text-gold-dark"
                  >
                    LGPD e Cookies
                  </a>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Fechar aviso"
                className="rounded-full p-1 text-mist transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save(true)}
                className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-black"
              >
                Aceitar todos
              </button>
              <button
                type="button"
                onClick={() => save(false)}
                className="rounded-full border border-ink/20 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink"
              >
                Somente necessários
              </button>
              <button
                type="button"
                onClick={() => setManaging(true)}
                className="ml-auto inline-flex items-center gap-1 px-2 py-2 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
              >
                <Settings2 size={13} /> Configurar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                <Settings2 size={19} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">Configurar cookies</h3>
                <p className="text-xs text-ink/60">Você escolhe o que quer compartilhar.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-ink/10 bg-paper/60 p-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-ink">
                      {c.label}
                      {c.required && (
                        <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[10px] font-semibold uppercase text-gold-dark">
                          obrigatório
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={choices[c.id]}
                      disabled={c.required}
                      onClick={() => setChoices((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
                        choices[c.id] ? "bg-ink" : "bg-ink/15",
                        c.required && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
                          choices[c.id] && "translate-x-5"
                        )}
                      />
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">{c.desc}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save(false)}
                className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-black"
              >
                Salvar escolhas
              </button>
              <button
                type="button"
                onClick={() => save(true)}
                className="rounded-full border border-ink/20 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink"
              >
                Aceitar todos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}