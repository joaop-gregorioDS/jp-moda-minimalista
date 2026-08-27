import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark">
          <span className="h-px w-6 bg-gold-dark/60" />
          {eyebrow}
          {align === "center" && <span className="h-px w-6 bg-gold-dark/60" />}
        </span>
      )}
      <h2 className="font-bold tracking-tight text-ink sm:text-4xl/5xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-pretty text-mist">{subtitle}</p>}
    </div>
  );
}