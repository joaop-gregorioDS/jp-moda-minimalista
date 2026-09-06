"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function diffParts(target: number) {
  const total = Math.max(0, Math.floor(target / 1000));
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function CountdownTimer({ hours, className }: { hours: number; className?: string }) {
  const [millis, setMillis] = useState(hours * 3600 * 1000);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setMillis(Math.max(0, hours * 3600 * 1000 - (Date.now() - start)));
    }, 1000);
    return () => clearInterval(id);
  }, [hours]);

  const { h, m, s } = diffParts(millis);
  const pad = (n: number) => String(n).padStart(2, "0");

  const Box = ({ value, unit }: { value: string; unit: string }) => (
    <span className="inline-flex items-baseline gap-1 tabular-nums">
      <span className="font-mono font-bold tabular-nums">{value}</span>
      <span className="text-[0.7em] uppercase tracking-wider opacity-70">{unit}</span>
    </span>
  );

  return (
    <span className={cn("inline-flex items-center gap-2 font-medium", className)}>
      <Box value={pad(h)} unit="h" />
      <span className="opacity-40">:</span>
      <Box value={pad(m)} unit="m" />
      <span className="opacity-40">:</span>
      <Box value={pad(s)} unit="s" />
    </span>
  );
}