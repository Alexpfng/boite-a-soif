// ──────────────────────────────────────────────────────────────────────────
// Le Jeu des Réfs — le TITRE du film est affiché comme indice, on montre le
// DÉBUT de la réplique, les joueurs la finissent à voix haute, puis on révèle
// la fin. Que du BLOCKBUSTER ultra-connu (surtout international, en VF) pour que
// tout le monde puisse jouer. + quelques punchlines internet vraiment mythiques.
// ──────────────────────────────────────────────────────────────────────────

export type CatRef = "film" | "net";

export interface Ref {
  debut: string; // amorce affichée
  fin: string; // suite révélée
  film: string; // TITRE (affiché comme indice)
  cat: CatRef;
}

type Amorce = Omit<Ref, "cat">;

// ── 🎬 Films (le titre sert d'indice) ──
const FILMS: Amorce[] = [
  { film: "Titanic", debut: "Je suis le roi…", fin: "du monde !" },
  { film: "Star Wars", debut: "Non… je suis…", fin: "ton père." },
  { film: "Star Wars", debut: "Que la Force…", fin: "soit avec toi." },
  { film: "Terminator", debut: "Je…", fin: "reviendrai." },
  { film: "Le Roi Lion", debut: "Hakuna…", fin: "Matata !" },
  { film: "Le Roi Lion", debut: "Tout ce que la lumière touche…", fin: "est notre royaume." },
  { film: "Forrest Gump", debut: "La vie, c'est comme une boîte de chocolats :", fin: "on ne sait jamais sur quoi on va tomber." },
  { film: "Forrest Gump", debut: "Cours, Forrest…", fin: "cours !" },
  { film: "Le Parrain", debut: "Je vais lui faire une offre…", fin: "qu'il ne pourra pas refuser." },
  { film: "E.T. l'extra-terrestre", debut: "E.T. téléphone…", fin: "maison." },
  { film: "Matrix", debut: "La pilule rouge…", fin: "ou la pilule bleue ?" },
  { film: "Retour vers le futur", debut: "Là où on va…", fin: "on n'a pas besoin de routes." },
  { film: "Le Sixième Sens", debut: "Je vois…", fin: "les morts." },
  { film: "Le Seigneur des Anneaux", debut: "Vous ne…", fin: "passerez pas !" },
  { film: "Le Seigneur des Anneaux", debut: "Un anneau pour les gouverner…", fin: "tous." },
  { film: "Harry Potter", debut: "Tu es un sorcier…", fin: "Harry." },
  { film: "Pirates des Caraïbes", debut: "Capitaine…", fin: "Jack Sparrow." },
  { film: "Toy Story", debut: "Vers l'infini…", fin: "et au-delà !" },
  { film: "La Reine des Neiges", debut: "Libérée…", fin: "délivrée !" },
  { film: "Shrek", debut: "Les ogres, c'est comme les oignons :", fin: "ça a des couches." },
  { film: "Avengers: Endgame", debut: "Je t'aime…", fin: "3000." },
  { film: "Jurassic Park", debut: "La vie trouve toujours…", fin: "un chemin." },
  { film: "Apollo 13", debut: "Houston…", fin: "on a un problème." },
  { film: "James Bond", debut: "Mon nom est Bond…", fin: "James Bond." },
  { film: "Dirty Dancing", debut: "On ne laisse pas Bébé…", fin: "dans un coin." },
  { film: "Scarface", debut: "Dis bonjour à…", fin: "mon petit ami !" },
  { film: "Blanche-Neige", debut: "Miroir, mon beau miroir…", fin: "dis-moi qui est la plus belle." },
  { film: "Gladiator", debut: "À mon signal…", fin: "déchaîne les Enfers." },
  { film: "Fight Club", debut: "La première règle du Fight Club…", fin: "c'est qu'il ne faut pas parler du Fight Club." },
  { film: "Taxi Driver", debut: "C'est à moi…", fin: "que tu parles ?" },
  { film: "Autant en emporte le vent", debut: "Après tout…", fin: "demain est un autre jour." },
  { film: "Le Magicien d'Oz", debut: "Je crois que nous ne sommes plus…", fin: "au Kansas." },
  { film: "300", debut: "Ce soir, nous dînons…", fin: "en enfer !" },
  { film: "Rocky", debut: "Adrian…", fin: "on a réussi !" },
  { film: "Le Cinquième Élément", debut: "Multi…", fin: "pass !" },
  { film: "Men in Black", debut: "Regardez le petit éclair…", fin: "vous ne vous souviendrez de rien." },
  { film: "Star Wars", debut: "C'est un…", fin: "piège !" },
  { film: "L'Empire contre-attaque", debut: "Fais-le, ou ne le fais pas…", fin: "il n'y a pas d'essai." },
  // Quelques classiques FR vraiment universels
  { film: "Intouchables", debut: "Pas de bras…", fin: "pas de chocolat." },
  { film: "OSS 117", debut: "Elle est où la poulette ?", fin: "Elle est là, la poulette !" },
  { film: "La Haine", debut: "Jusqu'ici…", fin: "tout va bien." },
  { film: "Bienvenue chez les Ch'tis", debut: "Bienvenue chez les…", fin: "Ch'tis !" },
  { film: "Le Dîner de cons", debut: "Il s'appelle Juste Leblanc.", fin: "— Ah bon, il a pas de prénom ?" },
  { film: "Kaamelott", debut: "C'est pas…", fin: "faux !" },
  { film: "Astérix & Obélix : Mission Cléopâtre", debut: "Ils sont fous…", fin: "ces Romains !" },
  { film: "La Cité de la peur", debut: "Bah, j'ai glissé…", fin: "chef !" },
];

// ── 📱 Internet : que du mythique ──
const NET: Amorce[] = [
  { film: "Nabilla (télé-réalité)", debut: "Non mais allô quoi,", fin: "t'es une fille et t'as pas de shampoing ?!" },
  { film: "« C'est mon choix » (télé)", debut: "C'est…", fin: "mon choix !" },
  { film: "Koh-Lanta (mème Denis Brogniart)", debut: "Alors…", fin: "Teddy ?!" },
  { film: "Vidéo virale (compétences en chimie)", debut: "Tu me touches, je t'empoisonne…", fin: "j'ai des compétences en chimie !" },
  { film: "Vidéo virale (le Quick)", debut: "On va au Quick,", fin: "j'ai envie d'un burger !" },
  { film: "Cliché d'intro YouTube", debut: "Salut à toutes et à tous,", fin: "j'espère que vous allez bien !" },
  { film: "Cliché de fin de vidéo YouTube", debut: "Pensez à mettre un petit like…", fin: "et à vous abonner !" },
  { film: "Expression internet", debut: "Ça part en…", fin: "cacahuète !" },
];

export const REFS: Ref[] = [
  ...FILMS.map((r) => ({ ...r, cat: "film" as const })),
  ...NET.map((r) => ({ ...r, cat: "net" as const })),
];
