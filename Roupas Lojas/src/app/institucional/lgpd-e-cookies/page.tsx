import type { Metadata } from "next";
import { Apple, Cookie, Flame, Globe, MonitorCog, Settings, ShieldCheck } from "lucide-react";
import { CookieNoticeDemo } from "@/components/institucional/CookieNoticeDemo";

export const metadata: Metadata = {
  title: "LGPD e Cookies",
  description:
    "Entenda o que são cookies, quais utilizamos na JP (necessários, desempenho e marketing) e como gerenciá-los no navegador, em conformidade com a LGPD.",
};

const cookieTypes = [
  {
    name: "Estritamente necessários",
    purpose: "Garantem o funcionamento básico do site: sessão de login, carrinho de compras, segurança e preferências essenciais.",
    examples: "jp_session, jp_cart, jp_csrf",
    duration: "Sessão até 1 ano",
    required: true,
  },
  {
    name: "Desempenho",
    purpose: "Entendem como você navega e interage com o site, de forma agregada e anônima, para melhorarmos nossos produtos e páginas.",
    examples: "_ga, _gid",
    duration: "2 anos no máximo",
    required: false,
  },
  {
    name: "Marketing",
    purpose: "Personalizam ofertas, cupons e campanhas para o seu perfil, sempre com o seu consentimento prévio.",
    examples: "_fbp, _gcl_au",
    duration: "Até 90 dias",
    required: false,
  },
];

const browsers = [
  {
    icon: Globe,
    name: "Google Chrome",
    steps: [
      "Clique no ícone de cadeado ou Ajustes na barra de endereço",
      "Acesse “Cookies e dados de sites” → “Gerenciar dados de sites”",
      "Permita ou bloqueie os cookies e recarregue a página",
    ],
  },
  {
    icon: Flame,
    name: "Mozilla Firefox",
    steps: [
      "Abra o menu (☰) e clique em “Configurações”",
      "Em “Privacidade e Segurança”, ajuste “Proteção contra rastreamento”",
      "Use “Cookies e dados de sites” para limpar ou gerenciar exceções",
    ],
  },
  {
    icon: Apple,
    name: "Safari",
    steps: [
      "Abra “Preferências do Safari” e vá até “Privacidade”",
      "Desmarque ou marque “Bloquear todos os cookies” conforme sua preferência",
      "Use “Gerenciar dados de sites” para remover cookies específicos",
    ],
  },
  {
    icon: MonitorCog,
    name: "Microsoft Edge",
    steps: [
      "Clique nos três pontos (⋯) → “Configurações”",
      "Em “Privacidade, pesquisa e serviços”, ajuste “Cookies e dados do site”",
      "Escolha o nível de rastreamento e bloqueie conforme desejar",
    ],
  },
];

export default function LgpdCookiesPage() {
  return (
    <article className="space-y-10">
      <CookieNoticeDemo />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">LGPD e Cookies</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          Queremos ser transparentes sobre como usamos cookies e tecnologias semelhantes
          neste site, sempre em linha com a Lei Geral de Proteção de Dados (LGPD). Este texto
          explica o que são cookies, quais utilizamos e como você pode controlá-los.
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-mist">Atualizado em 08/08/2026</p>
      </header>

      <section>
        <div className="flex items-center gap-2.5">
          <Cookie size={18} className="shrink-0 text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">O que são cookies?</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Cookies são pequenos arquivos de texto que o seu navegador armazena ao visitar um
          site. Eles guardam informações como preferências, itens do carrinho e dados de
          navegação, permitindo que a loja “lembre” de você entre uma visita e outra. Sem os
          cookies essenciais, muitas funções básicas — como manter o login e o carrinho —
          não funcionariam.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="shrink-0 text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Quais cookies usamos</h2>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Tabela dos tipos de cookies utilizados pela JP</caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-ink">
                  Tipo
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-ink">
                  Finalidade
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-ink">
                  Exemplos
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-ink">
                  Duração
                </th>
              </tr>
            </thead>
            <tbody>
              {cookieTypes.map((c) => (
                <tr key={c.name} className="border-b border-ink/5 align-top last:border-0">
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-ink">
                    {c.name}
                    {c.required && (
                      <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[10px] font-semibold uppercase text-gold-dark">
                        sempre ativos
                      </span>
                    )}
                  </th>
                  <td className="px-5 py-4 text-sm leading-relaxed text-ink/70">{c.purpose}</td>
                  <td className="px-5 py-4 font-mono text-xs text-mist">{c.examples}</td>
                  <td className="px-5 py-4 text-sm text-ink/70">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2.5">
          <Settings size={18} className="shrink-0 text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Como gerenciar no navegador
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Você pode aceitar, recusar ou excluir cookies a qualquer momento pelas
          configurações do seu navegador. Veja o caminho nos navegadores mais comuns:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {browsers.map(({ icon: Icon, name, steps }) => (
            <div key={name} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                  <Icon size={19} />
                </span>
                <h3 className="text-sm font-semibold text-ink">{name}</h3>
              </div>
              <ol className="mt-4 space-y-2.5">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-ink/70">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-gold-dark">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="shrink-0 text-mist" />
          <h2 className="text-lg font-semibold tracking-tight text-ink">Sua privacidade, sob a LGPD</h2>
        </div>
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-relaxed text-ink/70">
            A instalação de cookies não essenciais (desempenho e marketing) depende do seu
            consentimento livre e informado, conforme o artigo 7º, inciso I, da LGPD. Os
            cookies estritamente necessários são instalados para viabilizar o serviço
            solicitado por você e não dependem de consentimento.
          </p>
          <p className="text-sm leading-relaxed text-ink/70">
            Você pode retirar o seu consentimento a qualquer momento, com a mesma facilidade
            com que o concedeu, seja pelo banner de cookies, seja pelas configurações do
            navegador. A revogação não afeta a validade dos tratamentos já realizados.
          </p>
          <p className="text-sm leading-relaxed text-ink/70">
            Para saber mais sobre os dados pessoais que coletamos e como exercer os seus
            direitos de titular, consulte a nossa{" "}
            <a
              href="/institucional/politica-de-privacidade"
              className="font-medium text-ink underline underline-offset-2 hover:text-gold-dark"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
          Banner de cookies (demonstração)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          O aviso no canto inferior esquerdo desta página simula o banner que apresentamos
          aos visitantes: ele permite “Aceitar todos”, “Somente necessários” ou “Configurar”
          cada categoria de cookies, com efeito imediato e revogável a qualquer momento.
        </p>
      </section>
    </article>
  );
}