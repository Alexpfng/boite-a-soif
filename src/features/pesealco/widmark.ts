// ──────────────────────────────────────────────────────────────────────────
// Le Pèse-Alco — moteur d'estimation du taux d'alcoolémie (formule de Widmark)
//
// ⚠️ ESTIMATION INDICATIVE, À BUT LUDIQUE. Ne remplace JAMAIS un éthylotest
// certifié. L'abus d'alcool est dangereux pour la santé. On ne prend jamais
// la route en se fiant à ce calcul. (cf. avertissement affiché dans l'UI)
// ──────────────────────────────────────────────────────────────────────────

export type Sexe = 'homme' | 'femme' | 'autre';

export interface Profil {
  poids: number; // kg
  taille: number; // cm
  age: number; // années
  sexe: Sexe;
}

export interface Conso {
  id: string;
  type: string; // clé du preset (ex: 'demi')
  label: string; // libellé affiché (ex: "Demi (25 cl)")
  grammes: number; // grammes d'alcool pur
  emoji: string;
  ts: number; // horodatage (ms) de la prise
}

export const PROFIL_DEFAUT: Profil = { poids: 75, taille: 175, age: 30, sexe: 'homme' };

// Coefficient de diffusion de Widmark (r) selon le sexe.
const R: Record<Sexe, number> = { homme: 0.68, femme: 0.55, autre: 0.62 };

// Vitesse moyenne d'élimination de l'alcool (g/L par heure).
export const BETA = 0.15;

// Densité de l'éthanol (g/mL).
const DENSITE_ETHANOL = 0.789;

// Seuils légaux français (g/L de sang).
export const LIMITE_LEGALE = 0.5;
export const LIMITE_PROBATOIRE = 0.2;

export interface PresetBoisson {
  type: string;
  label: string;
  emoji: string;
  volumeCl: number;
  degre: number; // % vol
}

/** Grammes d'alcool pur = volume(mL) × (degré/100) × densité éthanol. */
export function grammesAlcool(volumeCl: number, degre: number): number {
  return Math.round(volumeCl * 10 * (degre / 100) * DENSITE_ETHANOL * 10) / 10;
}

// Les classiques du comptoir.
export const PRESETS: PresetBoisson[] = [
  { type: 'demi', label: 'Demi', emoji: '🍺', volumeCl: 25, degre: 5 },
  { type: 'pinte', label: 'Pinte', emoji: '🍻', volumeCl: 50, degre: 5 },
  { type: 'rouge', label: 'Ballon de rouge', emoji: '🍷', volumeCl: 12, degre: 12.5 },
  { type: 'shot', label: 'Shot', emoji: '🥃', volumeCl: 3, degre: 40 },
];

/**
 * Taux d'alcoolémie (g/L) à l'instant `maintenant`, calculé par accumulation
 * chronologique : on ajoute l'apport de chaque conso et on élimine BETA g/L
 * par heure entre les événements (en bornant à 0 pour gérer les longs creux).
 */
export function calculerBAC(consos: Conso[], profil: Profil, maintenant: number): number {
  if (consos.length === 0) return 0;
  const r = R[profil.sexe] ?? R.autre;
  const masse = Math.max(40, profil.poids); // garde-fou anti-aberration
  const tries = [...consos].sort((a, b) => a.ts - b.ts);

  let bac = 0;
  let prev = tries[0].ts;
  for (const c of tries) {
    const heures = Math.max(0, (c.ts - prev) / 3_600_000);
    bac = Math.max(0, bac - BETA * heures); // élimination pendant l'intervalle
    bac += c.grammes / (r * masse); // apport de la conso
    prev = c.ts;
  }
  const heuresFin = Math.max(0, (maintenant - prev) / 3_600_000);
  bac = Math.max(0, bac - BETA * heuresFin); // élimination jusqu'à maintenant
  return bac;
}

/**
 * Pic de BAC atteint sur la session. Avec absorption instantanée, le maximum
 * survient juste après une conso : on évalue donc le taux à chaque prise.
 */
export function picBAC(consos: Conso[], profil: Profil): number {
  if (consos.length === 0) return 0;
  const tries = [...consos].sort((a, b) => a.ts - b.ts);
  let pic = 0;
  for (const c of tries) pic = Math.max(pic, calculerBAC(tries, profil, c.ts));
  return pic;
}

/** Durée (ms) avant de repasser sous `seuil` g/L (0 si déjà en dessous). */
export function tempsSousSeuil(bacActuel: number, seuil: number): number {
  if (bacActuel <= seuil) return 0;
  return ((bacActuel - seuil) / BETA) * 3_600_000;
}

/** Durée (ms) avant un retour à 0,00 g/L. */
export function tempsRetourZero(bacActuel: number): number {
  return tempsSousSeuil(bacActuel, 0);
}

/** Formate une durée (ms) en « 2 h 30 » / « 45 min ». */
export function formaterDuree(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  if (totalMin <= 0) return 'maintenant';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}

export type CleEtat = 'sobre' | 'chaud' | 'danger';

export interface EtatBac {
  cle: CleEtat;
  titre: string; // titre satirique de l'état
  sousTitre: string; // punchline
  emoji: string;
  accent: string; // couleur d'accent (DA)
  fond: string; // fond doux du bandeau (DA)
  texteSur: string; // couleur du texte sur le fond
  annonce: string; // phrase lue à voix haute par le "tavernier"
}

// Couleurs sémantiques de la DA vintage, lisibles sur fond ardoise sombre.
const VERT = '#9EC06B'; // vert vintage
const ORANGE = '#EC9A4B'; // ambre (picon)
const ROUGE = '#E14B3A'; // rouge néon

/**
 * État courant selon le BAC. Trois paliers, fidèles au brief :
 * « Frais comme un gardon » → « Picon-Chaud » → « Parle couramment le patois ».
 */
export function etatBac(bac: number): EtatBac {
  if (bac < LIMITE_LEGALE) {
    return {
      cle: 'sobre',
      titre: 'Frais comme un gardon',
      sousTitre: 'Tu tiens le comptoir droit. Bravo champion.',
      emoji: '😎',
      accent: VERT,
      fond: '#20281C',
      texteSur: '#F3E8CF',
      annonce: 'Frais comme un gardon. Tout va bien au comptoir.',
    };
  }
  if (bac < 1.2) {
    return {
      cle: 'chaud',
      titre: 'Picon-Chaud',
      sousTitre: 'Les joues rosissent, le béret penche. On lève le pied.',
      emoji: '🥵',
      accent: ORANGE,
      fond: '#33271A',
      texteSur: '#F3E8CF',
      annonce: 'Picon chaud. Pense à boire un verre d eau.',
    };
  }
  return {
    cle: 'danger',
    titre: 'Parle couramment le patois',
    sousTitre: 'Risque élevé d’envoyer un SMS à ton ex. Pose le téléphone.',
    emoji: '🥴',
    accent: ROUGE,
    fond: '#341F1B',
    texteSur: '#F3E8CF',
    annonce: 'Attention. Tu parles couramment le patois. Ne prends surtout pas la route.',
  };
}
