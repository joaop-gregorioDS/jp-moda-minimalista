"use client";

import { useState } from "react";
import { Check, Copy, QrCode, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { formatBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PixQrModalProps {
  open: boolean;
  total: number;
  pixKey: string;
  processing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PixQrModal({ open, total, pixKey, processing, onClose, onConfirm }: PixQrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      void 0;
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="animate-scale-in relative max-h-[92dvh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-paper p-6 text-center shadow-2xl sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela do Pix"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X size={19} />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <QrCode size={26} />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink">Pague com Pix</h3>
        <p className="mt-1 text-sm text-mist">
          Escaneie o QR Code abaixo com o app do seu banco para pagar{" "}
          <b className="font-semibold text-ink">{formatBRL(total)}</b>.
        </p>

        <div className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-ink/80 bg-white p-4 shadow-inner">
          <QrCode size={132} strokeWidth={1.4} className="text-ink" />
        </div>

        <p className="mt-4 text-xs text-mist">
          Simulação demonstrativa — nenhum pagamento real será realizado.
        </p>

        <button
          type="button"
          onClick={copy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={15} />}
          {copied ? "Chave Pix copiada!" : "Copiar chave Pix"}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={processing}
          className={cn(buttonStyles("primary", "lg"), "mt-3 w-full disabled:opacity-60")}
        >
          {processing ? "Confirmando pagamento…" : `Já paguei · ${formatBRL(total)}`}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-mist">
          A confirmação pode levar alguns instantes. O pagamento deve ser feito em até{" "}
          <b className="font-semibold text-ink">10 minutos</b>.
        </p>
      </div>
    </div>
  );
}