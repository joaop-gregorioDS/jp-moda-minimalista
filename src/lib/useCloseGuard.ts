"use client";

import { useEffect, useRef } from "react";

/** Ignores the same tap that opened an overlay (iOS/Android tap-through). */
export function useCloseGuard(active: boolean, delayMs = 450) {
  const ready = useRef(!active);

  useEffect(() => {
    ready.current = !active;
    if (!active) return;
    const id = window.setTimeout(() => {
      ready.current = true;
    }, delayMs);
    return () => window.clearTimeout(id);
  }, [active, delayMs]);

  return () => ready.current;
}
