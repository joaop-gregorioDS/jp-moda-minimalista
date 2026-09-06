"use client";

import { useEffect, useState } from "react";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/Button";

const STORAGE_KEY = "jp_cookie_consent_v1";

const settings = [
  { id: "necessarios", label: "Necessários", desc: "Funcionamento básico do site e carrinho.", required: true, on: true },
  { id: "preferencias", label: "Preferências", desc: "Guarda suas escolhas, como cores e idioma.", on: true },
  { id: "estatisticas", label: "Estatísticas", desc: "Entendem como você usa o site, de forma anônima.", on: false },
  { id: "marketing", label: "Marketing", desc: "Cupons e avisos de lançamentos no seu e-mail.", on: false },
];

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [choices, setChoices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChoices(Object.fromEntries(settings.map((s) => [s.id, s.on])));
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) === null);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (allowAll: boolean) => {
    const next = allowAll
      ? Object.fromEntries(settings.map((s) => [s.id, true]))
      : { ...choices, necessarios: true };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ allowAll, ...next }));
    } catch {
      void 0;
    }
    setVisible(false);
    setManaging(false);
  };

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choices));
    } catch {
      void 0;
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-5">
      <div className="animate-slide-up relative mx-auto max-w-3xl overflow-hidden rounded-2xl glass-dark shadow-[0_-10px_60px_rgba(17,17,17,0.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        <div className="p-5 sm:p-6">
          {!managing ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Cookie size={19} />
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-paper">Privacidade em primeiro lugar</h3>
                  <p className="mt-1 text-sm leading-relaxed text-paper/75">
                    Usamos cookies para melhorar sua experiência, medir audiência e (com seu
                    consentimento) oferecer ofertas relevantes. Saiba mais em{" "}
                    <a href="/institucional/politica-de-privacidade" className="text-gold underline underline-offset-2">
                      Política de Privacidade
                    </a>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Dispensar aviso"
                  className="rounded-full p-1 text-paper/50 transition-colors hover:bg-paper/10 hover:text-paper"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => save(true)}
                  className={cn(buttonStyles("gold", "md"), "w-full sm:w-auto")}
                >
                  Aceitar todos
                </button>
                <button
                  type="button"
                  onClick={() => setManaging(true)}
                  className={cn(
                    buttonStyles("outline", "md"),
                    "w-full border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink sm:w-auto"
                  )}
                >
                  <Settings2 size={15} /> Gerenciar
                </button>
                <button
                  type="button"
                  onClick={() => save(false)}
                  className="w-full text-left text-sm text-paper/60 underline underline-offset-4 hover:text-paper sm:ml-auto sm:w-auto sm:text-right"
                >
                  Somente necessários
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-paper">Definições de cookies</h3>
                  <p className="text-xs text-paper/60">Você controla o que quer compartilhar.</p>
                </div>
              </div>
              <ul className="space-y-2">
                {settings.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-paper/10 bg-paper/5 p-3.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-paper">
                        {s.label}
                        {s.required && (
                          <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-gold">
                            obrigatório
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-paper/60">{s.desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={choices[s.id]}
                      disabled={s.required}
                      onClick={() =>
                        setChoices((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                      }
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
                        choices[s.id] ? "bg-gold" : "bg-paper/20",
                        s.required && "cursor-not-allowed opacity-70"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all duration-300",
                          choices[s.id] ? "left-[22px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => save(false)}
                  className={cn(buttonStyles("gold", "md"), "w-full flex justify-center sm:w-auto")}
                >
                  Salvar escolhas
                </button>
                <button
                  type="button"
                  onClick={() => save(true)}
                  className={cn(
                    buttonStyles("outline", "md"),
                    "w-full border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink sm:w-auto"
                  )}
                >
                  Aceitar todos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}