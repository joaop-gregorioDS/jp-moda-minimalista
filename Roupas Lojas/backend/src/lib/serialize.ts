import { discountPct, parseSizes } from "./utils";

type Color = { name: string; hex: string; sortOrder?: number };

export interface ProductDoc {
  id: number;
  slug: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: number | null;
  categorySlug?: string;
  categoryName?: string;
  stock: number;
  featured: boolean;
  sizes: string[] | string;
  visual: string;
  colors?: Color[];
  createdAt?: Date | string;
}

export function toCard(p: ProductDoc) {
  const price = Number(p.price);
  const compareAt = p.compareAtPrice != null ? Number(p.compareAtPrice) : null;
  const first = [...(p.colors ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price,
    compareAtPrice: compareAt,
    discountPct: discountPct(price, compareAt),
    visual: p.visual,
    colorHex: first?.hex ?? "#111111",
    categoryName: p.categoryName ?? "",
    categorySlug: p.categorySlug ?? "",
    inStock: Number(p.stock) > 0,
    sizes: parseSizes(p.sizes),
  };
}

export function toProduct(p: ProductDoc) {
  const price = Number(p.price);
  const compareAt = p.compareAtPrice != null ? Number(p.compareAtPrice) : null;
  const colors = [...(p.colors ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => ({ name: c.name, hex: c.hex }));
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    description: p.description,
    price,
    compareAtPrice: compareAt,
    categoryId: p.categoryId ?? null,
    categoryName: p.categoryName,
    categorySlug: p.categorySlug,
    stock: Number(p.stock),
    featured: Boolean(p.featured),
    sizes: parseSizes(p.sizes),
    visual: p.visual,
    colors,
    discountPct: discountPct(price, compareAt),
  };
}

export function toSuggestion(p: ProductDoc) {
  const first = [...(p.colors ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  const compareAt = p.compareAtPrice != null ? Number(p.compareAtPrice) : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number(p.price),
    compareAtPrice: compareAt,
    visual: p.visual,
    colorHex: first?.hex ?? "#111111",
    categoryName: p.categoryName ?? "",
    categorySlug: p.categorySlug ?? "",
    sizes: parseSizes(p.sizes),
  };
}

export function toOrder(o: {
  id: number;
  customerName: string;
  customerEmail: string;
  address: unknown;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt?: Date | string;
  items: Array<{
    productId?: number | null;
    productName: string;
    price: number;
    quantity: number;
    color?: string | null;
    size?: string | null;
    visual?: string;
  }>;
}) {
  return {
    id: o.id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    address: o.address,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    discount: Number(o.discount),
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt,
    items: (o.items ?? []).map((it) => ({
      productId: it.productId ?? null,
      productName: it.productName,
      price: Number(it.price),
      quantity: it.quantity,
      color: it.color ?? null,
      size: it.size ?? null,
      visual: it.visual ?? "tee",
    })),
  };
}

export function toCategory(c: {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  accent?: string;
  sortOrder?: number;
}) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    accent: c.accent ?? "#c6a87c",
    sortOrder: c.sortOrder ?? 0,
  };
}
