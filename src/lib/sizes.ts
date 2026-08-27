export const APPAREL_SIZES = ["PP", "P", "M", "G", "GG", "Único"];
export const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"];

export function catalogHref(patch: Record<string, string | undefined>, current?: URLSearchParams) {
  const next = new URLSearchParams(current ? Array.from(current.entries()) : []);
  for (const [key, value] of Object.entries(patch)) {
    if (value && value.length > 0) next.set(key, value);
    else next.delete(key);
  }
  next.delete("pagina");
  const qs = next.toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}

export function productSizeHref(slug: string, size: string) {
  return `/produto/${slug}?tamanho=${encodeURIComponent(size)}`;
}
