// « Propose ta réplique » — boîte à idées LOCALE (sur cet appareil).
// Les gens proposent des répliques de pilier de comptoir et les likent.
// ⚠️ Version locale : pas encore partagée entre utilisateurs. Le « top du mois
// intégré au Juke-Box » à l'échelle de tous nécessitera le backend (Supabase).

import { lireStockage, ecrireStockage } from '../../lib/storage';

export interface Proposition {
  id: string;
  texte: string;
  likes: number;
  ts: number;
  dejaLike?: boolean; // ce device a déjà liké (1 like / appareil)
}

const CLE = 'jukebox-propositions';

function brut(): Proposition[] {
  return lireStockage<Proposition[]>(CLE, []);
}

/** Liste triée : plus likées d'abord, puis plus récentes. */
export function lirePropositions(): Proposition[] {
  return [...brut()].sort((a, b) => b.likes - a.likes || b.ts - a.ts);
}

export function ajouterProposition(texte: string): Proposition[] {
  const t = texte.trim();
  if (!t) return lirePropositions();
  const p: Proposition = {
    id: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
    texte: t.slice(0, 120),
    likes: 0,
    ts: Date.now(),
  };
  ecrireStockage(CLE, [...brut(), p]);
  return lirePropositions();
}

export function likerProposition(id: string): Proposition[] {
  ecrireStockage(CLE, brut().map((p) => (p.id === id && !p.dejaLike ? { ...p, likes: p.likes + 1, dejaLike: true } : p)));
  return lirePropositions();
}

export function retirerProposition(id: string): Proposition[] {
  ecrireStockage(CLE, brut().filter((p) => p.id !== id));
  return lirePropositions();
}
