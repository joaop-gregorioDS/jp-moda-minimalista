import type { Metadata } from "next";
import { AlertTriangle, Copyright, ExternalLink, Scale, ShieldCheck, UserCircle, WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Regras de uso do site da JP: cadastro, pedidos, propriedade intelectual, limites de responsabilidade e foro aplicável.",
};

const sections = [
  {
    icon: AlertTriangle,
    title: "1. Aceitação dos termos",
    paragraphs: [
      "Ao acessar a jp-store (www.jpstore.com.br) ou utilizar qualquer um de seus serviços, você aceita, de forma integral e irrevogável, os termos e condições aqui descritos, em conjunto com a Política de Privacidade e a Política de Cookies.",
      "Se você não concordar com qualquer dispositivo destes termos, pedimos que não utilize o site. O acesso e o uso da loja são voluntários e pressupõem a aceitação destas regras.",
    ],
  },
  {
    icon: UserCircle,
    title: "2. Conta e veracidade das informações",
    paragraphs: [
      "Para comprar em nossa loja, você pode navegar como visitante ou criar uma conta. Ao se cadastrar, você se compromete a fornecer informações verdadeiras, exatas e atualizadas, conforme o Código de Defesa do Consumidor e a boa-fé objetiva.",
      "Você é único e exclusivamente responsável pela veracidade dos dados cadastrados e por manter sua senha em sigilo. A jp-store poderá cancelar ou suspender cadastros que contenham informações falsas, incompletas ou que indiquem tentativa de fraude, sem prejuízo das medidas legais cabíveis.",
      "O cadastro é pessoal e intransferível. Menores de 18 anos devem estar assistidos ou representados por um responsável legal.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "3. Uso do site e conduta",
    paragraphs: [
      "O site destina-se ao uso pessoal e não comercial. Você concorda em não utilizar a plataforma para:",
      "Publicar ou transmitir conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros;",
      "Tentar acessar indevidamente sistemas, contas ou dados de outros usuários;",
      "Utilizar robôs, scrapers ou ferramentas automatizadas para minerar catálogos, preços ou informações sem autorização;",
      "Realizar compras com dados falsos, em nome de terceiros sem consentimento ou em práticas que configurem fraude.",
      "O descumprimento poderá levar a bloqueio de acesso, suspensão da conta e comunicação às autoridades competentes, sem prejuízo das medidas indenizatórias.",
    ],
  },
  {
    icon: Scale,
    title: "4. Pedidos, preços e pagamento",
    paragraphs: [
      "Os preços e condições de pagamento exibidos no site correspondem ao momento da navegação e podem ser alterados a qualquer tempo, sem aviso prévio, respeitando sempre o valor confirmado no momento da compra.",
      "A confirmação do pedido ocorre após a validação do pagamento. Reservamo-nos o direito de recusar pedidos em caso de erro de preço, indisponibilidade de estoque ou indícios de fraude, com reembolso integral dos valores eventualmente pagos.",
      "As informações de pagamento são processadas por operadoras certificadas, conforme detalhado em nossa Política de Privacidade.",
    ],
  },
  {
    icon: Copyright,
    title: "5. Propriedade intelectual",
    paragraphs: [
      "Todo o conteúdo do site — incluindo textos, ilustrações, fotografias de produtos, vídeos, identidade visual, logotipos e as marcas “JP” e “JP Store” — é de propriedade exclusiva da jp-store ou de seus licenciantes, estando protegido pela Lei nº 9.610/98 (Direito Autoral) e pela legislação de propriedade industrial.",
      "É vedada a reprodução, distribuição, modificação, exibição ou utilização comercial de qualquer conteúdo deste site sem autorização prévia e por escrito. Solicitações de autorização podem ser encaminhadas a atendimento@jpstore.com.br.",
    ],
  },
  {
    icon: WifiOff,
    title: "6. Disponibilidade e limites de responsabilidade",
    paragraphs: [
      "Envidamos esforços para que o site esteja disponível 24 horas por dia, 7 dias por semana. No entanto, o acesso pode ser temporariamente suspenso para manutenção, atualizações, falhas técnicas, restrições de rede ou eventos fora do nosso controle (caso fortuito e força maior).",
      "A jp-store não se responsabiliza por instabilidades temporárias, perda de conexão, lentidões causadas por operadoras ou por interrupções decorrentes de manutenção programada, desde que adote as melhores práticas de restabelecimento.",
      "As informações e imagens dos produtos são ilustrativas e buscam retratar as peças com a maior fidelidade possível; pequenas variações de cor podem ocorrer conforme a tela utilizada. Na dúvida, consulte nosso Guia de Medidas.",
    ],
  },
  {
    icon: ExternalLink,
    title: "7. Links de terceiros",
    paragraphs: [
      "O site pode conter links para páginas externas (redes sociais, operadoras de pagamento e transportadoras). Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas de sites de terceiros. Ao acessar esses links, você estará sujeito às respectivas regras.",
    ],
  },
  {
    icon: Scale,
    title: "8. Legislação aplicável e foro",
    paragraphs: [
      "Estes termos são regidos pelas leis da República Federativa do Brasil. Nos limites do Código de Defesa do Consumidor, fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias relativas ao uso do site ou às compras realizadas.",
      "Nada nestes termos afasta direitos que a lei conferir aos consumidores de forma irrenunciável, em especial os previstos no Código de Defesa do Consumidor.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "9. Alterações destes termos",
    paragraphs: [
      "Podemos alterar estes termos a qualquer momento. Alterações entram em vigor na data de publicação nesta página, sendo o uso contínuo do site considerado aceitação das novas condições. Nos compromissamos a manter sempre visível a data da última atualização.",
    ],
  },
];

export default function TermosDeUsoPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Termos de Uso</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          Bem-vindo à jp-store. Antes de navegar e comprar, leia estas regras. Elas são
          simples e objetivas — e existem para garantir uma experiência justa e transparente
          para você e para a nossa loja.
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-mist">Atualizado em 08/08/2026</p>
      </header>

      {sections.map(({ icon: Icon, title, paragraphs }) => (
        <section key={title}>
          <div className="flex items-center gap-2.5">
            <Icon size={18} className="shrink-0 text-mist" />
            <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
          </div>
          <div className="mt-3 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink/70">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}