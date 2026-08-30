"use client";

import { CreditCard, Lock } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-mist/70 focus:border-ink focus:outline-none transition-colors";

const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist";

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function formatCvv(v: string) {
  return v.replace(/\D/g, "").slice(0, 4);
}

interface CreditCardFormProps {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  installments: string;
  total: number;
  onCardNumber: (v: string) => void;
  onCardName: (v: string) => void;
  onCardExpiry: (v: string) => void;
  onCardCvv: (v: string) => void;
  onInstallments: (v: string) => void;
}

export function CreditCardForm({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  installments,
  total,
  onCardNumber,
  onCardName,
  onCardExpiry,
  onCardCvv,
  onInstallments,
}: CreditCardFormProps) {
  const parts = parseInt(installments || "1", 10);
  const parcel = total / parts;

  return (
    <div className="mt-5 space-y-5 rounded-2xl border border-ink/10 bg-white p-5 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <CreditCard size={17} className="text-gold-dark" />
        Dados do cartão
      </div>

      <div>
        <label htmlFor="cc-number" className={labelCls}>
          Número do cartão
        </label>
        <input
          id="cc-number"
          value={cardNumber}
          onChange={(e) => onCardNumber(e.target.value)}
          placeholder="0000 0000 0000 0000"
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="cc-name" className={labelCls}>
          Nome do titular
        </label>
        <input
          id="cc-name"
          value={cardName}
          onChange={(e) => onCardName(e.target.value)}
          placeholder="Como está impresso no cartão"
          autoComplete="cc-name"
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cc-expiry" className={labelCls}>
            Validade
          </label>
          <input
            id="cc-expiry"
            value={cardExpiry}
            onChange={(e) => onCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            autoComplete="cc-exp"
            inputMode="numeric"
            maxLength={5}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cc-cvv" className={labelCls}>
            CVV
          </label>
          <input
            id="cc-cvv"
            value={cardCvv}
            onChange={(e) => onCardCvv(formatCvv(e.target.value))}
            placeholder="•••"
            type="password"
            autoComplete="cc-csc"
            inputMode="numeric"
            maxLength={4}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="installments" className={labelCls}>
          Parcelamento
        </label>
        <select
          id="installments"
          value={installments}
          onChange={(e) => onInstallments(e.target.value)}
          className={cn(inputCls, "appearance-none")}
        >
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}x de {formatBRL(total / n)} sem juros
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between rounded-xl bg-sand/60 px-4 py-3 text-sm">
        <span className="text-mist">Valor da parcela ({parts}x)</span>
        <span className="font-semibold text-ink">{formatBRL(parcel)}</span>
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-700">
        <Lock size={14} className="mt-0.5 shrink-0" />
        Ambiente 100% seguro. Suas informações são criptografadas e{" "}
        <strong className="font-semibold">não são armazenadas</strong> nos nossos servidores.
      </p>
    </div>
  );
}