// Contenus de La Cabine : horoscope du pilier, compteurs (« dernière », pipi).
// Tout est bon enfant, façon comptoir.

export interface Signe { cle: string; nom: string; emoji: string }

export const SIGNES: Signe[] = [
  { cle: 'belier', nom: 'Bélier', emoji: '🐏' },
  { cle: 'taureau', nom: 'Taureau', emoji: '🐂' },
  { cle: 'gemeaux', nom: 'Gémeaux', emoji: '👯' },
  { cle: 'cancer', nom: 'Cancer', emoji: '🦀' },
  { cle: 'lion', nom: 'Lion', emoji: '🦁' },
  { cle: 'vierge', nom: 'Vierge', emoji: '🌾' },
  { cle: 'balance', nom: 'Balance', emoji: '⚖️' },
  { cle: 'scorpion', nom: 'Scorpion', emoji: '🦂' },
  { cle: 'sagittaire', nom: 'Sagittaire', emoji: '🏹' },
  { cle: 'capricorne', nom: 'Capricorne', emoji: '🐐' },
  { cle: 'verseau', nom: 'Verseau', emoji: '🏺' },
  { cle: 'poissons', nom: 'Poissons', emoji: '🐟' },
];

export const HOROSCOPES: string[] = [
  'Aujourd’hui, le blanc-cass vous tend les bras. N’y résistez pas.',
  'Mars est en pression : méfiez-vous des shooters après 23 h.',
  'Une tournée gratuite croisera votre route. Tenez-vous prêt à dire merci.',
  'Votre foie réclame une trêve. Vous ne l’écouterez pas. C’est noté.',
  'Jour faste pour refaire le monde au comptoir. Le monde n’a rien demandé.',
  'Vénus est mal lunée : ce soir, on ne texte PAS son ex.',
  'Un Tonton va vous raconter LA blague. Riez, c’est plus court.',
  'La chance vous sourit : le perdant paiera la tournée, et ce ne sera pas vous.',
  'Évitez le karaoké ce soir. Vraiment. On vous aura prévenu.',
  'Votre démarche sera approximative dès 22 h. Prévoyez un Sam.',
  'Le pastis vous appelle. Décrochez, c’est poli.',
  'Belle-maman rôde dans les parages. Gardez le détecteur sous le pouce.',
  'Journée idéale pour exploser votre record de « c’est ma dernière ».',
  'Un demi de trop, un éclat de rire de plus : le bilan reste positif.',
  'Mercure est rétrograde, votre carte bleue aussi au moment de régler.',
  'Vous brillerez en société… surtout à partir du troisième verre.',
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Horoscope « du jour » : stable pour un signe sur la journée. */
export function horoscopeDuJour(signe: string): string {
  const jour = new Date().toISOString().slice(0, 10);
  return HOROSCOPES[hash(jour + signe) % HOROSCOPES.length];
}

const MSG_DERNIERE = [
  'La première « dernière ». On y croit encore, c’est mignon.',
  'Deuxième « dernière ». Le mythe se construit.',
  'Troisième… tiens, on dirait qu’on a déjà entendu ça.',
  'Quatrième « dernière ». Ta parole vaut un cubi.',
  'Cinquième ! À ce stade, c’est carrément un mode de vie.',
  'Sixième « dernière ». Le patron rigole tout seul derrière le zinc.',
];
export function commentaireDerniere(n: number): string {
  if (n <= 0) return 'Aucune « dernière » déclarée. La nuit est jeune.';
  return MSG_DERNIERE[n - 1] ?? `${n}e « dernière »… tu es une légende vivante du déni.`;
}

/** Badge + commentaire du Pisse-mètre selon le nombre de pauses. */
export function etatPisse(n: number): { badge: string; mot: string } {
  if (n <= 0) return { badge: '🚽', mot: 'Vessie au repos. Profitez-en.' };
  if (n < 3) return { badge: '💧 Échauffement', mot: 'Ça va, vous gérez encore.' };
  if (n < 6) return { badge: '🐦 Vessie de moineau', mot: 'Vous connaissez le chemin par cœur.' };
  if (n < 10) return { badge: '🚰 Tour de contrôle', mot: 'Les toilettes, votre résidence secondaire.' };
  return { badge: '🏆 Champion de la fuite', mot: 'On va vous facturer le loyer des WC.' };
}
