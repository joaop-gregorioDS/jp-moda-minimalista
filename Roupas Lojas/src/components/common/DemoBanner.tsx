import Link from "next/link";

export function DemoBanner() {
  return (
    <div className="bg-gold pt-[env(safe-area-inset-top)] text-ink">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-1.5 text-center text-[11px] font-medium leading-snug sm:text-xs">
        <span className="hidden sm:inline">Projeto de portfólio · loja simulada.</span>
        <span className="sm:hidden">Portfólio · loja simulada.</span>
        <span className="opacity-70">Pagamentos não são reais.</span>
        <Link href="/institucional/fale-conosco" className="underline underline-offset-2 hover:opacity-80">
          Saiba mais
        </Link>
      </p>
    </div>
  );
}
