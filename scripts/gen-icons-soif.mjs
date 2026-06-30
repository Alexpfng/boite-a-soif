// Génère favicon + icônes PWA à partir du logo La Boît'à Soif.
// Usage : node scripts/gen-icons-soif.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'public/brand/logo.png';
mkdirSync('public/icons', { recursive: true });

const cibles = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/icon-maskable-512.png', 512],
  ['public/apple-touch-icon.png', 180],
  ['public/favicon-48.png', 48],
  ['public/favicon-32.png', 32],
  ['public/favicon-16.png', 16],
];

for (const [out, size] of cibles) {
  await sharp(SRC).resize(size, size, { fit: 'cover' }).png().toFile(out);
  console.log(`✓ ${out} (${size}px)`);
}
console.log('Icônes générées.');
