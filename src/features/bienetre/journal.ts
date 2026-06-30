// Journal local des ressentis (échelle de bien-être) — à montrer aux soignants.

import { lireStockage, ecrireStockage } from '../../lib/storage';

export interface EntreeBienEtre {
  date: string; // YYYY-MM-DD
  heure: string; // HH:MM
  id: number; // id du cran de l'échelle (1–5)
}

const CLE = 'bienetre';
const MAX = 60;

export function lireJournal(): EntreeBienEtre[] {
  return lireStockage<EntreeBienEtre[]>(CLE, []);
}

export function enregistrerRessenti(id: number): void {
  const maintenant = new Date();
  const entree: EntreeBienEtre = {
    date: maintenant.toISOString().slice(0, 10),
    heure: `${String(maintenant.getHours()).padStart(2, '0')}:${String(maintenant.getMinutes()).padStart(2, '0')}`,
    id,
  };
  const journal = [...lireJournal(), entree].slice(-MAX);
  ecrireStockage(CLE, journal);
}

export function effacerJournal(): void {
  ecrireStockage(CLE, []);
}
