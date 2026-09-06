"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  align: "left" | "center" | "right";
}

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/banners/noir-1920.webp",
    eyebrow: "Nova coleção",
    title: "Essenciais que duram.",
    subtitle: "Peças em tons sóbrios, cortes estudados e acabamento premium para o uniforme do dia a dia.",
    cta: "Ver coleção",
    href: "/catalogo",
    align: "right",
  },
  {
    id: 2,
    image: "/banners/gold-1920.webp",
    eyebrow: "Coleção FW",
    title: "Camadas de outono.",
    subtitle: "Mantas, alfaiataria e dourados discretos para quando o tempo esfria.",
    cta: "Explorar outerwear",
    href: "/catalogo?categoria=casacos",
    align: "left",
  },
  {
    id: 3,
    image: "/banners/ivory-1920.webp",
    eyebrow: "Quiet deluxe",
    title: "Moda silenciosa.",
    subtitle: "Cortes limpos, tecidos nobres e nenhum ruído. A base de tudo.",
    cta: "Ver camisetas",
    href: "/catalogo?categoria=camisetas",
    align: "center",
  },
];

const AUTO_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    const n = SLIDES.length;
    setIndex(((i % n) + n) % n);
  }, []);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) go(dx < 0 ? index + 1 : index - 1);
    touchX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative h-[58svh] min-h-[340px] overflow-hidden bg-ink focus-visible:outline-2 focus-visible:outline-gold sm:min-h-[420px] md:h-[78vh] md:min-h-[460px]"
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              active ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            )}
          >
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                fetchPriority={active ? "high" : "low"}
                loading={active ? "eager" : "lazy"}
                quality={86}
                sizes="100vw"
                className={cn("object-cover", active && "animate-kenburns")}
              />
            </div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div
              className={cn(
                "absolute inset-0 z-20 flex items-end px-4 pb-16 sm:items-center sm:px-6 sm:pb-0 md:px-16",
                slide.align === "center" && "justify-center text-center",
                slide.align === "left" && "justify-start text-left",
                slide.align === "right" && "justify-end text-right"
              )}
            >
              <div
                className={cn(
                  "max-w-xl",
                  active && "animate-fade-up",
                  slide.align === "center" && "flex flex-col items-center"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-3 text-[2rem] font-black leading-[1.08] tracking-tight text-paper sm:text-5xl md:text-7xl">
                  {slide.title}
                </h1>
                <p
                  className={cn(
                    "mt-4 max-w-md text-sm text-paper/85 sm:mt-5 sm:text-base md:text-lg",
                    slide.align === "center" && "mx-auto"
                  )}
                >
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:shadow-[0_20px_40px_-16px_rgba(198,168,124,0.6)] sm:mt-8 sm:px-7 sm:py-3.5"
                >
                  {slide.cta} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => go(index - 1)}
        className="absolute left-4 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass-dark text-paper transition-all hover:bg-ink hover:text-gold md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => go(index + 1)}
        className="absolute right-4 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass-dark text-paper transition-all hover:bg-ink hover:text-gold md:flex"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-gold" : "w-3 bg-paper/45 hover:bg-paper/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}