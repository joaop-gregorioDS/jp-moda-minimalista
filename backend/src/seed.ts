import "dotenv/config";
import mongoose from "mongoose";
import { config } from "./config";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { Order } from "./models/Order";
import { hashPassword } from "./auth";
import { setCounter } from "./lib/ids";
import { slugify } from "./lib/utils";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: () => number, arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (rand: () => number, min: number, max: number) =>
  Math.round((min + rand() * (max - min)) * 100) / 100;

const COLORS = [
  { name: "Noir", hex: "#111111" },
  { name: "Ivory", hex: "#f2ede3" },
  { name: "Stone", hex: "#8f8b84" },
  { name: "Dourado", hex: "#c6a87c" },
  { name: "Sand", hex: "#d8cbb4" },
  { name: "Slate", hex: "#5d6b7a" },
  { name: "Oliva", hex: "#6f715c" },
  { name: "Marrom", hex: "#6b4f3a" },
  { name: "Bordeaux", hex: "#5e2b38" },
  { name: "Navy", hex: "#1e2a3a" },
  { name: "Cinza", hex: "#9b9b9b" },
  { name: "Branco", hex: "#f6f4f0" },
];

const APPAREL_SIZES = ["PP", "P", "M", "G", "GG"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"];
const ONE_SIZE = ["Único"];

const CATEGORIES = [
  {
    slug: "camisetas",
    name: "Camisetas",
    code: "CAM",
    description: "Básicos perfeitos em algodão de alta fiação.",
    accent: "#c6a87c",
    count: 8,
    price: [79, 149],
    sizes: APPAREL_SIZES,
    motifs: ["tee", "tee-long"],
    types: ["Camiseta Oversized", "Camiseta Básica", "Camiseta Slim", "Camiseta Boxy", "Camiseta Gola Alta", "Camiseta Long Line"],
    materials: ["Algodão Pima", "Cotton Supima", "Algodão Orgânico", "Malha Fina", "Algodão Penteado"],
  },
  {
    slug: "camisas",
    name: "Camisas",
    code: "CMS",
    description: "Camisas estruturadas de alfaiataria casual.",
    accent: "#8f8b84",
    count: 6,
    price: [129, 229],
    sizes: APPAREL_SIZES,
    motifs: ["shirt", "shirt", "shirt-camp"],
    types: ["Camisa Oxford", "Camisa Relaxed", "Camisa Slim", "Camisa Sixties", "Camisa Social", "Camisa Utility"],
    materials: ["Algodão", "Linho", "Popelina", "Viscose", "Cotton"],
  },
  {
    slug: "calcas",
    name: "Calças",
    code: "CLQ",
    description: "Calças de corte limpo para o dia a dia.",
    accent: "#5d6b7a",
    count: 8,
    price: [149, 289],
    sizes: APPAREL_SIZES,
    motifs: ["pants-wide", "pants", "pants-tailored"],
    types: ["Calça Reta", "Calça Wide", "Calça Smart", "Calça de Alfaiataria", "Calça Cargo", "Calça Slim"],
    materials: ["Algodão", "Twil", "Linho", "Viscose", "Cotton"],
  },
  {
    slug: "bermudas",
    name: "Bermudas",
    code: "BRM",
    description: "Bermudas leves para dias de calor.",
    accent: "#8f8b84",
    count: 4,
    price: [109, 189],
    sizes: APPAREL_SIZES,
    motifs: ["shorts", "shorts-chino"],
    types: ["Bermuda Chino", "Bermuda Surf", "Bermuda Marcação", "Bermuda Off"],
    materials: ["Algodão", "Twil", "Nylon", "Cotton"],
  },
  {
    slug: "jaquetas",
    name: "Jaquetas",
    code: "JKT",
    description: "Jaquetas de meia estação com cara de eterna.",
    accent: "#6f715c",
    count: 6,
    price: [249, 449],
    sizes: APPAREL_SIZES,
    motifs: ["jacket", "letterman", "trucker"],
    types: ["Jaqueta Biker", "Jaqueta Bomber", "Jaqueta Trucker", "Jaqueta Coach", "Jaqueta Windbreaker"],
    materials: ["Couro Vegan", "Nylon Matte", "Denim", "Algodão", "Ripstop"],
  },
  {
    slug: "sueteres",
    name: "Suéteres & Tricô",
    code: "SWT",
    description: "Malhas quentes, atemporais e elegantes.",
    accent: "#a88758",
    count: 6,
    price: [179, 329],
    sizes: APPAREL_SIZES,
    motifs: ["sweater", "cardigan", "turtleneck"],
    types: ["Suéter Crewneck", "Suéter Gola Alta", "Cardigan Longo", "Suéter Brisado", "Polo de Tricô"],
    materials: ["Lã Merino", "Alpaca", "Cachemira", "Algodão", "Mesclado"],
  },
  {
    slug: "blazers",
    name: "Blazers",
    code: "BLZ",
    description: "Blazers de alfaiataria com humor minimalista.",
    accent: "#1e2a3a",
    count: 4,
    price: [349, 599],
    sizes: APPAREL_SIZES,
    motifs: ["blazer", "blazer"],
    types: ["Blazer Slim", "Blazer Relaxed", "Blazer Unstructured", "Blazer Double"],
    materials: ["Twil", "Lã", "Algodão", "Sarga", "Viscose"],
  },
  {
    slug: "vestidos",
    name: "Vestidos",
    code: "VST",
    description: "Vestidos longos e estruturas fluidas.",
    accent: "#5e2b38",
    count: 6,
    price: [189, 399],
    sizes: APPAREL_SIZES,
    motifs: ["dress", "slip"],
    types: ["Vestido Slip", "Vestido Longo", "Vestido Midi", "Vestido Trapezio", "Vestido Tubo"],
    materials: ["Satin", "Viscose", "Algodão", "Linho", "Voal"],
  },
  {
    slug: "saias",
    name: "Saias",
    code: "SIA",
    description: "Saia de moleza e alfaiataria.",
    accent: "#c4a87c",
    count: 4,
    price: [129, 219],
    sizes: APPAREL_SIZES,
    motifs: ["skirt", "skirt-full"],
    types: ["Saia Midi", "Saia Lápis", "Saia Evasée", "Saia Longa"],
    materials: ["Satin", "Algodão", "Twil", "Viscose"],
  },
  {
    slug: "casacos",
    name: "Casacos",
    code: "CSC",
    description: "Casacos pesados para o inverno urbano.",
    accent: "#111111",
    count: 6,
    price: [289, 549],
    sizes: APPAREL_SIZES,
    motifs: ["coat", "puffer", "parka"],
    types: ["Casaco Tricotado", "Casaco Parque", "Casaco Puffer", "Casaco Peacoat", "Casaco Cropped"],
    materials: ["Alpaca", "Lã", "Nylon", "Down", "Algodão"],
  },
  {
    slug: "acessorios",
    name: "Acessórios",
    code: "ACC",
    description: "Bolsas, cintos, bonés e códigos premium.",
    accent: "#c6a87c",
    count: 8,
    price: [29, 189],
    sizes: ONE_SIZE,
    motifs: ["bag", "belt", "cap", "scarf", "wallet", "watch"],
    types: ["Bolsa Tote", "Mochila", "Cinto Braided", "Boné", "Cachecol", "Carteira Slim", "Relógio Minimalist"],
    materials: ["Couro", "Nylon", "Canvas", "Algodão", "Lã", "Aço"],
  },
  {
    slug: "calcados",
    name: "Calçados",
    code: "CLD",
    description: "Calçados premium, do loafer ao tênis.",
    accent: "#5d6b7a",
    count: 6,
    price: [249, 449],
    sizes: SHOE_SIZES,
    motifs: ["loafer", "sneaker"],
    types: ["Tênis Minimal", "Sapato Loafer", "Mocassim", "Bota Chelsea"],
    materials: ["Couro", "Canvas", "Suede", "Nappa"],
  },
];

const SUFFIX_WORDS = [
  "Essential", "Quiet", "Studio", "Atelier", "Core", "Form", "Calm", "Line", "Base", "Pure",
];

async function main() {
  await mongoose.connect(config.mongoUri);
  const rand = mulberry32(20240807);

  console.log("→ Limpando coleções…");
  await Promise.all([
    Order.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("→ Inserindo categorias…");
  const catDocs = CATEGORIES.map((c, i) => ({
    id: i + 1,
    slug: c.slug,
    name: c.name,
    description: c.description,
    accent: c.accent,
    sortOrder: i,
  }));
  await Category.insertMany(catDocs);

  console.log("→ Gerando catálogo compacto (loja simulada)…");
  const usedSlugs = new Set<string>();
  const products: Record<string, unknown>[] = [];
  let id = 0;

  for (const cat of CATEGORIES) {
    const categoryId = CATEGORIES.findIndex((c) => c.slug === cat.slug) + 1;
    for (let n = 0; n < cat.count; n++) {
      id += 1;
      const type = pick(rand, cat.types);
      const material = pick(rand, cat.materials);
      const suffix = rand() < 0.3 ? pick(rand, SUFFIX_WORDS) : "";
      let name = `${type} ${material}`;
      if (suffix) name += ` — ${suffix}`;

      const base = slugify(`${name} ${n + 1}`);
      let slug = base;
      let guard = 0;
      while (usedSlugs.has(slug) && guard < 20) slug = `${base}-${++guard}`;
      usedSlugs.add(slug);

      const price = between(rand, cat.price[0], cat.price[1]);
      const compareAt = rand() < 0.28 ? between(rand, price * 1.15, price * 1.45) : null;

      let sizes = [...cat.sizes];
      if (cat.sizes === APPAREL_SIZES) {
        const start = Math.floor(rand() * 2);
        const len = 2 + Math.floor(rand() * (APPAREL_SIZES.length - start - 1));
        sizes = APPAREL_SIZES.slice(start, start + len);
      }

      const nColors = 1 + Math.floor(rand() * 3);
      const picked = [...COLORS].sort(() => rand() - 0.5).slice(0, nColors);

      products.push({
        id,
        slug,
        sku: `JP-${cat.code}-${String(n + 1).padStart(4, "0")}`,
        name,
        description: `${name} da coleção ${cat.name}. Peça em tecido de alta qualidade, corte pensado para o corpo e acabamento premium.`,
        price: Number(price.toFixed(2)),
        compareAtPrice: compareAt ? Number(compareAt.toFixed(2)) : null,
        categoryId,
        categorySlug: cat.slug,
        categoryName: cat.name,
        stock: 3 + Math.floor(rand() * 80),
        featured: rand() < 0.18,
        sizes,
        visual: pick(rand, cat.motifs),
        colors: picked.map((c, i) => ({ name: c.name, hex: c.hex, sortOrder: i })),
      });
    }
    console.log(`  ✓ ${cat.name}: ${cat.count} produtos`);
  }

  const BATCH = 250;
  for (let i = 0; i < products.length; i += BATCH) {
    await Product.insertMany(products.slice(i, i + BATCH), { ordered: true });
  }

  await User.create({
    id: 1,
    name: "Cliente Demo",
    email: "demo@jpstore.com.br",
    passwordHash: hashPassword("demo1234"),
    phone: "(11) 99999-0000",
  });

  await setCounter("categories", catDocs.length);
  await setCounter("products", id);
  await setCounter("users", 1);
  await setCounter("orders", 0);

  console.log(`Seed concluído: ${id} produtos, ${catDocs.length} categorias.`);
  console.log("Conta demo: demo@jpstore.com.br / demo1234");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("ERRO NO SEED:", err);
  process.exit(1);
});
