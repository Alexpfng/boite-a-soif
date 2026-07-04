// ──────────────────────────────────────────────────────────────────────────
// L'Apéro du jour : un défi de comptoir quotidien, le même pour tout le monde
// (déterministe par date locale), affiché sur l'accueil. Le relever crédite
// un peu d'XP de Pilier — une seule fois par jour. Les défis font rire la
// tablée, jamais boire davantage.
// ──────────────────────────────────────────────────────────────────────────

import { lireStockage, ecrireStockage } from '../../lib/storage';
import { ajouterXP } from './progression';

export interface Apero {
  texte: string;
  emoji: string;
}

const DEFIS: Apero[] = [
  { emoji: '👀', texte: 'Trinque en regardant chacun dans les yeux, à l’ancienne. Sinon, 7 ans de mauvaises tournées.' },
  { emoji: '🍺', texte: 'Place le mot « houblon » dans une conversation sérieuse sans te faire griller.' },
  { emoji: '🇧🇪', texte: 'Commande ta prochaine tournée avec l’accent belge. Une fois.' },
  { emoji: '💧', texte: 'Offre une tournée d’eau pétillante en la présentant comme « le nouveau spritz ». Vends-la bien.' },
  { emoji: '🎤', texte: 'Porte un toast d’au moins 20 secondes à quelqu’un de la table. Lyrisme obligatoire.' },
  { emoji: '🥜', texte: 'Le prochain qui dit « santé » paie les cacahuètes. Annonce la règle maintenant.' },
  { emoji: '📖', texte: 'Raconte ton pire surnom de lycée à la tablée. Sans négocier.' },
  { emoji: '🎩', texte: 'Appelle le patron « Maestro » toute la soirée et tiens le rôle.' },
  { emoji: '🤝', texte: 'Serre la main de quelqu’un que tu ne connais pas au comptoir et présente-toi par ton titre de Pilier.' },
  { emoji: '🗣️', texte: 'Glisse « comme disait mon grand-père » avant une phrase totalement inventée.' },
  { emoji: '🧠', texte: 'Fais deviner ta boisson à la tablée en la mimant. Interdiction de parler.' },
  { emoji: '📵', texte: 'Premier qui sort son téléphone sans raison raconte sa dernière honte. Annonce la règle.' },
  { emoji: '🎼', texte: 'Fredonne le générique d’un dessin animé jusqu’à ce que quelqu’un le reconnaisse.' },
  { emoji: '🥸', texte: 'Adopte un pseudonyme d’espion pour la soirée et n’en démords pas.' },
  { emoji: '🏆', texte: 'Désigne solennellement le « Pilier d’honneur » de la table et justifie ton choix.' },
  { emoji: '🚕', texte: 'Vérifie qui est le Sam ce soir et paie-lui son diabolo. C’est le vrai champion.' },
  { emoji: '🃏', texte: 'Raconte une anecdote vraie et une fausse : la table doit deviner laquelle est vraie.' },
  { emoji: '🕰️', texte: 'Parle comme dans un film des années 50 pendant une tournée entière, mon petit gars.' },
  { emoji: '🍋', texte: 'Commande « la spécialité du patron » sans savoir ce que c’est. Assume.' },
  { emoji: '📯', texte: 'Annonce chaque arrivée à la table comme un majordome : nom, titre, réputation.' },
];

// Hash simple et déterministe d'une chaîne → entier positif (même recette que MotDuJour).
function hacher(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Date LOCALE (pas UTC) : au bar, le jour change à minuit, pas à 1 h du matin.
function cleJour(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Le défi du jour — le même pour toute la France des comptoirs. */
export function aperoDuJour(): Apero {
  return DEFIS[hacher(cleJour()) % DEFIS.length];
}

const CLE_FAIT = 'apero-du-jour-fait';
export const XP_APERO = 30;

export function aperoDejaFait(): boolean {
  return lireStockage<string>(CLE_FAIT, '') === cleJour();
}

/** Marque le défi du jour comme relevé et crédite l'XP. Faux si déjà fait. */
export function releverApero(): boolean {
  if (aperoDejaFait()) return false;
  ecrireStockage(CLE_FAIT, cleJour());
  ajouterXP(XP_APERO);
  return true;
}
