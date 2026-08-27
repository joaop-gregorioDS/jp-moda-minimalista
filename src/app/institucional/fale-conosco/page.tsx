import type { Metadata } from "next";
import { Building2, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/institucional/ContactForm";

export const metadata: Metadata = {
  title: "Fale Conosco",
  description:
    "Fale com o atendimento da JP. E-mail, WhatsApp e horário de atendimento de segunda a sexta, das 9h às 18h.",
};

const channels = [
  {
    icon: Mail,
    label: "E-mail",
    value: "atendimento@jpstore.com.br",
    href: "mailto:atendimento@jpstore.com.br",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "(11) 4000-0000",
    href: "https://wa.me/551140000000",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "(11) 4000-0000",
    href: "tel:+551140000000",
  },
  {
    icon: Clock,
    label: "Horário de atendimento",
    value: "Segunda a sexta, das 9h às 18h",
  },
  {
    icon: Building2,
    label: "CNPJ",
    value: "12.345.678/0001-90",
  },
];

export default function FaleConoscoPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Fale Conosco</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">
          Estamos aqui para ajudar. Envie sua mensagem pelo formulário ou fale direto com o
          nosso time pelos canais abaixo. Respondemos em até <strong>2 dias úteis</strong>.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
            Envie sua mensagem
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
            Canais de atendimento
          </h2>
          <ul className="mt-5 space-y-4">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.04] text-ink">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-mist">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-0.5 block break-words text-sm font-medium text-ink hover:text-gold-dark"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-ink/10 pt-5 text-xs leading-relaxed text-mist">
            Central de ajuda: confira nossas páginas de{" "}
            <a href="/institucional/troca-e-devolucao" className="text-ink underline underline-offset-2 hover:text-gold-dark">
              Troca e Devolução
            </a>{" "}
            e{" "}
            <a href="/institucional/guia-de-medidas" className="text-ink underline underline-offset-2 hover:text-gold-dark">
              Guia de Medidas
            </a>{" "}
            antes de nos escrever.
          </p>
        </aside>
      </div>
    </article>
  );
}