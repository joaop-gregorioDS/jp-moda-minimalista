import { Headset, PiggyBank, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Frete grátis", text: "Acima de R$ 299, para todo o Brasil" },
  { icon: PiggyBank, title: "Pix com desconto", text: "5% de volta em pagamentos no Pix" },
  { icon: RefreshCcw, title: "Troca fácil", text: "Até 30 dias, sem burocracia" },
  { icon: ShieldCheck, title: "Pagamento seguro", text: "Dados protegidos de ponta a ponta" },
  { icon: Headset, title: "Atendimento humano", text: "Fale com gente real, de seg a sex" },
];

export function ValueProps() {
  return (
    <section aria-label="Benefícios" className="border-y border-ink/10 bg-white/50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto md:grid md:grid-cols-5 md:gap-3 md:overflow-visible">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex min-w-[240px] flex-1 snap-start items-start gap-3 rounded-2xl border border-ink/5 bg-paper/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_18px_40px_-20px_rgba(168,135,88,0.4)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-mist">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}