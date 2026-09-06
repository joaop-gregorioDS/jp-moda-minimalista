import type { Metadata } from "next";
import { Database, Lock, ShieldCheck, Trash2, UserCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba quais dados a JP coleta, para que finalidades, com quem compartilha e quais são os seus direitos como titular de dados pessoais, conforme a LGPD.",
};

const sections = [
  {
    icon: Users,
    title: "1. Quem somos",
    paragraphs: [
      "A jp-store (CNPJ 12.345.678/0001-90, e-mail atendimento@jpstore.com.br) é a responsável pelo tratamento dos dados pessoais coletados neste site, na qualidade de controladora, nos termos da Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).",
      "Esta política explica, de forma simples e transparente, o que coletamos, por que coletamos, com quem compartilhamos e quais os seus direitos. Ao navegar ou comprar na jp-store, você concorda com as práticas descritas aqui.",
    ],
  },
  {
    icon: Database,
    title: "2. Dados que coletamos",
    paragraphs: [
      "Coletamos apenas os dados necessários para o funcionamento da loja e a melhoria da sua experiência, em três situações:",
      "Cadastro e compra: nome completo, CPF, data de nascimento, e-mail, telefone, endereço de entrega e cobrança, dados de pagamento (processados por intermediários) e histórico de pedidos.",
      "Navegação: endereço de IP, tipo de dispositivo, navegador, páginas visitadas e preferências de navegação, obtidos por meio de cookies e tecnologias semelhantes.",
      "Comunicação: mensagens enviadas pelo “Fale Conosco”, avaliações de produtos e respostas a pesquisas de satisfação, sempre que você optar por participar.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Para que usamos seus dados",
    paragraphs: [
      "Utilizamos os seus dados exclusivamente para:",
      "Processar pedidos, cobranças, entregas e devoluções, incluindo a emissão de nota fiscal e o envio do código de postagem para trocas;",
      "Criar e manter a sua conta, autenticar o acesso e recuperar a senha;",
      "Comunicar informações relevantes sobre pedidos, status de entrega e atendimento;",
      "Enviar novidades, ofertas e campanhas de marketing por e-mail, SMS ou WhatsApp, somente com o seu consentimento prévio;",
      "Melhorar o site, os produtos e a experiência de compra, com base em dados de uso anonimizados;",
      "Cumprir obrigações legais, regulatórias e fiscais, e prevenir fraudes.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "4. Bases legais (LGPD)",
    paragraphs: [
      "Tratamos dados pessoais com base no artigo 7º da LGPD, principalmente nas hipóteses de: execução de contrato (compra e venda), consentimento (marketing e cookies não essenciais), cumprimento de obrigação legal (fiscal) e legítimo interesse (prevenção a fraudes e melhoria dos serviços).",
      "Você pode retirar o seu consentimento a qualquer momento, sem prejuízo da legalidade dos tratamentos já realizados.",
    ],
  },
  {
    icon: Lock,
    title: "5. Compartilhamento de dados",
    paragraphs: [
      "A jp-store não vende dados pessoais. Compartilhamos informações apenas na medida do necessário para operar o negócio, com:",
      "Operadoras de pagamento e instituições financeiras, para processar transações de forma segura (Pix, cartões, boletos);",
      "Transportadoras e Correios, para realizar entregas e a logística reversa de trocas e devoluções;",
      "Provedores de tecnologia, hospedagem, envio de e-mails e mensagens, sempre mediante contrato que assegure a proteção dos dados;",
      "Autoridades públicas, quando exigido por lei, ordem judicial ou por determinação da ANPD.",
      "Em todos os casos, exigimos que os parceiros tratem os dados com segurança e somente para as finalidades contratadas, em conformidade com a LGPD.",
    ],
  },
  {
    icon: Trash2,
    title: "6. Seus direitos (art. 18 da LGPD)",
    paragraphs: [
      "Você pode, a qualquer momento e gratuitamente, solicitar:",
      "Confirmação da existência de tratamento e acesso aos dados pessoais que tratamos;",
      "Correção de dados incompletos, inexatos ou desatualizados;",
      "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;",
      "Portabilidade dos seus dados a outro fornecedor de serviço ou produto;",
      "Informação sobre as entidades públicas e privadas com as quais compartilhamos dados;",
      "Revogação do consentimento e eliminação dos dados tratados com base nele.",
    ],
  },
  {
    icon: Lock,
    title: "7. Segurança da informação",
    paragraphs: [
      "Adotamos medidas técnicas e organizacionais adequadas para proteger os seus dados contra acessos não autorizados, perda, alteração ou divulgação indevida, como criptografia em transações, controle de acesso restrito e monitoramento constante. As transações de pagamento são processadas exclusivamente por operadoras certificadas (PCI DSS), sem que os dados completos do cartão sejam armazenados nos nossos servidores.",
    ],
  },
  {
    icon: Database,
    title: "8. Retenção dos dados",
    paragraphs: [
      "Mantemos os dados apenas pelo tempo necessário às finalidades para as quais foram coletados. Dados fiscais e contábeis são guardados pelo prazo exigido em lei; dados de marketing são mantidos enquanto durar o consentimento. Ao término do prazo, os dados são eliminados ou anonimizados.",
    ],
  },
  {
    icon: Users,
    title: "9. Menores de idade",
    paragraphs: [
      "Nosso site é voltado a maiores de 18 anos. Não coletamos intencionalmente dados de menores sem o consentimento dos responsáveis. Se você é responsável por um menor e identifica que dados foram cadastrados, contate-nos para que os removamos.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "10. Autoridade e contato",
    paragraphs: [
      "Caso entenda que seus dados foram tratados de forma inadequada, você pode registrar reclamação na Autoridade Nacional de Proteção de Dados (ANPD), além de procurar os órgãos de defesa do consumidor (Procon) e o Poder Judiciário.",
      "Para exercer seus direitos, entre em contato pelo e-mail privacidade@jpstore.com.br ou pelo “Fale Conosco”. Responderemos em até 15 dias, conforme previsto na legislação.",
    ],
  },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Política de Privacidade
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          A sua privacidade é tão importante quanto o caimento perfeito de uma peça. Este
          documento explica, em linguagem simples, como tratamos seus dados pessoais em
          conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-mist">Atualizada em 08/08/2026</p>
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

      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
          Alterações nesta política
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Podemos atualizar esta política periodicamente para refletir mudanças legais ou nos
          nossos processos. A versão vigente estará sempre disponível nesta página, com a data
          de atualização indicada. Recomendamos revisá-la de tempos em tempos.
        </p>
      </section>
    </article>
  );
}