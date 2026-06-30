// ──────────────────────────────────────────────────────────────────────────
// Le Tableau des Champions — fausse bande de potes (données simulées).
//
// On ne génère QUE des données : profils + consos horodatées en RELATIF par
// rapport à `maintenant`, pour que `calculerBAC` (Widmark) sorte des taux
// variés et NON nuls. Un pote est « Sam » le capitaine de soirée : zéro conso
// (taux 0,00) → c'est le héros qui ramène tout le monde.
//
// ⚠️ Classement local et purement ludique, comme tout le reste de l'appli.
// ──────────────────────────────────────────────────────────────────────────

import { grammesAlcool, type Conso, type Profil } from '../pesealco/widmark';

export interface Pote {
  id: string;
  pseudo: string;
  profil: Profil;
  consos: Conso[];
  /** Le Sam de la soirée : sobre, taux 0,00, halo de héros. */
  estCapitaine?: boolean;
}

// Quelques minutes en millisecondes (sucre de lecture pour les `ts`).
const MIN = 60_000;

/** Identifiant simple et unique (suffisant pour des potes fictifs locaux). */
function nouvelId(): string {
  return `pote-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/**
 * Fabrique une conso à partir d'un preset volume/degré, horodatée à
 * `maintenant - ilYaMin` minutes. On réutilise `grammesAlcool` pour rester
 * cohérent avec le moteur (demi ≈ 10 g, pinte ≈ 20 g, shot ≈ 9,5 g, rouge ≈ 12 g).
 */
function conso(
  maintenant: number,
  ilYaMin: number,
  type: string,
  label: string,
  emoji: string,
  volumeCl: number,
  degre: number,
): Conso {
  return {
    id: nouvelId(),
    type,
    label,
    emoji,
    grammes: grammesAlcool(volumeCl, degre),
    ts: maintenant - ilYaMin * MIN,
  };
}

// Raccourcis « classiques du comptoir » pour des consos lisibles.
const demi = (m: number, ilYa: number) => conso(m, ilYa, 'demi', 'Demi (25 cl)', '🍺', 25, 5); // ≈ 10 g
const pinte = (m: number, ilYa: number) => conso(m, ilYa, 'pinte', 'Pinte (50 cl)', '🍻', 50, 5); // ≈ 20 g
const shot = (m: number, ilYa: number) => conso(m, ilYa, 'shot', 'Shot (3 cl)', '🥃', 3, 40); // ≈ 9,5 g
const rouge = (m: number, ilYa: number) => conso(m, ilYa, 'rouge', 'Ballon de rouge (12 cl)', '🍷', 12, 12.5); // ≈ 12 g

/**
 * Génère la bande de potes (~6) avec des consos relatives à `maintenant`.
 * Les profils + l'étalement des `ts` sont calibrés pour obtenir un éventail
 * de taux : du léger (~0,2) au bien chaud (~0,9+), plus le Sam à 0,00.
 */
export function genererPotes(maintenant: number): Pote[] {
  return [
    // Mimi-la-Pinte : grosse cadence récente → « Fusée » garantie, taux élevé.
    {
      id: nouvelId(),
      pseudo: 'Mimi-la-Pinte',
      profil: { poids: 62, taille: 165, age: 34, sexe: 'femme' },
      consos: [
        pinte(maintenant, 75),
        pinte(maintenant, 50),
        pinte(maintenant, 15),
        shot(maintenant, 8),
      ],
    },
    // Le Gégé : pilier costaud mais enchaîne, bien dans le chaud.
    {
      id: nouvelId(),
      pseudo: 'Le Gégé',
      profil: { poids: 92, taille: 182, age: 47, sexe: 'homme' },
      consos: [
        pinte(maintenant, 110),
        rouge(maintenant, 80),
        rouge(maintenant, 55),
        pinte(maintenant, 25),
      ],
    },
    // Dédé : tranquille au comptoir, ça monte gentiment.
    {
      id: nouvelId(),
      pseudo: 'Dédé',
      profil: { poids: 78, taille: 174, age: 52, sexe: 'homme' },
      consos: [
        demi(maintenant, 95),
        demi(maintenant, 60),
        rouge(maintenant, 30),
      ],
    },
    // Nadine : deux ballons, déjà un peu pompette mais sage.
    {
      id: nouvelId(),
      pseudo: 'Nadine',
      profil: { poids: 58, taille: 162, age: 41, sexe: 'femme' },
      consos: [
        rouge(maintenant, 70),
        rouge(maintenant, 35),
      ],
    },
    // Toto : juste arrivé, un petit demi → taux léger (~0,2).
    {
      id: nouvelId(),
      pseudo: 'Toto',
      profil: { poids: 70, taille: 178, age: 27, sexe: 'homme' },
      consos: [
        demi(maintenant, 18),
      ],
    },
    // Sam : le capitaine de soirée. Zéro alcool, taux 0,00 → halo de héros 😇.
    {
      id: nouvelId(),
      pseudo: 'Sam',
      profil: { poids: 80, taille: 180, age: 30, sexe: 'autre' },
      consos: [],
      estCapitaine: true,
    },
  ];
}
