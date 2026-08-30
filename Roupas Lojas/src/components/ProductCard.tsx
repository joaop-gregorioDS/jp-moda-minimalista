import Link from "next/link";
import { CardActions } from "./CardActions";
import { ProductVisual } from "./ui/ProductVisual";
import { Price } from "./ui/Price";
import { Badge } from "./ui/Badge";
import type { ProductCardData } from "@/lib/queries";

export function ProductCard({
  product,
  sizes,
  className,
}: {
  product: ProductCardData;
  sizes?: string[];
  eager?: boolean;
  className?: string;
}) {
  const cardSizes = sizes && sizes.length ? sizes : product.sizes.length ? product.sizes : ["Único"];
  return (
    <Link
      href={`/produto/${product.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-ink/5 transition-all duration-500 hover:shadow-[0_24px_60px_-24px_rgba(17,17,17,0.35)] hover:ring-ink/10 ${className ?? ""}`}
      aria-label={product.name}
    >
      <div className="relative aspect-[5/5.5] overflow-hidden rounded-t-2xl bg-sand">
        <div className="absolute inset-0">
          <ProductVisual motif={product.visual} color={product.colorHex} size="lg" />
        </div>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
          {product.discountPct && (
            <Badge tone="ink">{product.discountPct}% off</Badge>
          )}
          {!product.inStock && <Badge tone="paper">Esgotado</Badge>}
        </div>
        <CardActions
          productId={product.id}
          productName={product.name}
          slug={product.slug}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          visual={product.visual}
          color={{ name: "", hex: product.colorHex }}
          sizes={cardSizes}
          inStock={product.inStock}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-mist">
          {product.categoryName}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-gold-dark">
          {product.name}
        </h3>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} showDiscount size="sm" />
      </div>
    </Link>
  );
}