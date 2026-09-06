export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  accent: string;
  sortOrder: number;
}

export interface ProductColor {
  id?: number;
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: number | null;
  categoryName?: string;
  categorySlug?: string;
  stock: number;
  featured: boolean;
  sizes: string[];
  visual: string;
  colors: ProductColor[];
  discountPct?: number | null;
}

export interface ProductCardData {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  discountPct: number | null;
  visual: string;
  colorHex: string;
  categoryName: string;
  categorySlug: string;
  inStock: boolean;
  sizes: string[];
}

export interface CartItem {
  key: string;
  productId: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  visual: string;
  color: ProductColor;
  size: string;
  quantity: number;
  stock: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface OrderItem {
  id?: number;
  productId: number | null;
  productName: string;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
  visual: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zip: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
}

export interface SearchSuggestion {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  visual: string;
  colorHex: string;
  categoryName: string;
  categorySlug?: string;
  sizes: string[];
}

export const EMPTY_CART: CartItem[] = [];