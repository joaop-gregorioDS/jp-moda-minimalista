"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const brands = ["JP Minimal", "JP Essenciais", "JP Outerwear", "JP Atelier"];
const channels = ["E-MAIL", "SMS", "WHATSAPP"];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  );
}

function ChannelCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center">
      <span className="sr-only">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
          checked ? "border-ink bg-ink" : "border-ink/25 bg-white"
        )}
      >
        {checked && <Check size={11} strokeWidth={3.5} className="text-paper" />}
      </span>
    </label>
  );
}

export default function PerfilPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Record<string, Record<string, boolean>>>({});

  if (!user) return null;

  const tokens = user.name.trim().split(/\s+/);
  const firstName = tokens[0] ?? "";
  const lastName = tokens.slice(1).join(" ") || "Não informado";
  const displayName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  const phone = user.phone ?? "Não informado";

  const personal = [
    { label: "Nome", value: firstName.toUpperCase() },
    { label: "Email", value: user.email },
    { label: "CPF", value: "Não informado" },
    { label: "Data de nascimento", value: "Não informado" },
  ];

  const personalRight = [
    { label: "Sobrenome", value: lastName.toUpperCase() },
    { label: "Gênero", value: "Não informado" },
    { label: "Telefone", value: phone },
  ];

  const toggle = (brand: string, channel: string) =>
    setPrefs((prev) => ({ ...prev, [brand]: { ...prev[brand], [channel]: !prev[brand]?.[channel] } }));

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-bold uppercase tracking-tight text-ink">Dados pessoais</h1>

      <section className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Informações da conta</h2>
            <p className="mt-1 text-xs text-mist">Dados cadastrados para a conta {displayName}</p>
          </div>
          <button
            type="button"
            aria-label="Editar dados pessoais"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/15 text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <div className="space-y-7">
            {personal.map((f) => (
              <Field key={f.label} {...f} />
            ))}
          </div>
          <div className="space-y-7">
            {personalRight.map((f) => (
              <Field key={f.label} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Preferências de comunicação</h2>
        <p className="mt-1 max-w-xl text-xs text-mist">
          Quer ficar por dentro das novidades da JP Minimal? Escolha os canais preferidos e receba
          nossas ofertas no seu e-mail, SMS ou WhatsApp.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <div className="min-w-[28rem]">
            <div className="grid grid-cols-4 items-center border-b border-ink/10 px-4 py-3 md:grid-cols-[minmax(0,2fr)_repeat(3,1fr)] md:px-6">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink">Linhas</span>
              {channels.map((c) => (
                <span key={c} className="text-center text-[11px] font-semibold uppercase tracking-wide text-mist">
                  {c}
                </span>
              ))}
            </div>
            {brands.map((brand, i) => (
              <div
                key={brand}
                className={cn(
                  "grid grid-cols-4 items-center px-4 py-4 md:grid-cols-[minmax(0,2fr)_repeat(3,1fr)] md:px-6",
                  i < brands.length - 1 && "border-b border-ink/5"
                )}
              >
                <span className="pr-3 text-xs text-ink sm:pr-4 sm:text-sm">{brand}</span>
                {channels.map((channel) => {
                  const checked = Boolean(prefs[brand]?.[channel]);
                  return (
                    <div key={channel} className="flex justify-center">
                      <ChannelCheckbox
                        checked={checked}
                        label={`${brand} · ${channel}`}
                        onChange={() => toggle(brand, channel)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}