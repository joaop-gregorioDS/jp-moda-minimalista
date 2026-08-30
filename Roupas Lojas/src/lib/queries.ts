import type { Category, Product, ProductCardData, SearchSuggestion } from "./types";
import { apiGet } from "./api";

export type { ProductCardData };

export async function getCategories(): Promise<Category[]> {
  const data = await apiGet<{ categories: Category[] }>("/api/categories", { categories: [] });
  return data.categories ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  const data = await apiGet<{ products: ProductCardData[] }>(
    `/api/products/featured?limit=${limit}`,
    { products: [] }
  );
  return data.products ?? [];
}

export async function getLatestProducts(limit = 8): Promise<ProductCardData[]> {
  const data = await apiGet<{ products: ProductCardData[] }>(
    `/api/products/latest?limit=${limit}`,
    { products: [] }
  );
  return data.products ?? [];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  size?: string;
  price?: string;
  order?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ProductPage {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getProducts(filters: ProductFilters): Promise<ProductPage> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.size) params.set("size", filters.size);
  if (filters.order) params.set("order", filters.order);
  if (filters.featured) params.set("featured", "1");
  params.set("page", String(Math.max(1, filters.page || 1)));
  params.set("pageSize", String(Math.min(48, filters.pageSize || 24)));

  const data = await apiGet<ProductPage>(`/api/products?${params.toString()}`, {
    products: [],
    total: 0,
    page: 1,
    pageSize: 24,
    totalPages: 1,
  });

  return {
    products: data.products ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 24,
    totalPages: data.totalPages ?? 1,
  };
}

export async function getProductById(idOrSlug: number | string): Promise<Product | null> {
  const data = await apiGet<{ product: Product | null }>(`/api/products/${idOrSlug}`, { product: null });
  return data.product ?? null;
}

export async function getRelatedProducts(
  product: Product,
  excludeId: number,
  limit = 8
): Promise<ProductCardData[]> {
  const data = await apiGet<{ products: ProductCardData[] }>(
    `/api/products/${excludeId || product.id}/related?limit=${limit}`,
    { products: [] }
  );
  return data.products ?? [];
}

export async function searchProducts(q: string, limit = 8): Promise<SearchSuggestion[]> {
  const data = await apiGet<{ results: SearchSuggestion[] }>(
    `/api/products/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    { results: [] }
  );
  return data.results ?? [];
}
