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
  'Les planètes s’alignent au-dessus du comptoir. Comme ton coude, d’ailleurs.',
  'Saturne te conseille la modération. Saturne n’a jamais goûté un bon pastis.',
  'Forte probabilité de tournée offerte entre 18 h et la fermeture.',
  'Ton thème astral annonce un grand « refaire le monde ». Hydrate-toi avant.',
  'Jupiter en maison 5 : victoire au juke-box. Le karaoké, lui, te trahira.',
  'Un astre brille pour toi. C’est peut-être juste l’enseigne du bar d’en face.',
  'Vénus susurre : ce soir, le téléphone reste au fond de la poche. L’ex aussi.',
  'Mercure rétrograde : tu confondras « la dernière » et « l’avant-dernière ». Sept fois.',
  'Belle énergie pour danser. Énergie catastrophique pour tenir debout.',
  'Les augures sont formels : aujourd’hui, c’est demi-tarif… dans ta tête.',
  'Ton ascendant est « comptoir ». Ça explique beaucoup de choses.',
  'Pleine lune sur le zinc : tes blagues sembleront géniales. À toi tout seul.',
  'Alignement rare : tu retrouveras tes clés. Pas ce soir, mais un jour.',
  'Le cosmos t’invite à la prudence. Tu déclineras poliment l’invitation.',
  'Chance maximale au baby-foot. Désastre annoncé aux fléchettes.',
  'Ton charisme crève le plafond aujourd’hui. Le plafond, lui, tangue un peu.',
  'Bonne nouvelle : quelqu’un d’autre régalera. Mauvaise : c’est sur l’ardoise.',
  'Tu te feras un ami pour la vie. Enfin… pour environ deux heures précises.',
  'Les étoiles recommandent un grand verre d’eau. Les étoiles sont raisonnables, elles.',
  'Énergie de feu : évite le karaoké ET les briquets.',
  'Jour parfait pour une grande décision. Reporte-la à jeun, on ne sait jamais.',
  'Neptune trouble tes perceptions. Ou alors c’est juste le quatrième demi.',
  'Ton aura sent bon le saucisson aujourd’hui. Assume pleinement.',
  'La roue du destin tourne… comme la pièce de monnaie après le cinquième verre.',
];

// Boisson porte-bonheur du jour.
const BOISSONS = [
  'un demi pression', 'un ballon de rouge', 'un petit jaune', 'un picon-bière',
  'un blanc-cass', 'un Monaco', 'un kir bien frais', 'un calva en douce',
  'une Despé', 'un mauresque', 'une menthe à l’eau (courage)', 'un diabolo grenadine',
  'un perroquet', 'un rhum arrangé maison',
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export interface HoroDuJour {
  texte: string;
  boisson: string;
  chance: number; // « chiffre chance » exprimé en tournées
}

/** Horoscope « du jour » : stable pour un signe sur la journée. */
export function horoscopeDuJour(signe: string): HoroDuJour {
  const jour = new Date().toISOString().slice(0, 10);
  const h = hash(jour + signe);
  return {
    texte: HOROSCOPES[h % HOROSCOPES.length],
    boisson: BOISSONS[(h >> 3) % BOISSONS.length],
    chance: 1 + ((h >> 7) % 7),
  };
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
