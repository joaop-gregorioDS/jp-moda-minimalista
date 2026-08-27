"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

interface PlaceOrderInput {
  name: string;
  email: string;
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
}

interface OrderContextValue {
  placing: boolean;
  lastOrder: Order | null;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  reset: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput) => {
      setPlacing(true);
      try {
        const total = Math.max(0, input.subtotal + input.shipping - input.discount);
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: user?.email ?? input.email,
            items: items.map((i) => ({
              productId: i.productId,
              productName: i.name,
              price: i.price,
              quantity: i.quantity,
              color: i.color.name,
              size: i.size,
              visual: i.visual,
            })),
            ...input,
            total: total,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Não foi possível finalizar o pedido.");
        setLastOrder(data.order as Order);
        clearCart();
        return data.order as Order;
      } finally {
        setPlacing(false);
      }
    },
    [items, clearCart, user]
  );

  const reset = useCallback(() => setLastOrder(null), []);

  const value = useMemo<OrderContextValue>(
    () => ({ placing, lastOrder, placeOrder, reset }),
    [placing, lastOrder, placeOrder, reset]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder deve ser usado dentro de <OrderProvider>");
  return ctx;
}