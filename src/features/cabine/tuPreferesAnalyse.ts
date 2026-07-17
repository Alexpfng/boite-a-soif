// ──────────────────────────────────────────────────────────────────────────
// « Tu préfères ? » — le TEST de personnalité. Chaque joueur répond à une série
// de dilemmes « diagnostics » ; ses choix positionnent son profil sur 4 axes.
// Analyse sérieuse (pas une vanne de comptoir) : chaque dilemme est rattaché à
// un axe, la réponse A tire vers un pôle, la réponse B vers l'autre.
// ──────────────────────────────────────────────────────────────────────────

export interface AxeDef {
  cle: string;
  gauche: string; // pôle si on répond « A »
  droite: string; // pôle si on répond « B »
  descG: string; // description quand on penche à gauche
  descD: string; // description quand on penche à droite
  equilibre: string;
}

export interface TestDilemme {
  a: string; // choix A → pôle gauche
  b: string; // choix B → pôle droite
  axe: string; // clé de l'axe
}

export const AXES: AxeDef[] = [
  {
    cle: "esprit",
    gauche: "Cérébral",
    droite: "Sensible",
    descG: "Tu décides avec la tête : tu analyses, tu compares, tu tranches à froid.",
    descD: "Tu décides avec le cœur : tu te fies à ton ressenti et à tes émotions.",
    equilibre: "Tu équilibres bien la raison et l'émotion selon les moments.",
  },
  {
    cle: "audace",
    gauche: "Aventurier",
    droite: "Prudent",
    descG: "L'inconnu t'attire plus qu'il ne t'effraie : tu aimes le risque et la nouveauté.",
    descD: "Tu recherches la stabilité : un plan solide vaut mieux qu'un pari incertain.",
    equilibre: "Tu oses quand il le faut, sans jamais oublier d'assurer tes arrières.",
  },
  {
    cle: "social",
    gauche: "Indépendant",
    droite: "Fédérateur",
    descG: "Ta liberté passe avant tout : tu avances à ta façon, en solo.",
    descD: "Tu es tourné vers les autres : tu t'épanouis dans le groupe et le partage.",
    equilibre: "Tu tiens à ton indépendance sans perdre le goût du collectif.",
  },
  {
    cle: "vision",
    gauche: "Idéaliste",
    droite: "Pragmatique",
    descG: "Tu es guidé par tes rêves et tes valeurs, quitte à sacrifier un peu de confort.",
    descD: "Tu gardes les pieds sur terre : tu vises le concret et l'efficace.",
    equilibre: "Tu rêves grand tout en restant réaliste.",
  },
];

export const TEST: TestDilemme[] = [
  // esprit (tête ↔ cœur)
  { axe: "esprit", a: "Prendre une grande décision en pesant froidement le pour et le contre", b: "La prendre à l'instinct, au feeling" },
  { axe: "esprit", a: "Dire une vérité utile même si elle blesse", b: "Ménager les sentiments quitte à arrondir la vérité" },
  { axe: "esprit", a: "Garder la tête froide dans une crise", b: "Te laisser porter par tes émotions" },
  { axe: "esprit", a: "Juger quelqu'un sur les faits", b: "Juger quelqu'un sur ton ressenti" },
  // audace (risque ↔ sécurité)
  { axe: "audace", a: "Tout plaquer pour un projet un peu fou", b: "Assurer une vie stable et tranquille" },
  { axe: "audace", a: "Tenter une expérience totalement inconnue", b: "Rester sur ce que tu maîtrises déjà" },
  { axe: "audace", a: "Un imprévu excitant", b: "Un programme carré et rassurant" },
  { axe: "audace", a: "Miser gros pour une grosse récompense", b: "Sécuriser un petit gain garanti" },
  // social (solo ↔ collectif)
  { axe: "social", a: "Réussir seul, à ta manière", b: "Réussir en équipe, ensemble" },
  { axe: "social", a: "Une soirée tranquille en solo", b: "Une grande fête entouré de monde" },
  { axe: "social", a: "Défendre ta liberté personnelle avant tout", b: "Te mettre en retrait pour le bien du groupe" },
  { axe: "social", a: "Suivre ton propre chemin", b: "Suivre celui qui rassemble les gens" },
  // vision (idéal ↔ concret)
  { axe: "vision", a: "Poursuivre un rêve sans aucune garantie", b: "Choisir la sécurité matérielle" },
  { axe: "vision", a: "Un métier passionnant mais mal payé", b: "Un métier ennuyeux mais très bien payé" },
  { axe: "vision", a: "Vivre pour des idées et des valeurs", b: "Vivre pour des résultats concrets" },
  { axe: "vision", a: "Changer le monde", b: "Améliorer ton quotidien" },
];

export interface AxeResultat {
  cle: string;
  gauche: string;
  droite: string;
  net: number; // >0 penche vers « gauche », <0 vers « droite »
  total: number; // nombre de questions de l'axe répondues
  pole: string; // pôle dominant (ou « Équilibré »)
  phrase: string;
}

export interface Analyse {
  titre: string;
  resume: string;
  axes: AxeResultat[];
}

/** Analyse les réponses d'un joueur (alignées sur l'ordre de TEST). */
export function analyser(reponses: ("a" | "b")[]): Analyse {
  const axes: AxeResultat[] = AXES.map((ax) => {
    let net = 0;
    let total = 0;
    TEST.forEach((d, i) => {
      if (d.axe !== ax.cle) return;
      const r = reponses[i];
      if (r === "a") { net += 1; total += 1; }
      else if (r === "b") { net -= 1; total += 1; }
    });
    const pole = net > 0 ? ax.gauche : net < 0 ? ax.droite : "Équilibré";
    const phrase = net > 0 ? ax.descG : net < 0 ? ax.descD : ax.equilibre;
    return { cle: ax.cle, gauche: ax.gauche, droite: ax.droite, net, total, pole, phrase };
  });

  const forts = axes.filter((r) => r.net !== 0).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));

  let titre: string;
  let resume: string;
  if (forts.length === 0) {
    titre = "Le Caméléon";
    resume = "Tu navigues entre tous les profils, sans jamais te laisser enfermer dans une case. Difficile à cerner… et c'est une vraie force.";
  } else if (forts.length === 1) {
    titre = `L'esprit ${forts[0].pole}`;
    resume = forts[0].phrase;
  } else {
    titre = `${forts[0].pole} & ${forts[1].pole.toLowerCase()}`;
    resume = `${forts[0].phrase} ${forts[1].phrase}`;
  }

  return { titre, resume, axes };
}
