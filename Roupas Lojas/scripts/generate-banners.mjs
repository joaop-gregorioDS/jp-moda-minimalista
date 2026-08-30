/**
 * Gera os assets de banners (hero + mosaico) em .webp reais a partir de artes
 * SVG na paleta JP. Regenerar quando quiser:
 *   node scripts/generate-banners.mjs
 * Saída: public/banners/*.webp
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const themes = {
  noir: { base: ["#111111", "#1b1b1a"], glow: "#c6a87c", glowOpacity: 0.28, blob: "#3a3a36", blobOpacity: 0.55, hair: "#ffffff", hairOpacity: 0.05 },
  gold: { base: ["#c9a87d", "#a88758"], glow: "#fff3dc", glowOpacity: 0.5, blob: "#111111", blobOpacity: 0.28, hair: "#111111", hairOpacity: 0.06 },
  ivory: { base: ["#f7f3ec", "#e7dfd0"], glow: "#c6a87c", glowOpacity: 0.45, blob: "#8f8b84", blobOpacity: 0.25, hair: "#111111", hairOpacity: 0.05 },
  slate: { base: ["#4f5a66", "#333a42"], glow: "#c6a87c", glowOpacity: 0.4, blob: "#111111", blobOpacity: 0.4, hair: "#ffffff", hairOpacity: 0.05 },
};

function art(key, w, h) {
  const t = themes[key];
  const hLines = [];
  for (let i = 0; i < 7; i++) {
    const x = w * (0.04 + i * 0.13);
    hLines.push(`<line x1="${x}" y1="${h*0.04}" x2="${x}" y2="${h*0.96}" stroke="${t.hair}" stroke-opacity="${t.hairOpacity}" stroke-width="1"/>`);
  }
  const dots = [];
  for (let i = 0; i < 40; i++) {
    const dx = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const dy = Math.abs(Math.cos(i * 78.233) * 12543.1234) % 1;
    dots.push(
      `<circle cx="${(dx * w).toFixed(0)}" cy="${(dy * h).toFixed(0)}" r="${(dx * 2 + 0.5).toFixed(2)}" fill="${t.hair}" opacity="${(t.hairOpacity * 2).toFixed(3)}"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.base[0]}"/>
      <stop offset="1" stop-color="${t.base[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.18" r="0.7">
      <stop offset="0" stop-color="${t.glow}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="c"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g clip-path="url(#c)">
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
  </g>
  <g clip-path="url(#c)" opacity="${t.blobOpacity}">
    <circle cx="${w*0.16}" cy="${h*0.78}" r="${h * 0.72}" fill="${t.blob}"/>
  </g>
  <g clip-path="url(#c)" opacity="${t.blobOpacity}">
    <circle cx="${w * 0.88}" cy="${h * 0.5}" r="${h * 0.16}" fill="none" stroke="${t.blob}" stroke-width="2"/>
  </g>
  <g clip-path="url(#c)" opacity="${t.blobOpacity}">
    <circle cx="${w * 0.88}" cy="${h * 0.5}" r="${h * 0.27}" fill="none" stroke="${t.glow}" stroke-width="1.2" stroke-opacity="0.5"/>
  </g>
  <g clip-path="url(#c)">
    ${hLines.join("\n")}
  </g>
  <g clip-path="url(#c)">
    ${dots.join("\n")}
  </g>
  <g clip-path="url(#c)" opacity="${t.blobOpacity}">
    <path d="M${w*0.95},${h*0.35} C${w*0.72},${h*0.62} ${w*0.55},${h*0.28} ${w*0.42},${h*0.02}" fill="none" stroke="${t.glow}" stroke-width="1.4" stroke-opacity="0.6"/>
    <path d="M${w * 0.97},${h * 0.9} C${w * 0.78},${h * 0.88} ${w * 0.6},${h * 0.55} ${w * 0.5},${h * 0.3}" fill="none" stroke="${t.glow}" stroke-width="1.2" stroke-opacity="0.35"/>
  </g>
  <g clip-path="url(#c)">
    <circle cx="${w * 0.958}" cy="${h * 0.05}" r="${h * 0.015}" fill="${t.glow}" opacity="${t.glowOpacity}"/>
    <circle cx="${w * 0.932}" cy="${h * 0.05}" r="${h * 0.009}" fill="${t.glow}" opacity="${t.glowOpacity}"/>
  </g>
</svg>`;
}

async function main() {
  const outDir = join(ROOT, "public", "banners");
  mkdirSync(outDir, { recursive: true });
  for (const key of Object.keys(themes)) {
    for (const w of [1920, 1280]) {
      const h = Math.round((w * 10) / 16);
      const file = join(outDir, `${key}-${w}.webp`);
      await sharp(Buffer.from(art(key, w, h))).webp({ quality: 80, effort: 4 }).toFile(file);
      console.log("✓", `${key}-${w}.webp`);
    }
  }
  console.log("Banners gerados em public/banners✓");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});