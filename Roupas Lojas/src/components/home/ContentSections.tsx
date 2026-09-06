import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/Button";

interface Tile {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
  span: string;
  tall?: boolean;
}

const TILES: Tile[] = [
  {
    href: "/catalogo?categoria=blazers",
    image: "/banners/gold-1920.webp",
    eyebrow: "Alfaiataria",
    title: "Blazers com presença discreta",
    cta: "Ver blazers",
    span: "md:col-span-7",
    tall: true,
  },
  {
    href: "/catalogo?categoria=camisetas",
    image: "/banners/ivory-1920.webp",
    eyebrow: "Essencial",
    title: "Camisetas em algodão nobre",
    cta: "Explorar",
    span: "md:col-span-5",
    tall: true,
  },
  {
    href: "/catalogo?categoria=casacos",
    image: "/banners/noir-1920.webp",
    eyebrow: "Outerwear",
    title: "Camadas para o frio urbano",
    cta: "Ver casacos",
    span: "md:col-span-4",
  },
  {
    href: "/catalogo?categoria=sueteres",
    image: "/banners/slate-1920.webp",
    eyebrow: "Tricô",
    title: "Malhas atemporais",
    cta: "Mais",
    span: "md:col-span-4",
  },
  {
    href: "/catalogo?categoria=acessorios",
    image: "/banners/gold-1920.webp",
    eyebrow: "Código premium",
    title: "Acessórios em couro",
    cta: "Explorar",
    span: "md:col-span-4",
  },
  {
    href: "/catalogo?ordem=promocao",
    image: "/banners/noir-1920.webp",
    eyebrow: "Oferta da semana",
    title: "Até 40% off em peças selecionadas",
    cta: "Ver promoções",
    span: "md:col-span-12",
  },
];

function TileCard({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl ring-1 ring-ink/10 shadow-[0_2px_10px_rgba(17,17,17,0.06)] transition-shadow duration-500 hover:shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)]",
        tile.span
      )}
    >
      <div className={cn("relative w-full overflow-hidden", tile.tall ? "aspect-[16/9] md:aspect-[16/9.5]" : "aspect-[16/9]")}>
        <Image
          src={tile.image}
          alt={tile.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 md:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{tile.eyebrow}</p>
            <h3 className="mt-2 max-w-sm text-lg font-bold leading-snug text-paper sm:text-xl md:text-2xl">{tile.title}</h3>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-paper/90 transition-colors group-hover:text-gold">
              {tile.cta}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ContentSections() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark">Explorar seleções</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">Escolha por humor</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          Categorias curadas para você compor seu guarda-roupa de baixo ruído.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {TILES.map((t) => (
          <TileCard key={t.title} tile={t} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/catalogo" className={buttonStyles("outline", "md")}>
          Ver catálogo completo
        </Link>
      </div>
    </section>
  );
}