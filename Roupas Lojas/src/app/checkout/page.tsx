"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Barcode,
  CheckCircle2,
  CreditCard,
  Home,
  Landmark,
  Loader2,
  Lock,
  PackageOpen,
  QrCode,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { CreditCardForm } from "@/components/checkout/CreditCardForm";
import { PixQrModal } from "@/components/checkout/PixQrModal";
import { buttonStyles } from "@/components/ui/Button";
import { cn, formatBRL, FREE_SHIPPING_THRESHOLD, SHIPPING_FIXED } from "@/lib/utils";

const STEPS = ["Dados", "Entrega", "Pagamento"];
const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
const LOJA_DEMO = {
  endereco: "Rua da Moda, 100 — São Paulo/SP",
  horario: "Seg a sáb, das 9h às 20h",
};
const PIX_KEY = "pix@jpstore.com.br";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-mist/70 focus:border-ink focus:outline-none transition-colors";

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist">{label}</span>
      {children}
    </label>
  );
}

const paymentOptions = [
  {
    id: "pix" as const,
    icon: QrCode,
    label: "Pix",
    bonus: "5% de desconto",
    note: "aprovação imediata",
    discount: true,
  },
  {
    id: "cartao" as const,
    icon: CreditCard,
    label: "Cartão",
    bonus: "até 6x sem juros",
    note: "dados com criptografia",
    discount: false,
  },
  {
    id: "boleto" as const,
    icon: Landmark,
    label: "Boleto",
    bonus: "5% de desconto",
    note: "compensação em 2 dias úteis",
    discount: true,
  },
];

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { placing, lastOrder, placeOrder, reset } = useOrder();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [delivery, setDelivery] = useState<"entrega" | "retirada">("entrega");
  const [payment, setPayment] = useState<"pix" | "cartao" | "boleto">("pix");
  const [processing, setProcessing] = useState(false);
  const [pixQrOpen, setPixQrOpen] = useState(false);
  const [error, setError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  useEffect(() => {
    if (!user) return;
    const id = requestAnimationFrame(() => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? "");
    });
    return () => cancelAnimationFrame(id);
  }, [user]);

  const shipping = delivery === "retirada" || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FIXED;
  const discount =
    paymentOptions.find((p) => p.id === payment)?.discount && delivery === "entrega"
      ? Math.round(subtotal * 0.05 * 100) / 100
      : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const addressOk =
    delivery === "retirada" ||
    (street.trim().length >= 2 && city.trim().length >= 2 && (zip.trim().length >= 5 || state));

  const cardOk =
    payment !== "cartao" ||
    (cardNumber.replace(/\s/g, "").length === 16 &&
      cardName.trim().length >= 2 &&
      /^\d{2}\/\d{2}$/.test(cardExpiry) &&
      /^\d{3,4}$/.test(cardCvv));

  const formOk =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    addressOk &&
    cardOk;

  const finalOrder = async () => {
    setError("");
    try {
      await placeOrder({
        name: name.trim(),
        email: email.trim(),
        address: {
          street: delivery === "retirada" ? "Retirada na loja" : street.trim(),
          number: delivery === "retirada" ? "" : streetNumber.trim(),
          complement: delivery === "retirada" ? LOJA_DEMO.endereco : complement.trim() || undefined,
          city: delivery === "retirada" ? "São Paulo" : city.trim(),
          state: delivery === "retirada" ? "SP" : state,
          zip: delivery === "retirada" ? "00000-000" : zip.trim(),
        },
        subtotal,
        shipping,
        discount,
      });
    } catch (e) {
      setError((e as Error).message || "Não foi possível finalizar o pedido.");
    }
  };

  const submit = () => {
    setError("");
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      if (payment === "pix") {
        setPixQrOpen(true);
        return;
      }
      void finalOrder();
    }, 2000);
  };

  if (lastOrder) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
          <CheckCircle2 size={38} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Pedido confirmado!</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Seu pedido <b className="text-ink">#{String(lastOrder.id).padStart(6, "0")}</b> foi recebido.
          Enviaremos os detalhes para <b className="text-ink">{lastOrder.customerEmail}</b>.
        </p>
        <Link href="/catalogo" onClick={reset} className={cn(buttonStyles("primary", "md"), "mt-8")}>
          Continuar comprando
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-mist">
          <ShoppingBag size={30} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Nada para finalizar</h1>
        <p className="mt-2 text-sm text-mist">Sua sacola está vazia.</p>
        <Link href="/catalogo" className={cn(buttonStyles("primary", "md"), "mt-8")}>
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-6 md:py-10 lg:pb-10">
      <PixQrModal
        open={pixQrOpen}
        total={total}
        pixKey={PIX_KEY}
        processing={placing}
        onClose={() => setPixQrOpen(false)}
        onConfirm={() => void finalOrder()}
      />

      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Checkout</h1>

      <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            {i > 0 && <span className="mx-1 hidden h-px w-6 bg-ink/15 sm:block" />}
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                i === 2 ? "bg-ink text-paper" : "bg-gold text-ink"
              )}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-ink">1 · Seus dados</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Maria da Silva" />
              </Field>
              <Field label="E-mail">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="maria@email.com" />
              </Field>
              <Field label="Telefone">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="(11) 99999-9999" />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">2 · Entrega</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "entrega" as const, icon: Home, title: "Receber em casa", desc: "Entrega tradicional na sua residência." },
                  { id: "retirada" as const, icon: Store, title: "Retirar na loja", desc: "Retire na loja física, frete grátis." },
                ]
              ).map(({ id, icon: Icon, title, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDelivery(id)}
                  aria-pressed={delivery === id}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-300",
                    delivery === id
                      ? "border-ink bg-ink text-paper shadow-lg"
                      : "border-ink/15 bg-white hover:border-ink/40"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                      delivery === id ? "bg-paper/10 text-gold" : "bg-sand text-ink"
                    )}
                  >
                    <Icon size={21} />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className={cn("mt-1 block text-xs", delivery === id ? "text-paper/65" : "text-mist")}>
                      {desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              {delivery === "retirada" ? (
                <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.06] p-5 text-sm text-ink/75">
                  <Store size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                  <p>
                    Sua compra estará disponível para retirada na loja física:{" "}
                    <b className="font-semibold text-ink">{LOJA_DEMO.endereco}</b>.{" "}
                    <span className="text-mist">(Horário: {LOJA_DEMO.horario}.)</span> O frete para
                    esta opção é <b className="font-semibold text-gold-dark">grátis</b>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-6">
                    <Field label="Rua" className="sm:col-span-4">
                      <input value={street} onChange={(e) => setStreet(e.target.value)} className={inputCls} placeholder="Rua da Moda" />
                    </Field>
                    <Field label="Número" className="sm:col-span-2">
                      <input value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} className={inputCls} placeholder="100" />
                    </Field>
                    <Field label="Complemento" className="sm:col-span-6">
                      <input value={complement} onChange={(e) => setComplement(e.target.value)} className={inputCls} placeholder="Apto 42" />
                    </Field>
                    <Field label="Cidade" className="sm:col-span-3">
                      <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} placeholder="São Paulo" />
                    </Field>
                    <Field label="Estado" className="sm:col-span-1">
                      <select value={state} onChange={(e) => setState(e.target.value)} className={inputCls}>
                        <option value="">UF</option>
                        {ESTADOS.map((uf) => (
                          <option key={uf}>{uf}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="CEP" className="sm:col-span-2">
                      <input value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} placeholder="00000-000" />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => setState(ESTADOS[Math.floor(Math.random() * ESTADOS.length)])}
                    className="mt-2 text-xs font-medium text-gold-dark underline underline-offset-2"
                  >
                    Preencher estado aleatório (demo)
                  </button>
                </>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">3 · Pagamento</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {paymentOptions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all duration-300",
                    payment === p.id
                      ? "border-ink bg-ink text-paper shadow-lg"
                      : "border-ink/15 bg-white hover:border-ink/40"
                  )}
                >
                  <p.icon size={22} className={payment === p.id ? "text-gold" : "text-ink"} />
                  <p className="mt-3 font-semibold">{p.label}</p>
                  <p className={cn("mt-1 text-xs", payment === p.id ? "text-paper/70" : "text-gold-dark")}>{p.bonus}</p>
                  <p className={cn("text-xs", payment === p.id ? "text-paper/50" : "text-mist")}>{p.note}</p>
                </button>
              ))}
            </div>

            {payment === "cartao" && (
              <CreditCardForm
                cardNumber={cardNumber}
                cardName={cardName}
                cardExpiry={cardExpiry}
                cardCvv={cardCvv}
                installments={installments}
                total={subtotal + shipping}
                onCardNumber={setCardNumber}
                onCardName={setCardName}
                onCardExpiry={setCardExpiry}
                onCardCvv={setCardCvv}
                onInstallments={setInstallments}
              />
            )}

            {payment === "pix" && (
              <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <QrCode size={17} className="text-gold-dark" /> Pagamento via Pix
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Ao finalizar o pedido, você receberá o <b>QR Code</b> e a chave{" "}
                  <b>Pix Copia e Cola</b>. O pagamento deve ser feito em até{" "}
                  <b className="font-semibold text-ink">10 minutos</b>.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                  <Barcode size={13} /> 5% de desconto aplicado no valor total
                </p>
              </div>
            )}

            {payment === "boleto" && (
              <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Landmark size={17} className="text-gold-dark" /> Boleto bancário
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  O <b>boleto</b> será gerado ao finalizar o pedido. O prazo de vencimento é de{" "}
                  <b className="font-semibold text-ink">2 dias úteis</b> após a emissão.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                  <Barcode size={13} /> Ganhe 5% de desconto pagando no boleto
                </p>
              </div>
            )}

            <p className="mt-4 flex items-center gap-2 text-xs text-mist">
              <Lock size={13} /> Ambiente seguro. Dados de pagamento não são armazenados.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white/60 p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-ink">Resumo</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-3 py-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand ring-1 ring-ink/10">
                  <ProductVisual motif={i.visual} color={i.color.hex} className="h-full w-full" size="xs" />
                  <span className="absolute right-0.5 top-0.5 rounded-full bg-ink px-1.5 text-[10px] font-bold text-paper">
                    {i.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{i.name}</p>
                  <p className="text-xs text-mist">{i.color.name} · {i.size}</p>
                </div>
                <span className="text-sm font-semibold">{formatBRL(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mist">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1.5 text-mist">
                {delivery === "retirada" ? <Store size={13} /> : <Truck size={13} />} Entrega
              </dt>
              <dd className="font-semibold text-ink">
                {shipping === 0 ? <span className="text-gold-dark">Grátis</span> : formatBRL(shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mist">Desconto</dt>
              <dd className="font-semibold text-gold-dark">
                {discount ? `-${formatBRL(discount)}` : "—"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base">
              <dt className="font-bold text-ink">Total</dt>
              <dd className="text-xl font-bold text-ink">{formatBRL(total)}</dd>
            </div>
          </dl>

          {delivery === "retirada" && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] px-3 py-2.5 text-xs text-ink/70">
              <PackageOpen size={14} className="mt-0.5 shrink-0 text-gold-dark" />
              Retirada em: Rua da Moda, 100 — São Paulo/SP (frete grátis).
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!formOk || processing}
            className={cn(buttonStyles("primary", "lg"), "mt-6 w-full disabled:opacity-40")}
          >
            {processing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processando pagamento…
              </>
            ) : (
              `Finalizar pedido · ${formatBRL(total)}`
            )}
          </button>
          <p className="mt-3 text-center text-xs text-mist">
            Ao finalizar, você concorda com nossos termos.
          </p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={submit}
          disabled={!formOk || processing}
          className={cn(buttonStyles("primary", "lg"), "w-full disabled:opacity-40")}
        >
          {processing ? "Processando…" : `Finalizar · ${formatBRL(total)}`}
        </button>
      </div>
    </div>
  );
}