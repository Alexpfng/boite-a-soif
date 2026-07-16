// ──────────────────────────────────────────────────────────────────────────
// Le Jeu des Réfs — répliques cultes du cinéma français. On affiche le DÉBUT
// de la réplique, les joueurs la finissent à voix haute, puis on révèle la
// suite + le film. Party game de comptoir, mémoire de beauf assumée.
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
  { debut: "J'ai connu une Polonaise qu'en prenait…", fin: "au petit déjeuner.", film: "Les Tontons flingueurs" },

  // OSS 117
  { debut: "Mais oui, elle est belle…", fin: "la vie, hein ?", film: "OSS 117 : Le Caire, nid d'espions" },
  { debut: "Elle est où la poulette ?", fin: "Elle est là, la poulette !", film: "OSS 117 : Rio ne répond plus" },
  { debut: "Bonjour, je m'appelle Hubert…", fin: "Bonisseur de La Bath.", film: "OSS 117 : Le Caire, nid d'espions" },

  // Le Dîner de cons
  { debut: "Il s'appelle Juste Leblanc.", fin: "— Ah bon, il a pas de prénom ?", film: "Le Dîner de cons" },
  { debut: "Ce soir, j'ai…", fin: "un dîner de cons.", film: "Le Dîner de cons" },

  // Intouchables
  { debut: "Pas de bras…", fin: "pas de chocolat.", film: "Intouchables" },

  // Les Visiteurs
  { debut: "Que trépasse…", fin: "si je faiblis !", film: "Les Visiteurs" },
  { debut: "Mais où est donc passé…", fin: "le sanglier ?", film: "Les Visiteurs" },
  { debut: "Il pue, il pue…", fin: "le manant !", film: "Les Visiteurs" },
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
  { debut: "Attends, je vais t'expliquer un truc…", fin: "deux minutes.", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Alors, il est frais…", fin: "mon poisson ?", film: "Astérix & Obélix : Mission Cléopâtre" },
  { debut: "Ce goûteur me sert à…", fin: "goûter les plats.", film: "Astérix & Obélix : Mission Cléopâtre" },

  // La Cité de la peur
  { debut: "Bah, j'ai glissé…", fin: "chef !", film: "La Cité de la peur" },
  { debut: "Encore ? Mais il est…", fin: "déjà venu là !", film: "La Cité de la peur" },
  { debut: "Je m'appelle…", fin: "Serge Karamazov.", film: "La Cité de la peur" },

  // Bienvenue chez les Ch'tis
  { debut: "Quand un étranger vient dans le Nord, il pleure deux fois :", fin: "quand il arrive, et quand il repart.", film: "Bienvenue chez les Ch'tis" },

  // La Classe américaine
  { debut: "Monde de…", fin: "merde !", film: "La Classe américaine" },
  { debut: "Je dis ça…", fin: "je dis rien.", film: "La Classe américaine" },
  { debut: "Il faut…", fin: "positiver.", film: "La Classe américaine" },

  // Le Père Noël est une ordure
  { debut: "C'est ça, oui…", fin: "et mon cul c'est du poulet.", film: "Le Père Noël est une ordure" },
  { debut: "Tu peux pas t'empêcher…", fin: "de tout salir, toi, hein ?", film: "Le Père Noël est une ordure" },
  { debut: "Je vous ai apporté…", fin: "des Doubitchous.", film: "Le Père Noël est une ordure" },
  { debut: "Elle est bonne, hein ?", fin: "— Elle est pas bonne, elle est dégueulasse.", film: "Le Père Noël est une ordure" },

  // Camping
  { debut: "Le camping des…", fin: "Flots Bleus.", film: "Camping" },
  { debut: "Tu vas voir que tu vas la fermer…", fin: "ta petite boîte à camembert.", film: "Camping" },

  // Les Bronzés
  { debut: "Quand te reverrai-je…", fin: "pays merveilleux ?", film: "Les Bronzés" },
  { debut: "Je sens que je vais mettre du temps…", fin: "à me réchauffer.", film: "Les Bronzés font du ski" },
  { debut: "On va se le faire…", fin: "le sommet !", film: "Les Bronzés font du ski" },

  // Rabbi Jacob
  { debut: "Ho, hé, hein…", fin: "bon !", film: "Les Aventures de Rabbi Jacob" },

  // La Grande Vadrouille
  { debut: "Big…", fin: "Moustache !", film: "La Grande Vadrouille" },

  // Le Quai des brumes
  { debut: "T'as d'beaux yeux…", fin: "tu sais.", film: "Le Quai des brumes" },

  // Cyrano de Bergerac
  { debut: "C'est un roc ! C'est un pic !", fin: "C'est un cap ! Que dis-je, c'est un cap ? C'est une péninsule !", film: "Cyrano de Bergerac" },
  { debut: "Non…", fin: "merci.", film: "Cyrano de Bergerac" },

  // Amélie Poulain
  { debut: "Les temps sont durs…", fin: "pour les rêveurs.", film: "Le Fabuleux Destin d'Amélie Poulain" },
  { debut: "Même un artichaut…", fin: "a du cœur.", film: "Le Fabuleux Destin d'Amélie Poulain" },

  // La Vérité si je mens !
  { debut: "On n'est pas…", fin: "des bœufs !", film: "La Vérité si je mens !" },
  { debut: "Tu sais combien je l'ai payé…", fin: "ce blouson ?", film: "La Vérité si je mens !" },

  // Les Tuche
  { debut: "Nan mais c'est du lourd…", fin: "du très lourd !", film: "Les Tuche" },

  // Qu'est-ce qu'on a fait au Bon Dieu ?
  { debut: "Claude, ça…", fin: "suffit !", film: "Qu'est-ce qu'on a fait au Bon Dieu ?" },

  // La Soupe aux choux
  { debut: "Le…", fin: "Denrée !", film: "La Soupe aux choux" },

  // Le Corniaud
  { debut: "Elle va marcher…", fin: "elle va marcher !", film: "Le Corniaud" },

  // La Chèvre / Les Compères (Pierre Richard)
  { debut: "J'ai un mauvais…", fin: "pressentiment.", film: "La Chèvre" },

  // Le Gendarme de Saint-Tropez
  { debut: "Je vais vous dire…", fin: "une bonne chose.", film: "Le Gendarme de Saint-Tropez" },

  // Podium
  { debut: "Bernard Frédéric…", fin: "sosie de Claude François !", film: "Podium" },

  // La Grande bouffe / classiques du zinc
  { debut: "Un petit blanc…", fin: "ça n'a jamais fait de mal à personne.", film: "réplique de comptoir (esprit ciné français)" },

  // Taxi
  { debut: "Elle envoie du lourd…", fin: "ma caisse !", film: "Taxi" },

  // Les Ripoux
  { debut: "Ripoux mais…", fin: "réglos.", film: "Les Ripoux" },
];
