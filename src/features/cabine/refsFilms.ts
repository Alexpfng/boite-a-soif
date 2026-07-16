// ──────────────────────────────────────────────────────────────────────────
// Le Jeu des Réfs — on affiche le DÉBUT d'une réplique culte, les joueurs la
// finissent à voix haute, puis on révèle la suite + la source. Deux familles :
//  • 🎬 Films  : cinéma français grand public.
//  • 📱 Internet : punchlines virales (télé-réalité, YouTube, TikTok, mèmes).
// Sélection volontairement ULTRA connue : finissable par tout le monde.
// ──────────────────────────────────────────────────────────────────────────

export type CatRef = "film" | "net";

export interface Ref {
  debut: string; // amorce affichée
  fin: string; // suite révélée
  film: string; // source (film ou origine internet)
  cat: CatRef;
}

type Amorce = Omit<Ref, "cat">;

// ── 🎬 Cinéma français ──
const FILMS: Amorce[] = [
  { debut: "Les cons, ça ose tout…", fin: "c'est même à ça qu'on les reconnaît.", film: "Les Tontons flingueurs" },
  { debut: "Faut reconnaître…", fin: "c'est du brutal !", film: "Les Tontons flingueurs" },
  { debut: "Elle est où la poulette ?", fin: "Elle est là, la poulette !", film: "OSS 117 : Rio ne répond plus" },
  { debut: "Mais oui, elle est belle…", fin: "la vie !", film: "OSS 117 : Le Caire, nid d'espions" },
  { debut: "Il s'appelle Juste Leblanc.", fin: "— Ah bon, il a pas de prénom ?", film: "Le Dîner de cons" },
  { debut: "Pas de bras…", fin: "pas de chocolat.", film: "Intouchables" },
  { debut: "Que trépasse…", fin: "si je faiblis !", film: "Les Visiteurs" },
  { debut: "Mais où est donc passé…", fin: "le sanglier ?", film: "Les Visiteurs" },
  { debut: "C'est…", fin: "cendré !", film: "Les Visiteurs" },
  { debut: "C'est pas…", fin: "faux !", film: "Kaamelott" },
  { debut: "On en a…", fin: "gros !", film: "Kaamelott" },
  { debut: "Jusqu'ici…", fin: "tout va bien.", film: "La Haine" },
  { debut: "L'important, c'est pas la chute…", fin: "c'est l'atterrissage.", film: "La Haine" },
  { debut: "Je te…", fin: "casse.", film: "Brice de Nice" },
  { debut: "T'as le bon son…", fin: "mais t'as pas la vague.", film: "Brice de Nice" },
  { debut: "Je ne pense qu'à ça…", fin: "mais je n'y arrive pas.", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Alors, il est frais…", fin: "mon poisson ?", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Attends, je vais t'expliquer un truc…", fin: "deux minutes.", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Ils sont fous…", fin: "ces Romains !", film: "Astérix" },
  { debut: "Par…", fin: "Toutatis !", film: "Astérix" },
  { debut: "Bah, j'ai glissé…", fin: "chef !", film: "La Cité de la peur" },
  { debut: "Encore ? Mais il est…", fin: "déjà venu là !", film: "La Cité de la peur" },
  { debut: "Quand un étranger vient dans le Nord, il pleure deux fois :", fin: "quand il arrive, et quand il repart.", film: "Bienvenue chez les Ch'tis" },
  { debut: "Monde de…", fin: "merde !", film: "La Classe américaine" },
  { debut: "Je dis ça…", fin: "je dis rien.", film: "La Classe américaine" },
  { debut: "C'est ça, oui…", fin: "et mon cul c'est du poulet.", film: "Le Père Noël est une ordure" },
  { debut: "Je vous ai apporté…", fin: "des Doubitchous.", film: "Le Père Noël est une ordure" },
  { debut: "T'as d'beaux yeux…", fin: "tu sais.", film: "Le Quai des brumes" },
  { debut: "C'est un roc ! C'est un pic !", fin: "C'est un cap ! Que dis-je, c'est un cap ? C'est une péninsule !", film: "Cyrano de Bergerac" },
  { debut: "Les temps sont durs…", fin: "pour les rêveurs.", film: "Le Fabuleux Destin d'Amélie Poulain" },
  { debut: "Nan mais c'est du lourd…", fin: "du très lourd !", film: "Les Tuche" },
  { debut: "On n'est pas…", fin: "des bœufs !", film: "La Vérité si je mens !" },
  { debut: "Claude, ça…", fin: "suffit !", film: "Qu'est-ce qu'on a fait au Bon Dieu ?" },
  { debut: "Bienvenue chez les…", fin: "Ch'tis !", film: "Bienvenue chez les Ch'tis" },
  { debut: "Ho, hé, hein…", fin: "bon !", film: "Les Aventures de Rabbi Jacob (de Funès)" },
];

// ── 📱 Internet : télé-réalité, YouTube, TikTok, mèmes ──
const NET: Amorce[] = [
  { debut: "Non mais allô quoi,", fin: "t'es une fille et t'as pas de shampoing ?!", film: "Nabilla (télé-réalité)" },
  { debut: "Tu me touches, je t'empoisonne…", fin: "j'ai des compétences en chimie !", film: "Vidéo virale" },
  { debut: "On va au Quick,", fin: "j'ai envie d'un burger !", film: "Vidéo virale" },
  { debut: "C'est…", fin: "mon choix !", film: "« C'est mon choix » (Évelyne Thomas)" },
  { debut: "Alors…", fin: "Teddy ?!", film: "Koh-Lanta (Denis Brogniart, mème)" },
  { debut: "Salut à toutes et à tous,", fin: "j'espère que vous allez bien !", film: "Cliché intro YouTube" },
  { debut: "Pensez à mettre un petit like…", fin: "et à vous abonner à la chaîne !", film: "Cliché fin de vidéo YouTube" },
  { debut: "Ça part en…", fin: "cacahuète !", film: "Expression internet" },
  { debut: "Je suis à Miami…", fin: "bébé !", film: "Nabilla (télé-réalité)" },
  { debut: "Wesh…", fin: "alors ?!", film: "Mème internet" },
  { debut: "Oh Djadja,", fin: "y'a pas moyen Djadja !", film: "Aya Nakamura – Djadja" },
  { debut: "Balance ton…", fin: "quoi !", film: "Angèle – Balance ton quoi" },
  { debut: "Frérot, wallah…", fin: "j'te jure sur la tête de ma mère !", film: "Mème internet" },
  { debut: "Bon bah là…", fin: "je vais y aller.", film: "Mème / vidéo virale" },
];

export const REFS: Ref[] = [
  ...FILMS.map((r) => ({ ...r, cat: "film" as const })),
  ...NET.map((r) => ({ ...r, cat: "net" as const })),
];
