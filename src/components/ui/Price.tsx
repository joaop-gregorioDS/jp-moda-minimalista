import { formatBRL } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Price({
  price,
  compareAtPrice,
  className,
  size = "md",
  showDiscount = false,
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-semibold tracking-tight", sizes[size])}>{formatBRL(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-mist/80 line-through">{formatBRL(compareAtPrice)}</span>
      )}
      {showDiscount && discount && (
        <span className="text-[11px] font-bold text-gold-dark">-{discount}%</span>
      )}
    </div>
  );
}