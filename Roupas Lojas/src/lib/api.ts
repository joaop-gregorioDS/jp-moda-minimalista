function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function getApiBase() {
  if (typeof window === "undefined") {
    return trimSlash(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");
  }
  return "";
}

export function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBase();
  return `${base}${p}`;
}

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(apiUrl(path), {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
