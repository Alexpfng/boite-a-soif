// Niveau de Pilier : XP gagnée en lançant les numéros de la Cabine.
// Stocké en local (et synchronisé au compte via CLES_PERSONNELLES → 'cabine-xp').

import { lireStockage, ecrireStockage } from '../../lib/storage';

const CLE = 'cabine-xp';
export const XP_PAR_NIVEAU = 120;

export const TITRES = [
  'Soiffard du dimanche', 'Client occasionnel', 'Habitué du zinc', 'Pilier de comptoir',
  'Tonton du bar', 'Roi de l’apéro', 'Tenancier honoraire', 'Maître du houblon',
  'Sommelier du PMU', 'Légende vivante', 'Mythe du comptoir', 'Divinité de la tournée',
];
const EMOJIS = ['🍺', '🍷', '🍻', '🧉', '🥃', '👑', '🎩', '🏅', '🍾', '🌟', '🔱', '😇'];

export function lireXP(): number {
  return lireStockage<number>(CLE, 0);
}
export function ajouterXP(n: number): number {
  const v = lireXP() + n;
  ecrireStockage(CLE, v);
  return v;
}

export interface Niveau {
  niveau: number;
  titre: string;
  emoji: string;
  xpDansNiveau: number;
  xpProchain: number;
  pct: number;
  total: number;
}

export function niveauDepuisXP(xp: number): Niveau {
  const niveau = Math.floor(xp / XP_PAR_NIVEAU) + 1;
  const xpDansNiveau = xp % XP_PAR_NIVEAU;
  const idx = Math.min(niveau - 1, TITRES.length - 1);
  return {
    niveau,
    titre: TITRES[idx],
    emoji: EMOJIS[idx],
    xpDansNiveau,
    xpProchain: XP_PAR_NIVEAU,
    pct: Math.round((xpDansNiveau / XP_PAR_NIVEAU) * 100),
    total: xp,
  };
}

export function emojiNiveau(niveau: number): string {
  return EMOJIS[Math.min(niveau - 1, EMOJIS.length - 1)];
}
