"use client";

import { Fragment, useState } from "react";
import {
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { cn, formatBRL } from "@/lib/utils";
import type { Order, OrderItem } from "@/lib/types";

export interface OrderAccordionOrder extends Order {
  payment?: string;
  coupon?: string;
  orderNumber?: string;
  items: (OrderItem & { colorHex?: string })[];
}

interface OrderAccordionCardProps {
  order: OrderAccordionOrder;
  defaultExpanded?: boolean;
}

const TIMELINE = [
  { label: "Pedido realizado", icon: ClipboardList },
  { label: "Pagamento aprovado", icon: CreditCard },
  { label: "Em separação", icon: Package },
  { label: "Em transporte", icon: Truck },
  { label: "Entregue", icon: CheckCircle2 },
];

const STEP_BY_STATUS: Record<string, number> = {
  pendente: 1,
  separacao: 2,
  enviado: 4,
  entregue: 5,
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  entregue: { label: "Entregue", cls: "bg-emerald-100 text-emerald-700" },
  enviado: { label: "Em transporte", cls: "bg-sky-100 text-sky-700" },
  separacao: { label: "Em separação", cls: "bg-sand text-ink" },
  pendente: { label: "Pagamento pendente", cls: "bg-gold/15 text-gold-dark" },
};

const NEUTRAL_HEX = "#8b857a";

function itemColorHex(item: OrderItem & { colorHex?: string }) {
  return item.colorHex ?? NEUTRAL_HEX;
}

export function OrderAccordionCard({ order, defaultExpanded = false }: OrderAccordionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const orderNumber = order.orderNumber ?? String(order.id).padStart(6, "0");
  const dateLabel = new Date(order.createdAt).toLocaleDateString("pt-BR");
  const status = STATUS_META[order.status] ?? { label: order.status, cls: "bg-ink/5 text-ink" };
  const reachedSteps = STEP_BY_STATUS[order.status] ?? 1;
  const isPickup = /retirada/i.test(order.address.street);
  const mainItem = order.items[0];
  const paymentLabel = order.payment ?? (isPickup ? "Pagamento confirmado" : "Cartão de Crédito");

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-[0_1px_3px_rgba(17,17,17,0.05)]">
      <button
        type="button"
        onClick={() => setIsExpanded((open) => !open)}
        aria-expanded={isExpanded}
        className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-left transition-colors duration-300 hover:bg-sand/50 md:px-6"
      >
        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand ring-1 ring-ink/10">
          <ProductVisual
            motif={mainItem.visual || "tee"}
            color={itemColorHex(mainItem)}
            className="h-full w-full"
            size="sm"
          />
        </div>

        <div className="min-w-[150px]">
          <p className="text-xs text-mist">Nº do pedido</p>
          <p className="text-sm font-bold tabular-nums text-ink">{orderNumber}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-mist">
            <CalendarDays size={13} />
            {dateLabel}
          </p>
        </div>

        <div className="hidden min-w-[110px] md:block">
          <p className="text-xs text-mist">Data da compra</p>
          <p className="text-sm font-medium text-ink">{dateLabel}</p>
        </div>

        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize",
            status.cls
          )}
        >
          {order.status === "entregue" && <CheckCircle2 size={14} />}
          {status.label}
        </span>

        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300",
            isExpanded ? "rotate-180 border-ink bg-ink text-gold" : "hover:border-ink/40"
          )}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      <div
        className={cn("grid transition-all duration-300 ease-in-out", isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
        aria-hidden={!isExpanded}
      >
        <div className="overflow-hidden">
          <div className="space-y-8 border-t border-ink/10 px-5 py-6 md:px-8 md:py-8">
            {/* A — Timeline */}
            <div className="overflow-x-auto pb-1 no-scrollbar">
              <ol className="flex min-w-[560px] items-start">
                {TIMELINE.map(({ label, icon: Icon }, i) => {
                  const done = i < reachedSteps;
                  const connectorDone = i + 1 < reachedSteps;
                  return (
                    <Fragment key={label}>
                      <li className="flex w-20 flex-col items-center sm:w-24">
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors duration-300",
                            done ? "bg-ink text-gold ring-ink" : "bg-ink/5 text-mist ring-ink/10"
                          )}
                        >
                          <Icon size={17} strokeWidth={done ? 2 : 1.7} />
                        </span>
                        <span
                          className={cn(
                            "mt-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide",
                            done ? "text-ink" : "text-mist"
                          )}
                        >
                          {label}
                        </span>
                      </li>
                      {i < TIMELINE.length - 1 && (
                        <li
                          aria-hidden="true"
                          className={cn(
                            "mt-5 h-[2px] flex-1",
                            connectorDone ? "bg-ink" : "bg-ink/15"
                          )}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </ol>
            </div>

            {/* B — Botões de ação */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-paper transition-colors duration-300 hover:bg-black"
              >
                <Star size={14} />
                Avaliar produtos
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <RotateCcw size={14} />
                Refazer pedido
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <Truck size={14} />
                Detalhes do rastreio
              </button>
            </div>

            {/* C — Resumo financeiro */}
            <div className="mx-auto max-w-lg text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-mist">Total do pedido</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-ink">{formatBRL(order.total)}</p>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-mist">
                <CreditCard size={14} />
                {paymentLabel}
              </p>
              {order.discount > 0 && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                  <BadgePercent size={12} />
                  Cupom {order.coupon ?? "aplicado"} · -{formatBRL(order.discount)}
                </p>
              )}
            </div>

            {/* D — Itens × Entrega */}
            <div className="grid gap-10 md:grid-cols-2">
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-mist">Itens da compra</h4>
                <ul className="mt-4 space-y-4">
                  {order.items.map((item, i) => (
                    <li key={`${order.id}-${i}`} className="flex items-center gap-4">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand ring-1 ring-ink/10">
                        <ProductVisual
                          motif={item.visual || "tee"}
                          color={itemColorHex(item)}
                          className="h-full w-full"
                          size="sm"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{item.productName}</p>
                        <p className="mt-0.5 text-xs text-mist">
                          {item.color?.toLocaleLowerCase() ?? "Cor padrão"} · Tam. {item.size?.toLocaleUpperCase() ?? "Único"}
                        </p>
                        <p className="mt-0.5 text-xs text-mist">
                          {item.quantity} × {formatBRL(item.price)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-ink">
                        {formatBRL(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-mist">Entrega</h4>
                <div className="mt-4 rounded-2xl border border-ink/10 bg-sand/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-ink/10">
                      {isPickup ? <Store size={16} /> : <Truck size={16} />}
                    </span>
                    {isPickup ? "Retirada na loja" : "Transportadora"}
                  </div>
                  <address className="mt-3 flex items-start gap-2 text-sm not-italic leading-relaxed text-ink/75">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gold-dark" />
                    <span>
                      {isPickup ? (
                        <>
                          {order.address.street} {"·"} {order.address.complement}
                        </>
                      ) : (
                        <>
                          {order.address.street}, {order.address.number}
                          {order.address.complement ? ` · ${order.address.complement}` : ""}
                        </>
                      )}
                      <br />
                      {order.address.city} - {order.address.state} · CEP {order.address.zip}
                    </span>
                  </address>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const MOCK_ORDERS: OrderAccordionOrder[] = [
  {
    id: 1042,
    orderNumber: "2418500377492",
    customerName: "Maria da Silva",
    customerEmail: "maria@email.com",
    status: "entregue",
    createdAt: "2026-06-15T14:00:00-03:00",
    subtotal: 316.82,
    shipping: 0,
    discount: 25,
    total: 291.82,
    payment: "Cartão de Crédito 1x de R$ 291,82",
    coupon: "JPBEMVINDO",
    address: {
      street: "Retirada na loja",
      number: "",
      complement: "Rua da Moda, 100 — São Paulo/SP",
      city: "São Paulo",
      state: "SP",
      zip: "01000-000",
    },
    items: [
      {
        productId: 21,
        productName: "Blusa de tricô off-white",
        price: 129.9,
        quantity: 1,
        color: "Off-white",
        size: "P",
        visual: "tee",
        colorHex: "#e6e2d8",
      },
      {
        productId: 33,
        productName: "Calça wide leg alfaiataria",
        price: 186.92,
        quantity: 1,
        color: "Preto",
        size: "38",
        visual: "pant",
        colorHex: "#333333",
      },
    ],
  },
  {
    id: 1037,
    orderNumber: "2417388832276",
    customerName: "Maria da Silva",
    customerEmail: "maria@email.com",
    status: "enviado",
    createdAt: "2026-07-02T09:12:00-03:00",
    subtotal: 148.9,
    shipping: 0,
    discount: 0,
    total: 148.9,
    payment: "Cartão de Crédito 1x de R$ 148,90",
    address: {
      street: "Rua Augusta",
      number: "1209",
      complement: "Apto 84",
      city: "São Paulo",
      state: "SP",
      zip: "01305-100",
    },
    items: [
      {
        productId: 18,
        productName: "Camiseta básica 100% algodão",
        price: 99.9,
        quantity: 2,
        color: "Branco",
        size: "M",
        visual: "tee",
        colorHex: "#f2f0ea",
      },
      {
        productId: 44,
        productName: "Vestido canelado canelado",
        price: 49,
        quantity: 1,
        color: "Cinza",
        size: "GG",
        visual: "dress",
        colorHex: "#9aa0a6",
      },
    ],
  },
];