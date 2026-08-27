export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatBRLCheap(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function isLightColor(hex: string) {
  const h = hex.replace("#", "");
  const f = (offset: number) => parseInt(h.slice(offset, offset + 2), 16);
  if (h.length < 6) return true;
  const r = f(0);
  const g = f(2);
  const b = f(4);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

export function discountPct(price: number, compareAt: number | null | undefined) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 299);
export const SHIPPING_FIXED = Number(process.env.NEXT_PUBLIC_SHIPPING_FIXED || 24.9);

export function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}