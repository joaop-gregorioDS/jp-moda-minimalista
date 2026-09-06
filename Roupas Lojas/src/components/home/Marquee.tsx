import { ArrowRight, Sparkles } from "lucide-react";

const ITEMS = [
  "Cupom JPQUIET15",
  "Frete grátis acima de R$ 299",
  "Pix com 5% de volta",
  "Troca fácil em 30 dias",
  "Coleção Winter In",
  "Couro legítimo",
  "Algodão premium",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-gold py-3.5">
      <div className="animate-marquee flex w-max items-center gap-10">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            {item}
            <Sparkles size={14} className="text-ink/50" />
          </span>
        ))}
      </div>
    </div>
  );
}