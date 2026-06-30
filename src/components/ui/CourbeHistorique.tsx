import { COL } from '../../ui/theme';

// Courbe d'évolution simple (SVG, sans dépendance) pour les historiques
// datés à valeur 1–5 (échelle de bien-être, journal de l'aidant).
// Conçue pour être lisible par un public senior : gros points, peu d'axes.

export interface PointCourbe {
  date: string;   // YYYY-MM-DD
  valeur: number; // 1 (bas) → 5 (haut)
  couleur?: string;
}

interface Props {
  points: PointCourbe[];
  /** Nombre max de points affichés (les plus récents). */
  max?: number;
  ariaLabel: string;
}

export function CourbeHistorique({ points, max = 30, ariaLabel }: Props) {
  const data = points.slice(-max);
  if (data.length < 2) return null;

  const W = 320;
  const H = 120;
  const PAD = { haut: 10, bas: 22, gauche: 10, droite: 10 };
  const innerW = W - PAD.gauche - PAD.droite;
  const innerH = H - PAD.haut - PAD.bas;

  const x = (i: number) => PAD.gauche + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.haut + innerH - ((Math.min(5, Math.max(1, v)) - 1) / 4) * innerH;

  const chemin = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.valeur).toFixed(1)}`).join(' ');

  const fmt = (iso: string) => {
    try {
      return new Date(iso + 'T12:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return iso;
    }
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Lignes de repère haut (bien) / bas (mal) */}
      {[1, 3, 5].map((v) => (
        <line key={v} x1={PAD.gauche} y1={y(v)} x2={W - PAD.droite} y2={y(v)}
          stroke={COL.bleu1} strokeWidth="1" strokeDasharray={v === 3 ? '4 4' : undefined} />
      ))}
      {/* Courbe */}
      <path d={chemin} fill="none" stroke={COL.bleu5} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Points */}
      {data.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.valeur)} r="5" fill={p.couleur ?? COL.bleu7} stroke="#fff" strokeWidth="1.6" />
      ))}
      {/* Dates de début et de fin */}
      <text x={PAD.gauche} y={H - 6} fontSize="11" fill={COL.texte2}>{fmt(data[0].date)}</text>
      <text x={W - PAD.droite} y={H - 6} fontSize="11" fill={COL.texte2} textAnchor="end">{fmt(data[data.length - 1].date)}</text>
    </svg>
  );
}
