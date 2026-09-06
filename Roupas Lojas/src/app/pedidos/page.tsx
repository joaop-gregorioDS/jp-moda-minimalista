"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PackageOpen, PackageSearch } from "lucide-react";
import { SESSION_KEY, useAuth } from "@/contexts/AuthContext";
import { OrderAccordionCard, MOCK_ORDERS } from "@/components/orders/OrderAccordionCard";
import type { Order } from "@/lib/types";

export default function PedidosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem(SESSION_KEY);
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrders(data.orders ?? []);
      })
      .catch(() => setOrders([]));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <PackageSearch size={34} className="text-mist" />
        <h1 className="mt-4 text-xl font-bold text-ink">Entre para ver seus pedidos</h1>
        <p className="mt-2 text-sm text-mist">Seus pedidos ficam atrelados ao seu e-mail.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-black"
        >
          Fazer login
        </button>
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="mx-auto flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-mist">Carregando pedidos…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Meus pedidos</h1>

      {orders.length === 0 ? (
        <>
          <div className="mt-8 flex min-h-[32vh] max-w-md flex-col items-center justify-center px-4 text-center">
            <PackageOpen size={34} className="text-mist" />
            <h2 className="mt-4 text-xl font-bold text-ink">Nenhum pedido ainda</h2>
            <p className="mt-2 text-sm text-mist">Que tal escolher sua primeira peça minimalista?</p>
            <Link
              href="/catalogo"
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-black"
            >
              Explorar catálogo
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-widest text-mist">
              Prévia — como seus pedidos aparecerão aqui
            </p>
            <div className="mt-4 space-y-4">
              {MOCK_ORDERS.map((order) => (
                <OrderAccordionCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderAccordionCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}