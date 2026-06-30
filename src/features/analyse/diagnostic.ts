// ──────────────────────────────────────────────────────────────────────────
// « L'Analyse » — bilan de performance du pilier, façon montre connectée (WHOOP)
// mais TOTALEMENT à côté de la plaque. Tout est calculé à partir des vraies
// consos (ça a l'air scientifique), les verdicts sont du grand n'importe quoi.
// ⚠️ Parodie. Aucune valeur médicale.
// ──────────────────────────────────────────────────────────────────────────

import { COL } from '../../ui/theme';
import type { Conso, Profil } from '../pesealco/widmark';
import type { SessionArchive } from '../pesealco/historique';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r = Math.round;

export interface Jauge {
  label: string;
  valeur: number;
  max: number;
  unite: string;
  couleur: string;
  verdict: string;
}

export interface Metrique {
  label: string;
  valeur: string;
  sous: string;
}

export interface Diagnostic {
  scorePilier: number; // 0-100, anneau principal
  scoreLabel: string;
  scoreVerdict: string;
  scoreCouleur: string;
  jauges: Jauge[];
  metriques: Metrique[];
  recommandations: string[];
}

function freqTournee(consos: Conso[]): number {
  if (consos.length < 2) return consos.length;
  const ts = consos.map((c) => c.ts);
  const heures = Math.max(0.5, (Math.max(...ts) - Math.min(...ts)) / 3_600_000);
  return consos.length / heures;
}

function gradePosture(pic: number): string {
  return pic < 0.5 ? 'A' : pic < 1 ? 'B' : pic < 1.5 ? 'C' : pic < 2.2 ? 'D' : pic < 3 ? 'E' : 'F';
}

