import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "ink" | "paper" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        {
          gold: "bg-gold text-ink",
          ink: "bg-ink text-paper",
          paper: "bg-paper text-ink border border-line",
          outline: "border border-ink/25 text-ink",
        }[tone],
        className
      )}
    >
      {children}
    </span>
  );
}