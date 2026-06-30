// Génère les icônes (favicon + PWA) à partir du symbole de marque « réseau ».
// Charte A'PHAS'AIDE : symbole sur fond terracotta pour les icônes d'app,
// symbole couleur transparent pour les favicons.
// Usage : node scripts/gen-icons.mjs

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const outDir = resolve(root, 'public');
const iconsDir = resolve(outDir, 'icons');

mkdirSync(iconsDir, { recursive: true });

// Couleurs de la charte
const TERRACOTTA = '#D85E2A';
const PETROLE = '#0F3A4A';

// Le symbole « réseau » occupe la grille 0..100 (nœuds entre ~17 et ~86).
// `node` = couleur des nœuds/liens, `center` = pastille centrale.
const symbole = (node, center) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <line x1="50" y1="49" x2="23" y2="27" stroke="${node}" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="49" x2="80" y2="30" stroke="${node}" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="49" x2="27" y2="75" stroke="${node}" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="49" x2="76" y2="71" stroke="${node}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="23" cy="27" r="6" fill="${node}"/>
  <circle cx="80" cy="30" r="6" fill="${node}"/>
  <circle cx="27" cy="75" r="6" fill="${node}"/>
  <circle cx="76" cy="71" r="6" fill="${node}"/>
  <circle cx="50" cy="49" r="10" fill="${center}"/>
</svg>`;

// Rend un symbole (chaîne SVG) en PNG carré de `size`, avec padding optionnel
// et fond optionnel. `inset` = ratio de marge (0.22 → 22 % de marge).
async function rendre({ svg, size, bg, inset = 0 }) {
  const inner = Math.round(size * (1 - inset * 2));
  const symbolePng = await sharp(Buffer.from(svg), { density: 384 })
    .resize(inner, inner)
    .png()
    .toBuffer();
  const base = bg
    ? sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    : sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
  return base.composite([{ input: symbolePng, gravity: 'center' }]).png().toBuffer();
}

const jobs = [
  // Favicons — symbole couleur, fond transparent
  { out: resolve(outDir, 'favicon-16.png'), svg: symbole(PETROLE, TERRACOTTA), size: 16 },
  { out: resolve(outDir, 'favicon-32.png'), svg: symbole(PETROLE, TERRACOTTA), size: 32 },
  { out: resolve(outDir, 'favicon-48.png'), svg: symbole(PETROLE, TERRACOTTA), size: 48 },
  // Icônes d'app — symbole blanc sur fond terracotta
  { out: resolve(outDir, 'apple-touch-icon.png'), svg: symbole('#FFFFFF', PETROLE), size: 180, bg: TERRACOTTA, inset: 0.22 },
  { out: resolve(iconsDir, 'icon-192.png'), svg: symbole('#FFFFFF', PETROLE), size: 192, bg: TERRACOTTA, inset: 0.22 },
  { out: resolve(iconsDir, 'icon-512.png'), svg: symbole('#FFFFFF', PETROLE), size: 512, bg: TERRACOTTA, inset: 0.22 },
  // Maskable — fond terracotta plein cadre, symbole dans la zone de sécurité
  { out: resolve(iconsDir, 'icon-maskable-512.png'), svg: symbole('#FFFFFF', PETROLE), size: 512, bg: TERRACOTTA, inset: 0.3 },
];

for (const { out, svg, size, bg, inset } of jobs) {
  const png = await rendre({ svg, size, bg, inset });
  await sharp(png).toFile(out);
  console.log(`✓ ${out.replace(root + '/', '')}`);
}
