"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Rocket, Tag, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

const STORAGE_KEY = "jp_announcement_dismissed_v1";

interface Announcement {
  id: string;
  icon: "truck" | "tag" | "rocket";
  text: string;
  strong?: string;
  cta?: string;
  href?: string;
  countdown?: boolean;
  interval: number;
}

const ANNOUNCEMENTS: Announcement[] = [
  { id: "frete", icon: "truck", text: "Frete grátis em compras acima de", strong: "R$ 299", interval: 5000 },
  { id: "vip", icon: "rocket", text: "Programa VIP JP —", strong: "ganhe 10% off", cta: "Conhecer", href: "/catalogo", interval: 5200 },
  { id: "oferta", icon: "tag", text: "Cupom", strong: "JPQUIET15", cta: "Aproveitar", href: "/catalogo", countdown: true, interval: 6000 },
];

const ICONS = { truck: Truck, tag: Tag, rocket: Rocket };

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [variant, setVariant] = useState<"A" | "B">("A");
  const timerRef = useRef<number | null>(null);

  const current = ANNOUNCEMENTS[index];

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") setDismissed(true);
    } catch {
      void 0;
    }
    setVariant(Math.random() < 0.5 ? "A" : "B");
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const interval = useMemo(() => current?.interval ?? 5000, [current]);

  useEffect(() => {
    if (dismissed || !mounted) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [dismissed, mounted, interval]);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      void 0;
    }
  };

  if (dismissed || !mounted) return null;
  const Icon = ICONS[current.icon];
  const showAltCoupon = variant === "B" && current.id === "oferta";

  return (
    <div className="relative z-50 bg-ink text-paper">
      <div
        key={`${current.id}-${index}`}
        className="animate-ticker flex min-h-10 items-center justify-center gap-2 px-10 py-2 text-center text-[11px] text-paper/95 sm:px-12 sm:text-[13px]"
      >
        <Icon size={14} className="shrink-0 text-gold" />
        <span className="text-balance">
          {current.text}{" "}
          {current.strong && <strong className="text-gold">{current.strong}</strong>}
          {showAltCoupon && <b className="text-paper/70"> • variante: JPOUTRO10</b>}
          {current.countdown && (
            <CountdownTimer hours={11} className="ml-2 text-gold" />
          )}
          {current.href && (
            <a
              href={current.href}
              className="ml-2 inline-flex items-center gap-1 border-b border-gold/40 text-gold transition-colors hover:border-gold"
            >
              {current.cta}
            </a>
          )}
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar aviso"
          className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <X size={15} />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0.5 flex justify-center gap-1.5">
        {ANNOUNCEMENTS.map((a, i) => (
          <button
            key={a.id}
            type="button"
            aria-label={`Ver aviso ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-[3px] w-3 rounded-full transition-all duration-300",
              i === index ? "bg-gold" : "bg-paper/25 hover:bg-paper/45"
            )}
          />
        ))}
      </div>
    </div>
  );
}