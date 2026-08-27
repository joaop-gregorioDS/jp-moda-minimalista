"use client";

import { useEffect, useState } from "react";
import { HeaderClient } from "./HeaderClient";
import type { Category } from "@/lib/types";

const FALLBACK_CATEGORIES: Array<Pick<Category, "id" | "slug" | "name">> = [
  { id: 1, slug: "camisetas", name: "Camisetas" },
  { id: 2, slug: "camisas", name: "Camisas" },
  { id: 3, slug: "calcas", name: "Calças" },
  { id: 4, slug: "bermudas", name: "Bermudas" },
  { id: 5, slug: "jaquetas", name: "Jaquetas" },
  { id: 6, slug: "sueteres", name: "Suéteres & Tricô" },
  { id: 7, slug: "blazers", name: "Blazers" },
  { id: 8, slug: "vestidos", name: "Vestidos" },
  { id: 9, slug: "saias", name: "Saias" },
  { id: 10, slug: "casacos", name: "Casacos" },
  { id: 11, slug: "acessorios", name: "Acessórios" },
  { id: 12, slug: "calcados", name: "Calçados" },
];

export default function Header() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/categories", { signal: ac.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => ac.abort();
  }, []);

  return <HeaderClient categories={categories} />;
}
