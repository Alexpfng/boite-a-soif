// ──────────────────────────────────────────────────────────────────────────
// DA « LA BOÎT'À SOIF » — enseigne de bar vintage / PMU.
// Fond ardoise sombre, jaune bière, ambre, rouge néon, crème, nappe vichy.
//
// Pour limiter les ruptures, on garde les MÊMES clés que l'ancienne charte mais
// on remappe leurs valeurs vers les rôles vintage (cf. commentaires) :
//   bleu9 = ardoise fond · bleu7 = panneau · bleu5/orangeAccent = or · bleu1 = liseré
//   orange/rouge = rouge néon · orangeFonce = ambre · texte = crème · sable = piste sombre
// ──────────────────────────────────────────────────────────────────────────

export const COL = {
  // Fonds sombres (ardoise)
  bleu9: '#1B1917', // fond appli (ardoise quasi-noire, chaude)
  bleu7: '#241F1B', // panneau / carte sombre
  bleu5: '#E9C46A', // OR (jaune bière) — accent titres, ex-"bleu moyen"
  bleu1: '#3A332C', // liseré / bord sur fond sombre

  // Accents chauds (enseigne)
  orange: '#E14B3A', // ROUGE NÉON — action principale (ex-terracotta)
  orangeHover: '#C53C2D',
  orangeClair: '#2E251C', // panneau ambré sombre (fonds doux)
  orangeFonce: '#E9C46A', // OR (texte d'accent / avertissements)
  orangeAccent: '#E9C46A', // OR (accent clair sur fond sombre)
  sable: '#2C2722', // piste / contrôle sombre (ex-crème)

  // Texte
  texte: '#F3E8CF', // crème (texte principal sur fond sombre)
  texte2: '#BCAF93', // crème atténuée (secondaire)
  gris: '#6F675B',

  // États
  vert: '#9EC06B', // vert vintage (lisible sur sombre)
  rouge: '#E1503A', // rouge danger

  // Alias vintage explicites (préférés pour le nouveau code)
  ardoise: '#1B1917',
  panneau: '#241F1B',
  or: '#E9C46A',
  ambre: '#EC9A4B',
  rougeNeon: '#E14B3A',
  creme: '#F3E8CF',
  cremeAtenue: '#BCAF93',
  ginghamRouge: '#B5392E',
} as const;

export type SectionKey = 'conseils' | 'outils' | 'comprendre' | 'aides';

export const SEC: Record<SectionKey, { label: string; color: string }> = {
  conseils:   { label: 'Conseils',          color: COL.orange },
  outils:     { label: 'Outils',            color: COL.bleu5 },
  comprendre: { label: 'Mieux comprendre',  color: COL.bleu9 },
  aides:      { label: 'Aides et contacts', color: COL.bleu7 },
};

export const FRAUNCES = 'Fraunces, serif';

export const CARD_SHADOW = '0 2px 12px rgba(14,58,77,0.08)';
export const CARD_SHADOW_SM = '0 2px 10px rgba(14,58,77,0.07)';
