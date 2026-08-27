import { getProductEmoji, type VisualSize } from "@/lib/emoji";
import { cn, isLightColor } from "@/lib/utils";

const SIZE_CQMIN: Record<VisualSize, number> = {
  xs: 56,
  sm: 52,
  md: 50,
  lg: 54,
  xl: 50,
};

export function ProductVisual({
  motif,
  color,
  className,
  label,
  size = "lg",
}: {
  motif: string;
  color: string;
  id?: string | number;
  className?: string;
  label?: string;
  eager?: boolean;
  size?: VisualSize;
}) {
  const { emoji, scale, label: motifLabel } = getProductEmoji(motif);
  const light = isLightColor(color);
  const wash = light ? 18 : 36;
  const washDeep = light ? 10 : 24;
  const cq = Math.min(68, Math.max(28, SIZE_CQMIN[size] * scale));

  return (
    <div
      className={cn(
        "relative isolate h-full w-full min-h-0 min-w-0 overflow-hidden [container-type:size]",
        className
      )}
      style={{
        background: `linear-gradient(165deg, color-mix(in srgb, ${color} ${wash}%, #f3f0e9) 0%, color-mix(in srgb, ${color} ${washDeep}%, #e8e2d4) 100%)`,
      }}
      role="img"
      aria-label={label ?? motifLabel}
    >
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="flex select-none items-center justify-center leading-none"
          style={{
            width: "1em",
            height: "1em",
            fontSize: `clamp(1.1rem, ${cq}cqmin, 7.5rem)`,
            lineHeight: 1,
            fontFamily: `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`,
          }}
        >
          {emoji}
        </span>
      </span>
    </div>
  );
}
