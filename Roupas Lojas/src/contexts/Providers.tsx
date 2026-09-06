"use client";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";
import { OrderProvider } from "./OrderContext";
import { ToastProvider } from "./ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrderProvider>{children}</OrderProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}