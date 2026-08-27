import type { Metadata } from "next";
import { Gauge, Info, MoveHorizontal, PersonStanding, Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Guia de Medidas",
  description:
    "Como medir seu corpo com fita métrica e a tabela de medidas da JP (PP, P, M, G, GG e XG) com busto, cintura e quadril em centímetros.",
};

const sizes = ["PP", "P", "M", "G", "GG", "XG"] as const;

const rows = [
  { label: "Busto (cm)", values: [48, 82, 86, 90, 94, 100] },
  { label: "Cintura (cm)", values: [62, 66, 70, 74, 78, 83] },
  { label: "Quadril (cm)", values: [88, 92, 96, 101, 106, 111] },
];

const measures = [
  {
    icon: PersonStanding,
    title: "Busto",
    text: "Passe a fita na parte mais cheia do busto, na altura das mamas, mantendo-a reta na horizontal pelas costas, sem apertar.",
  },
  {
    icon: Gauge,
    title: "Cintura",
    text: "Dobre levemente o corpo para o lado — o vinco que se forma é a sua cintura natural. Passe a fita por ali, sem apertar.",
  },
  {
    icon: MoveHorizontal,
    title: "Quadril",
    text: "Meça na parte mais larga do quadril, cerca de 18 cm abaixo da cintura, mantendo os pés unidos e a fita na altura correta.",
  },
];

export default function GuiaDeMedidasPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Guia de Medidas</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          Para acertar no tamanho, meça o próprio corpo com uma fita métrica e compare com
          a tabela abaixo. As medidas indicam a peça estendida. Se você estiver entre dois
          tamanhos, indica-se o maior para modelagens mais confortáveis.
        </p>
      </header>

      <section>
        <div className="flex items-center gap-2.5">
          <Ruler size={18} className="text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Como medir o corpo</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {measures.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                <Icon size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-5">
          <Info size={17} className="mt-0.5 shrink-0 text-mist" />
          <p className="text-sm leading-relaxed text-ink/70">
            <strong className="font-semibold text-ink">Dicas importantes:</strong> tire as
            medidas já usando uma roupa de baixo justa; mantenha a fita encostada ao corpo,
            sem apertar nem folgar; peça ajuda para medir o busto e o quadril e confira
            sempre o mesmo número duas vezes.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Tabela de medidas</h2>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">
              Tabela de medidas de busto, cintura e quadril por tamanho
            </caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-mist">
                  Medida
                </th>
                {sizes.map((s) => (
                  <th
                    key={s}
                    scope="col"
                    className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-ink"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-ink/5 last:border-0">
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-ink">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={sizes[i]} className="px-4 py-4 text-center text-sm tabular-nums text-ink/70">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-sm text-ink/70">
          <Info size={16} className="mt-0.5 shrink-0 text-gold-dark" />
          As medidas representam o corpo da pessoa (busto, cintura e quadril), não as medidas
          da peça por extenso. Tolerância de até ±1,5 cm por acabamento. Malhas e tecidos com
          elastano podem ceder levemente ao uso.
        </p>
      </section>
    </article>
  );
}