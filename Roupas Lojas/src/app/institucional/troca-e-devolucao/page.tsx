import type { Metadata } from "next";
import {
  CalendarClock,
  Check,
  FileText,
  Mail,
  RefreshCcw,
  RotateCcw,
  Scissors,
  Tag,
  Truck,
  Undo2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Troca e Devolução",
  description:
    "Saiba como trocar ou devolver uma peça na JP. Prazos legais do CDC (direito de arrependimento e garantia), condições das peças e passo a passo da logística reversa.",
};

const deadlines = [
  {
    icon: Undo2,
    title: "Direito de arrependimento",
    period: "Até 7 dias corridos",
    text: "Se algo não trouxer o conforto e a elegância que você esperava, você pode desistir da compra em até 7 (sete) dias corridos, contados do recebimento da mercadoria, sem precisar justificar o motivo — conforme o artigo 49 do Código de Defesa do Consumidor.",
  },
  {
    icon: CalendarClock,
    title: "Defeito de fabricação",
    period: "90 dias (bens duráveis)",
    text: "As roupas são consideradas bens duráveis. Em caso de defeito de fabricação identificado na peça, você tem 90 (noventa) dias, contados da entrega, para solicitar a garantia legal. Para bens não duráveis, o prazo é de 30 (trinta) dias (art. 26, inciso II do CDC).",
  },
];

const conditions = [
  "A peça não pode ter sido usada ou lavada",
  "A etiqueta original deve estar afixada à peça",
  "Sem manchas, marcas de perfume ou sinais de desgaste",
  "Nenhum tipo de alteração (bainhas, ajustes ou customização)",
  "Acompanhada da Nota Fiscal ou do comprovante do pedido",
];

const steps = [
  {
    icon: Mail,
    title: "Abra o atendimento",
    text: "Fale com a gente pelo formulário de “Fale Conosco”, informando o número do pedido e o motivo da troca ou devolução.",
  },
  {
    icon: FileText,
    title: "Análise da solicitação",
    text: "Após confirmarmos que a peça atende às condições, aprovamos o processo e a forma de devolução do valor — reembolso, vale crédito ou troca por outro tamanho/peça.",
  },
  {
    icon: Truck,
    title: "Código de postagem",
    text: "No mesmo dia da aprovação, enviamos por e-mail o código de postagem dos Correios — uma etiqueta pré-paga para o envio de volta. Você não paga nada pelo frete de retorno.",
  },
  {
    icon: RefreshCcw,
    title: "Postagem e retorno",
    text: "Leve o pacote a qualquer agência ou locker dos Correios com a etiqueta impressa. Assim que o pacote chegar ao nosso centro e for conferido, processamos a troca ou o reembolso em até 24h úteis.",
  },
];

const timelines = [
  { label: "Confirmação de recebimento e análise", days: "Até 2 dias úteis" },
  { label: "Reembolso no cartão", days: "Em até 2 faturas, conforme a operadora" },
  { label: "Reembolso via Pix ou boleto", days: "Até 5 dias úteis" },
  { label: "Envio da nova peça (troca)", days: "Até 5 dias úteis após a análise" },
];

export default function TrocaDevolucaoPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Troca e Devolução
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          Trocas e devoluções são simples e gratuitas. Aqui você encontra seus prazos,
          as condições para aceitação e o passo a passo para solicitar a logística
          reversa com código de postagem dos Correios.
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-mist">
          Atualizada em 08/08/2026
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {deadlines.map(({ icon: Icon, title, period, text }) => (
          <div key={title} className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                <Icon size={19} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">{title}</h2>
                <p className="text-xs font-medium uppercase tracking-wide text-gold-dark">{period}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">{text}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="flex items-center gap-2.5">
            <Scissors size={18} className="text-mist" />
            <h2 className="text-lg font-semibold tracking-tight text-ink">Condições da peça</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Para que a troca ou a devolução seja aceita, a peça precisa estar nova, sem
            sinais de uso, exatamente como foi entregue:
          </p>
          <ul className="mt-4 space-y-3">
            {conditions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/70">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-sm text-ink/70">
            <Tag size={16} className="mt-0.5 shrink-0 text-gold-dark" />
            Peças devolvidas em até <strong>7 dias</strong> após a compra costumam ser aceitas
            facilmente. Peças com desconto acima de 50% ou da linha “últimas unidades” estão
            sujeitas a análise.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2.5">
            <RefreshCcw size={18} className="text-mist" />
            <h2 className="text-lg font-semibold tracking-tight text-ink">Como solicitar</h2>
          </div>
          <ol className="mt-4 space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper">
                  {i + 1}
                </span>
                <div className="flex items-start gap-3 pt-1.5">
                  <step.icon size={17} className="mt-0.5 shrink-0 text-mist" />
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section>
        <div className="flex items-center gap-2.5">
          <RotateCcw size={18} className="text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Prazos de ressarcimento</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {timelines.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-5 py-4"
            >
              <p className="text-sm text-ink/80">{t.label}</p>
              <p className="text-right text-xs font-semibold uppercase tracking-wide text-gold-dark">
                {t.days}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Em caso de desistência ou defeito, o frete de retorno corre por conta da JP: você
          envia a peça com o código de postagem que lhe fornecemos sem pagar nada, conforme
          o disposto no artigo 49 do Código de Defesa do Consumidor. Dúvidas, fale com o
          nosso atendimento.
        </p>
      </section>
    </article>
  );
}