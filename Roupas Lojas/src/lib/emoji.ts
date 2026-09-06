export type VisualSize = "xs" | "sm" | "md" | "lg" | "xl";

interface EmojiVisual {
  emoji: string;
  /** Relative size vs. other product types (accessories smaller, outerwear larger). */
  scale: number;
  label: string;
}

const EMOJIS: Record<string, EmojiVisual> = {
  tee: { emoji: "👕", scale: 1, label: "Camiseta" },
  "tee-long": { emoji: "👕", scale: 1.06, label: "Camiseta alongada" },
  shirt: { emoji: "👔", scale: 1, label: "Camisa" },
  "shirt-camp": { emoji: "👕", scale: 0.96, label: "Camisa camp" },
  pants: { emoji: "👖", scale: 1.08, label: "Calça" },
  "pants-wide": { emoji: "👖", scale: 1.14, label: "Calça wide" },
  "pants-tailored": { emoji: "👖", scale: 1.04, label: "Calça de alfaiataria" },
  shorts: { emoji: "🩳", scale: 0.88, label: "Bermuda" },
  "shorts-chino": { emoji: "🩳", scale: 0.9, label: "Bermuda chino" },
  sweater: { emoji: "🧶", scale: 0.92, label: "Suéter" },
  cardigan: { emoji: "🧥", scale: 1.08, label: "Cardigan" },
  turtleneck: { emoji: "🧣", scale: 0.86, label: "Gola alta" },
  blazer: { emoji: "🤵", scale: 1.12, label: "Blazer" },
  jacket: { emoji: "🧥", scale: 1.16, label: "Jaqueta" },
  letterman: { emoji: "🧥", scale: 1.12, label: "Jaqueta college" },
  trucker: { emoji: "🧥", scale: 1.08, label: "Jaqueta trucker" },
  coat: { emoji: "🧥", scale: 1.22, label: "Casaco" },
  puffer: { emoji: "🧥", scale: 1.18, label: "Puffer" },
  parka: { emoji: "🧥", scale: 1.2, label: "Parka" },
  dress: { emoji: "👗", scale: 1.2, label: "Vestido" },
  slip: { emoji: "👗", scale: 1.14, label: "Vestido slip" },
  skirt: { emoji: "👗", scale: 0.92, label: "Saia" },
  "skirt-full": { emoji: "👗", scale: 1.02, label: "Saia evasê" },
  sneaker: { emoji: "👟", scale: 0.86, label: "Tênis" },
  loafer: { emoji: "👞", scale: 0.84, label: "Sapato" },
  bag: { emoji: "👜", scale: 0.78, label: "Bolsa" },
  belt: { emoji: "🪢", scale: 0.64, label: "Cinto" },
  cap: { emoji: "🧢", scale: 0.7, label: "Boné" },
  scarf: { emoji: "🧣", scale: 0.76, label: "Cachecol" },
  wallet: { emoji: "👛", scale: 0.62, label: "Carteira" },
  watch: { emoji: "⌚", scale: 0.58, label: "Relógio" },
};

const FALLBACK: EmojiVisual = { emoji: "🛍️", scale: 0.9, label: "Peça" };

export function getProductEmoji(motif: string): EmojiVisual {
  return EMOJIS[motif] ?? FALLBACK;
}

