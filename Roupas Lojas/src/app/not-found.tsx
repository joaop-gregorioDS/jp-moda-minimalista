import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-gold-dark">
        <Compass size={34} />
      </span>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Página não encontrada</h1>
      <p className="mt-3 text-sm leading-relaxed text-mist">
        O caminho que você tentou não existe por aqui. Que tal voltar para algo bonito?
      </p>
      <Link href="/" className={`${buttonStyles("primary", "lg")} mt-8`}>
        Voltar ao início
      </Link>
    </div>
  );
}