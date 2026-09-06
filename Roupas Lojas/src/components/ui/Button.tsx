import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "dark" | "gold-dark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aformalink/70 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-black shadow-[0_1px_2px_rgba(17,17,17,0.2)] hover:-translate-y-px hover:shadow-[0_14px_28px_-12px_rgba(17,17,17,0.5)]",
  gold: "bg-gold text-ink hover:bg-gold-dark hover:text-paper",
  "gold-dark": "bg-gold-dark text-paper hover:bg-gold hover:text-ink",
  outline:
    "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper hover:-translate-y-px",
  ghost: "bg-paper/60 text-ink hover:bg-ink hover:text-paper",
  dark: "bg-ink text-paper hover:bg-ink-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button className={cn(buttonStyles(variant, size), className)} {...props} />;
}