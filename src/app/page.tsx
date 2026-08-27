import { connection } from "next/server";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ValueProps } from "@/components/home/ValueProps";
import { ContentSections } from "@/components/home/ContentSections";
import { Marquee } from "@/components/home/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts, getLatestProducts } from "@/lib/queries";
import Link from "next/link";

export const metadata = {
  title: "Moda Minimalista | JP",
  description:
    "Roupas minimalistas em tons sóbrios com toques de dourado. Coleções curadas, frete grátis e troca facilitada.",
};

export default async function HomePage() {
  await connection();
  const [latest, featured] = await Promise.all([getLatestProducts(8), getFeaturedProducts(8)]);

  return (
    <>
      <HeroSlider />
      <ValueProps />

      {/* Novidades */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="Acabaram de chegar"
          title="Novo no site"
          subtitle="Pequenos lotes, lançamentos frequentes e tecidos que só melhoram com o tempo."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {latest.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i === 0} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/catalogo">
            <Button variant="outline">Ver tudo no catálogo</Button>
          </Link>
        </div>
      </section>

      <Marquee />

      <ContentSections />

      {/* Seleção da semana */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeader
          eyebrow="Seleção editada"
          title="Escolhidos da semana"
          subtitle="Uma boa curadoria vale mais do que um milhar de produtos. Estes são os nossos queridinhos."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/catalogo?ordem=promocao">
            <Button variant="gold">Ver promoções ativas</Button>
          </Link>
        </div>
      </section>
    </>
  );
}