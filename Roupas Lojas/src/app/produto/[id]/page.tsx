import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/queries";
import { Suspense } from "react";
import { ProductBuyPanel } from "@/components/ProductBuyPanel";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product ? product.name : "Produto",
    description: product ? product.description.slice(0, 150) : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product, product.id, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex min-w-0 items-center gap-1.5 overflow-hidden text-[11px] text-mist sm:text-xs md:mb-8"
      >
        <Link href="/" className="transition-colors hover:text-ink">Início</Link>
        <ChevronRight size={13} />
        <Link href="/catalogo" className="transition-colors hover:text-ink">Catálogo</Link>
        {product.categorySlug && (
          <>
            <ChevronRight size={13} />
            <Link href={`/catalogo?categoria=${product.categorySlug}`} className="transition-colors hover:text-ink">
              {product.categoryName}
            </Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className="truncate text-ink/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[5/5.5] overflow-hidden rounded-2xl bg-sand ring-1 ring-ink/10">
            <div className="absolute inset-0">
              <ProductVisual
                motif={product.visual}
                color={product.colors[0]?.hex ?? "#111111"}
                label={product.name}
                size="xl"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <div
                key={c.hex + c.name}
                className="relative h-16 w-14 overflow-hidden rounded-lg bg-sand ring-1 ring-ink/10"
                title={c.name}
              >
                <ProductVisual motif={product.visual} color={c.hex} size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <Suspense fallback={null}>
          <ProductBuyPanel product={product} />
        </Suspense>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeader
            align="left"
            eyebrow="Você também vai gostar"
            title="Parecidos com este"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} eager={i < 2} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}