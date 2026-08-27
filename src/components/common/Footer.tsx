import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const CONTACT_EMAIL = "joaop.gregorio@outlook.com";
const CONTACT_PHONE_DISPLAY = "+55 (11) 98388-1984";
const WHATSAPP_URL = "https://wa.me/5511983881984";

const STACK = [
  "Next.js 16",
  "React 19",
  "Tailwind CSS 4",
  "Express",
  "MongoDB Atlas",
  "Vercel / Netlify",
  "Render",
];

const CATEGORY_LINKS = [
  { label: "Camisetas", href: "/catalogo?categoria=camisetas" },
  { label: "Camisas", href: "/catalogo?categoria=camisas" },
  { label: "Calças", href: "/catalogo?categoria=calcas" },
  { label: "Selva das jaquetas", href: "/catalogo?categoria=jaquetas" },
  { label: "Vestidos", href: "/catalogo?categoria=vestidos" },
  { label: "Acessórios", href: "/catalogo?categoria=acessorios" },
];

const HELP_LINKS = [
  { label: "Rastrear pedido", href: "/pedidos" },
  { label: "Troca e devolução", href: "/institucional/troca-e-devolucao" },
  { label: "Guia de medidas", href: "/institucional/guia-de-medidas" },
  { label: "Fale conosco", href: "/institucional/fale-conosco" },
];

const LEGAL_LINKS = [
  { label: "Política de privacidade", href: "/institucional/politica-de-privacidade" },
  { label: "Termos de uso", href: "/institucional/termos-de-uso" },
  { label: "LGPD e cookies", href: "/institucional/lgpd-e-cookies" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-tight">JP</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
                minimal
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Moda minimalista em tons sóbrios com toques de dourado. Feita para durar, desenhada
              para não gritar.
            </p>
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
                Receba no seu e-mail
              </p>
              <NewsletterForm className="w-full max-w-xs" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Enviar e-mail"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-paper/15 px-3.5 text-xs font-medium text-paper/80 transition-all hover:border-gold hover:text-gold"
              >
                <Mail size={15} />
                E-mail
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chamar no WhatsApp"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-paper/15 px-3.5 text-xs font-medium text-paper/80 transition-all hover:border-gold hover:text-gold"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Loja</p>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Ajuda</p>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Legal
            </p>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Contato
            </p>
            <ul className="space-y-3 text-sm text-paper/70">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-start gap-3 transition-colors hover:text-gold"
                >
                  <Mail size={17} className="mt-0.5 shrink-0 text-gold" />
                  <span className="break-all">{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3 transition-colors hover:text-gold"
                >
                  <MessageCircle size={17} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    {CONTACT_PHONE_DISPLAY}
                    <span className="mt-0.5 block text-xs text-paper/45">Abrir conversa no WhatsApp</span>
                  </span>
                </a>
              </li>
            </ul>

            <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Stack
            </p>
            <p className="mb-3 text-xs leading-relaxed text-paper/45">
              Loja de portfólio em arquitetura distribuída.
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-paper/12 px-2.5 py-1 text-[11px] font-medium text-paper/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-paper/40 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} JP Minimal. Projeto de portfólio.</p>
          <p>Next.js · Express · MongoDB Atlas</p>
        </div>
      </div>
    </footer>
  );
}