"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface FavoritesContextValue {
  ids: number[];
  ready: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number, productName?: string) => void;
  hasFavorites: boolean;
  lastAdded: { id: number; name: string } | null;
  dismissToast: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "jp_favs_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [lastAdded, setLastAdded] = useState<{ id: number; name: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      void 0;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback(
    (id: number, productName?: string) => {
      setIds((prev) => {
        if (prev.includes(id)) {
          setLastAdded(null);
          return prev.filter((f) => f !== id);
        }
        setLastAdded({ id, name: productName ?? "" });
        return [...prev, id];
      });
    },
    []
  );

  const dismissToast = useCallback(() => setLastAdded(null), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      ready: hydrated,
      isFavorite,
      toggleFavorite,
      hasFavorites: ids.length > 0,
      lastAdded,
      dismissToast,
    }),
    [ids, hydrated, isFavorite, toggleFavorite, lastAdded, dismissToast]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve ser usado dentro de <FavoritesProvider>");
  return ctx;
}