"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "jp_cart_v1";

function itemKey(item: Pick<CartItem, "productId" | "color" | "size">) {
  return `${item.productId}:${item.color.hex}:${item.size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((input: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => {
    const quantity = Math.max(1, input.quantity || 1);
    setItems((prev) => {
      const key = itemKey(input);
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i) === key ? { ...i, quantity: Math.min(i.stock, i.quantity + quantity) } : i
        );
      }
      return [...prev, { ...input, key, quantity }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, Math.min(i.stock || 99, quantity)) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, isOpen, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}

export { itemKey as cartItemKey };