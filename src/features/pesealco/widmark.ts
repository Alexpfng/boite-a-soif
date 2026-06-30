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

export type CleEtat = 'frais' | 'joues' | 'chaud' | 'patois' | 'refait' | 'crabe' | 'legende';

export interface EtatBac {
  cle: CleEtat;
  titre: string; // titre satirique de l'état
  sousTitre: string; // punchline
  emoji: string;
  accent: string; // couleur d'accent (DA)
  fond: string; // fond doux du bandeau (DA)
  texteSur: string; // couleur du texte sur le fond
  annonce: string; // phrase de base lue par le "tavernier" (avant bredouillage)
  alerte: boolean; // ≥ 0,5 g/L : on rappelle « on lève le pied »
  danger: boolean; // ≥ 1,5 g/L : pulsation rouge + modale d'alerte
}

// Couleurs de la DA vintage, lisibles sur fond ardoise sombre.
const VERT = '#9EC06B';
const OR = '#E9C46A';
const ORANGE = '#EC9A4B';
const ROUGE = '#E14B3A';
const ROUGE_VIF = '#FF5A3C';
const CREME = '#F3E8CF';

interface Palier {
  max: number;
  cle: CleEtat;
  titre: string;
  sousTitre: string;
  emoji: string;
  accent: string;
  fond: string;
  annonce: string;
}

// Paliers d'ivresse, du plus frais au coma joyeux. Plus on boit, plus ça part.
const PALIERS: Palier[] = [
  { max: 0.5, cle: 'frais', titre: 'Frais comme un gardon', emoji: '😎', sousTitre: 'Tu tiens le comptoir droit. Bravo champion.', accent: VERT, fond: '#20281C', annonce: 'Frais comme un gardon. Tout va bien au comptoir.' },
  { max: 1.0, cle: 'joues', titre: 'Les joues qui rosissent', emoji: '🙂', sousTitre: 'Ça se réchauffe gentiment. On savoure, tranquille.', accent: OR, fond: '#2A2517', annonce: 'Les joues qui rosissent. On est bien, là.' },
  { max: 1.5, cle: 'chaud', titre: 'Picon-Chaud', emoji: '🥵', sousTitre: 'Le béret penche, la cravate aussi. On lève le pied.', accent: ORANGE, fond: '#33271A', annonce: 'Picon chaud. Pense à boire un grand verre d eau.' },
  { max: 2.2, cle: 'patois', titre: 'Parle couramment le patois', emoji: '🥴', sousTitre: 'Risque élevé d’envoyer un SMS à ton ex. Pose le téléphone.', accent: ROUGE, fond: '#341F1B', annonce: 'Attention, tu parles patois. Ne prends surtout pas la route.' },
  { max: 3.0, cle: 'refait', titre: 'Refait le monde à lui tout seul', emoji: '🗣️', sousTitre: 'Tu tutoies le patron et tu règles la géopolitique. De l’eau. Maintenant.', accent: ROUGE, fond: '#3A1D18', annonce: 'Voilà, tu refais le monde. Allez, un verre d eau et au lit.' },
  { max: 4.0, cle: 'crabe', titre: 'Démarche en crabe', emoji: '🦀', sousTitre: 'Le sol tangue, les murs aussi. Assieds-toi, capitaine.', accent: ROUGE_VIF, fond: '#3F1C16', annonce: 'Oulààà, ça tangue. Tiens-toi au comptoir, mon grand.' },
  { max: Infinity, cle: 'legende', titre: 'Légende du comptoir', emoji: '☠️', sousTitre: 'Niveau coma joyeux. Même le tavernier ne comprend plus rien.', accent: ROUGE_VIF, fond: '#431A14', annonce: 'Mhhh shanté, t es mon meilleur pote toi, hips.' },
];

/** État courant selon le BAC : 7 paliers, du gardon frais au coma joyeux. */
export function etatBac(bac: number): EtatBac {
  const p = PALIERS.find((x) => bac < x.max) ?? PALIERS[PALIERS.length - 1];
  return {
    cle: p.cle,
    titre: p.titre,
    sousTitre: p.sousTitre,
    emoji: p.emoji,
    accent: p.accent,
    fond: p.fond,
    texteSur: CREME,
    annonce: p.annonce,
    alerte: bac >= LIMITE_LEGALE,
    danger: bac >= 1.5,
  };
}

/** Voix du tavernier de plus en plus pâteuse : pitch ↓ et débit ↓ avec le BAC. */
export function paramsIvresse(bac: number): { pitch: number; rate: number } {
  const pitch = Math.max(0.2, 0.6 - Math.max(0, bac - 1) * 0.08);
  const rate = Math.max(0.5, 0.95 - Math.max(0, bac - 1.5) * 0.1);
  return { pitch, rate };
}

const INTERJ = ['hips', 'euuuh', 'hein', 'pfff', 'han'];
const GLOUBI = ['Mhhh… hips…', 'shhanté…', 't’es… t’es mon meilleur pôteuh…', 'euuuuh…', 'attends… j’ai oublié…', 'lalala…', '*hips*', 'han… quoi ?', 'le… le truc, là…'];

/**
 * « Bredouille » une phrase selon le BAC : intacte sous 2 g/L, de plus en plus
 * pâteuse ensuite (voyelles étirées + interjections), et carrément
 * incompréhensible à partir de 5 g/L (charabia total).
 */
export function bredouiller(texte: string, bac: number): string {
  if (bac < 2) return texte;
  if (bac >= 5) {
    const n = 6 + Math.floor(Math.random() * 4);
    let out = '';
    for (let i = 0; i < n; i++) out += GLOUBI[Math.floor(Math.random() * GLOUBI.length)] + ' ';
    return out.trim();
  }
  const f = Math.min(1, (bac - 2) / 2.5);
  const res: string[] = [];
  for (const mot of texte.split(' ')) {
    const m = mot.replace(/[aeiouy]/gi, (v) => (Math.random() < f * 0.5 ? v + v + v : v));
    res.push(m);
    if (Math.random() < f * 0.3) res.push('… ' + INTERJ[Math.floor(Math.random() * INTERJ.length)] + ' …');
  }
  return res.join(' ');
}
