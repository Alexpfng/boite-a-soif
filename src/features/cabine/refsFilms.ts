// ──────────────────────────────────────────────────────────────────────────
// Le Jeu des Réfs — répliques cultes du cinéma français. On affiche le DÉBUT
// de la réplique, les joueurs la finissent à voix haute, puis on révèle la
// suite + le film. Sélection VOLONTAIREMENT grand public : que des répliques
// ultra-connues, finissables par tout le monde autour d'une table.
// ──────────────────────────────────────────────────────────────────────────

export interface Ref {
  debut: string; // amorce affichée
  fin: string; // suite révélée
  film: string;
}

export const REFS: Ref[] = [
  // Les Tontons flingueurs
  { debut: "Les cons, ça ose tout…", fin: "c'est même à ça qu'on les reconnaît.", film: "Les Tontons flingueurs" },
  { debut: "Faut reconnaître…", fin: "c'est du brutal !", film: "Les Tontons flingueurs" },

  // OSS 117
  { debut: "Elle est où la poulette ?", fin: "Elle est là, la poulette !", film: "OSS 117 : Rio ne répond plus" },
  { debut: "Mais oui, elle est belle…", fin: "la vie !", film: "OSS 117 : Le Caire, nid d'espions" },

  // Le Dîner de cons
  { debut: "Il s'appelle Juste Leblanc.", fin: "— Ah bon, il a pas de prénom ?", film: "Le Dîner de cons" },

  // Intouchables
  { debut: "Pas de bras…", fin: "pas de chocolat.", film: "Intouchables" },

  // Les Visiteurs
  { debut: "Que trépasse…", fin: "si je faiblis !", film: "Les Visiteurs" },
  { debut: "Mais où est donc passé…", fin: "le sanglier ?", film: "Les Visiteurs" },
  { debut: "C'est…", fin: "cendré !", film: "Les Visiteurs" },

  // Kaamelott
  { debut: "C'est pas…", fin: "faux !", film: "Kaamelott" },
  { debut: "On en a…", fin: "gros !", film: "Kaamelott" },

  // La Haine
  { debut: "Jusqu'ici…", fin: "tout va bien.", film: "La Haine" },
  { debut: "L'important, c'est pas la chute…", fin: "c'est l'atterrissage.", film: "La Haine" },

  // Brice de Nice
  { debut: "Je te…", fin: "casse.", film: "Brice de Nice" },
  { debut: "T'as le bon son…", fin: "mais t'as pas la vague.", film: "Brice de Nice" },

  // Astérix & Obélix : Mission Cléopâtre
  { debut: "Je ne pense qu'à ça…", fin: "mais je n'y arrive pas.", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Alors, il est frais…", fin: "mon poisson ?", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Attends, je vais t'expliquer un truc…", fin: "deux minutes.", film: "Astérix & Obélix : Mission Cléopâtre" },

  // Astérix (BD & films) — catchphrases
  { debut: "Ils sont fous…", fin: "ces Romains !", film: "Astérix" },
  { debut: "Par…", fin: "Toutatis !", film: "Astérix" },

  // La Cité de la peur
  { debut: "Bah, j'ai glissé…", fin: "chef !", film: "La Cité de la peur" },
  { debut: "Encore ? Mais il est…", fin: "déjà venu là !", film: "La Cité de la peur" },

  // Bienvenue chez les Ch'tis
  { debut: "Quand un étranger vient dans le Nord, il pleure deux fois :", fin: "quand il arrive, et quand il repart.", film: "Bienvenue chez les Ch'tis" },

  // La Classe américaine (répliques passées dans le langage courant)
  { debut: "Monde de…", fin: "merde !", film: "La Classe américaine" },
  { debut: "Je dis ça…", fin: "je dis rien.", film: "La Classe américaine" },

  // Le Père Noël est une ordure
  { debut: "C'est ça, oui…", fin: "et mon cul c'est du poulet.", film: "Le Père Noël est une ordure" },
  { debut: "Je vous ai apporté…", fin: "des Doubitchous.", film: "Le Père Noël est une ordure" },

  // Le Quai des brumes
  { debut: "T'as d'beaux yeux…", fin: "tu sais.", film: "Le Quai des brumes" },

  // Cyrano de Bergerac
  { debut: "C'est un roc ! C'est un pic !", fin: "C'est un cap ! Que dis-je, c'est un cap ? C'est une péninsule !", film: "Cyrano de Bergerac" },

  // Le Fabuleux Destin d'Amélie Poulain
  { debut: "Les temps sont durs…", fin: "pour les rêveurs.", film: "Le Fabuleux Destin d'Amélie Poulain" },

  // Les Tuche
  { debut: "Nan mais c'est du lourd…", fin: "du très lourd !", film: "Les Tuche" },

  // La Vérité si je mens !
  { debut: "On n'est pas…", fin: "des bœufs !", film: "La Vérité si je mens !" },

  // Qu'est-ce qu'on a fait au Bon Dieu ?
  { debut: "Claude, ça…", fin: "suffit !", film: "Qu'est-ce qu'on a fait au Bon Dieu ?" },

  // Bienvenue / Ch'tis — la sonnette
  { debut: "Bienvenue chez les…", fin: "Ch'tis !", film: "Bienvenue chez les Ch'tis" },

  // Le Roi Loth / de Funès — classiques
  { debut: "Ho, hé, hein…", fin: "bon !", film: "Les Aventures de Rabbi Jacob (de Funès)" },
];