/** Le grand bilan, calculé sur la session en cours. */
export function diagnostiquer(consos: Conso[], picBac: number, totalGrammes: number, _profil: Profil): Diagnostic {
  const n = consos.length;
  const pic = picBac;

  // ── Score principal « Forme du Pilier » (plus tu bois, plus tu performes…) ──
  let scorePilier = 0;
  let scoreLabel = 'Pilier au repos';
  let scoreVerdict = 'Données insuffisantes. Commande un verre pour lancer l’analyse.';
  let scoreCouleur: string = COL.gris;
  if (n > 0) {
    scorePilier = clamp(r(35 + n * 7 + pic * 8), 1, 100);
    if (scorePilier < 40) {
      scoreLabel = 'Échauffement';
      scoreVerdict = 'Le potentiel est là. On chauffe la machine, tranquille.';
      scoreCouleur = COL.or;
    } else if (scorePilier < 70) {
      scoreLabel = 'Pilier confirmé';
      scoreVerdict = 'Performance de comptoir solide et régulière. Du beau travail.';
      scoreCouleur = COL.ambre;
    } else {
      scoreLabel = 'Pilier d’élite';
      scoreVerdict = 'Top 3 % national. (Ce n’est absolument pas un compliment.)';
      scoreCouleur = COL.vert;
    }
  }

  // ── Jauges façon anneaux ──
  const foie = clamp(r(100 - pic * 22 - n * 4), 0, 100);
  const strain = clamp(r(pic * 5 + n * 1.5), 0, 21);
  const hydra = clamp(r(55 - n * 9), 0, 100);

  const jauges: Jauge[] = [
    {
      label: 'Récupération du foie',
      valeur: foie, max: 100, unite: '%',
      couleur: foie > 66 ? COL.vert : foie > 33 ? COL.ambre : COL.rouge,
      verdict: foie > 66 ? 'Foie frais, prêt au service.' : foie > 33 ? 'Le foie hausse un sourcil.' : 'Préavis de grève déposé au foie.',
    },
    {
      label: 'Charge houblon (strain)',
      valeur: strain, max: 21, unite: '/21',
      couleur: strain < 7 ? COL.vert : strain < 14 ? COL.ambre : COL.rouge,
      verdict: strain < 7 ? 'Charge légère, simple échauffement.' : strain < 14 ? 'Belle séance de comptoir.' : 'Surentraînement du coude détecté.',
    },
    {
      label: 'Hydratation',
      valeur: hydra, max: 100, unite: '%',
      couleur: hydra > 50 ? COL.vert : hydra > 20 ? COL.ambre : COL.rouge,
      verdict: hydra > 50 ? 'Hydratation correcte (pour un pilier).' : hydra > 20 ? 'Ça manque sérieusement d’eau.' : '0 verre d’eau détecté. Le Sahara est jaloux.',
    },
  ];

  // ── Métriques « avancées » (fausse précision, vrais délires) ──
  const metriques: Metrique[] = [
    { label: 'Variabilité du coude (VDC)', valeur: `${r(34 + pic * 9)} ms`, sous: 'Souplesse d’articulation optimale.' },
    { label: 'Fréquence de tournée', valeur: `${freqTournee(consos).toFixed(1)} /h`, sous: 'Cadence soutenue. Félicitations (non).' },
    { label: 'Capacité chansonnette', valeur: `${r(58 + pic * 10)} dB`, sous: 'Karaoké : zone de danger imminent.' },
    { label: 'Stabilité posturale', valeur: gradePosture(pic), sous: 'Tangage proportionnel à l’ambiance.' },
    { label: 'Réflexe « c’est ma tournée »', valeur: `${r(Math.max(95, 240 - pic * 18))} ms`, sous: 'Réflexe de pilier : quasi surnaturel.' },
    { label: 'Ronflement projeté', valeur: `${r(68 + pic * 9)} dB`, sous: 'Niveau motoculteur. Prévenez le voisinage.' },
  ];

  // ── Recommandations du coach (sérieux, totalement à côté) ──
  let recommandations: string[];
  if (n === 0) {
    recommandations = ['Rien à analyser pour l’instant. Le coach attend ta première conso pour s’exprimer.'];
  } else {
    recommandations = [
      '🛌 Récupération : 9 h de sommeil réparateur recommandées. La banquette est homologuée.',
      '💧 Protocole d’hydratation : un grand verre d’eau, puis un deuxième. On insiste lourdement.',
      '🚫 À proscrire aujourd’hui : le volant, les SMS à l’ex, et refaire le monde après minuit.',
    ];
    if (pic >= 1.5) recommandations.push('🚕 Récupération active : commander un taxi compte comme une séance de sport.');
    if (totalGrammes >= 60) recommandations.push('🥖 Apport glucidique conseillé : un kebab tactique avant le coucher.');
  }

  return { scorePilier, scoreLabel, scoreVerdict, scoreCouleur, jauges, metriques, recommandations };
}

// ── Alibi du lendemain (clin d'œil à S2M) ──
export const ALIBIS: string[] = [
  '« J’étais à une conférence sur l’hydratation. Très instructif. »',
  '« C’est le saumon de midi qui n’est pas passé, je te jure. »',
  '« On fêtait le départ de Gérard. » (Gérard ne part jamais.)',
  '« J’ai aidé un ami à déménager. Toute la nuit. »',
  '« Une intoxication. Probablement les cacahuètes. »',
  '« Réunion stratégique imprévue. Au sommet. Du comptoir. »',
  '« J’ai perdu mon téléphone. Et un peu la notion du temps. »',
];

export function alibiAleatoire(): string {
  return ALIBIS[Math.floor(Math.random() * ALIBIS.length)];
}

/** Tendance des dernières soirées (pic de BAC), pour le mini-graphe hebdo. */
export function tendanceHebdo(histo: SessionArchive[]): { label: string; pic: number }[] {
  return [...histo]
    .slice(0, 7)
    .reverse()
    .map((s) => ({
      label: new Date(s.debut).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
      pic: s.picBac,
    }));
}
