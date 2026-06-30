// Archivage des soirées + badges humoristiques pour L'Ardoise des Comptes.

import { lireStockage, ecrireStockage } from '../../lib/storage';
import { picBAC, type Conso, type Profil } from './widmark';

export interface SessionArchive {
  id: string;
  debut: number; // ts de la première conso
  fin: number; // ts de clôture
  consos: Conso[];
  picBac: number;
  totalGrammes: number;
  nbConsos: number;
}

const CLE_HISTO = 'pese-alco-historique';

export function lireHistorique(): SessionArchive[] {
  return lireStockage<SessionArchive[]>(CLE_HISTO, []);
}

export function viderHistorique(): void {
  ecrireStockage(CLE_HISTO, []);
}

/** Archive la session courante (si non vide) et renvoie l'archive créée. */
export function archiverSession(consos: Conso[], profil: Profil): SessionArchive | null {
  if (consos.length === 0) return null;
  const tries = [...consos].sort((a, b) => a.ts - b.ts);
  const archive: SessionArchive = {
    id: Date.now().toString(36),
    debut: tries[0].ts,
    fin: Date.now(),
    consos: tries,
    picBac: picBAC(tries, profil),
    totalGrammes: Math.round(tries.reduce((s, c) => s + c.grammes, 0)),
    nbConsos: tries.length,
  };
  ecrireStockage(CLE_HISTO, [archive, ...lireHistorique()].slice(0, 100));
  return archive;
}

// ── Badges ──────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  emoji: string;
  nom: string;
  desc: string;
  obtenu: boolean;
}

interface SessionLike {
  consos: Conso[];
  picBac: number;
  nbConsos: number;
}

function aShotDeNuit(consos: Conso[]): boolean {
  return consos.some((c) => {
    const h = new Date(c.ts).getHours();
    return c.type === 'shot' && (h >= 23 || h < 5);
  });
}

function aTroisEnTrenteMin(consos: Conso[]): boolean {
  const ts = consos.map((c) => c.ts).sort((a, b) => a - b);
  for (let i = 0; i + 2 < ts.length; i++) {
    if (ts[i + 2] - ts[i] <= 30 * 60_000) return true;
  }
  return false;
}

/**
 * Calcule les badges à partir de l'historique et de la session en cours.
 * `picCourant` permet de tenir compte de la session non encore clôturée.
 */
export function calculerBadges(
  histo: SessionArchive[],
  sessionCourante: Conso[],
  picCourant: number
): Badge[] {
  const sessions: SessionLike[] = [
    ...histo,
    ...(sessionCourante.length
      ? [{ consos: sessionCourante, picBac: picCourant, nbConsos: sessionCourante.length }]
      : []),
  ];

  const def = (id: string, emoji: string, nom: string, desc: string, obtenu: boolean): Badge => ({ id, emoji, nom, desc, obtenu });

  return [
    def('chameau', '🐫', 'Chameau du mois', 'Une soirée bouclée sous 0,1 g/L. Respect, l’abstème.',
      sessions.some((s) => s.nbConsos >= 1 && s.picBac < 0.1)),
    def('sage', '🧘', 'Le Sage', 'Une soirée arrosée mais toujours sous la limite légale.',
      sessions.some((s) => s.nbConsos >= 2 && s.picBac < 0.5)),
    def('desperado', '🌵', 'Desperado', 'Un shot dégainé entre 23 h et 5 h du matin.',
      sessions.some((s) => aShotDeNuit(s.consos))),
    def('culsec', '🚀', 'Cul sec', 'Trois consos en moins de 30 minutes. Doucement, fusée.',
      sessions.some((s) => aTroisEnTrenteMin(s.consos))),
    def('marathonien', '🏃', 'Marathonien du zinc', 'Une soirée à 6 consos ou plus.',
      sessions.some((s) => s.nbConsos >= 6)),
    def('pilier', '🍺', 'Pilier de comptoir', 'Au moins 3 soirées enregistrées dans l’ardoise.',
      histo.length >= 3),
    def('patois', '🥴', 'Diplômé de patois', 'Pic au-dessus de 1,2 g/L. À éviter de rééditer…',
      sessions.some((s) => s.picBac >= 1.2)),
  ];
}
