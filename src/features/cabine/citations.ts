// « Citations d'Ivrognes » — la sagesse (très relative) du comptoir.
// Mélange de citations célèbres (souvent attribuées…) et de pure philosophie de zinc.

export interface Citation {
  texte: string;
  auteur: string;
}

export const CITATIONS: Citation[] = [
  { texte: 'L’alcool ne résout aucun problème. Cela dit, l’eau et le lait non plus.', auteur: 'Anonyme' },
  { texte: 'J’ai beaucoup pris à l’alcool. Mais l’alcool m’a pris davantage.', auteur: 'Winston Churchill (paraît-il)' },
  { texte: 'Le vin est la plus saine et la plus hygiénique des boissons.', auteur: 'Louis Pasteur' },
  { texte: 'Un repas sans vin, c’est une journée sans soleil.', auteur: 'Proverbe' },
  { texte: 'Je ne bois jamais d’eau : les poissons font l’amour dedans.', auteur: 'W. C. Fields (attribué)' },
  { texte: 'L’abus d’alcool est dangereux. Donc il ne faut pas en abuser — juste en boire beaucoup.', auteur: 'Esprit de comptoir' },
  { texte: 'Quand on n’a pas ce que l’on aime, il faut boire ce que l’on a.', auteur: 'Sagesse de zinc' },
  { texte: 'Il y a plus de vieux ivrognes que de vieux médecins.', auteur: 'Proverbe' },
  { texte: 'Le premier verre, c’est pour la soif. Les suivants, c’est par politesse.', auteur: 'Tonton Robert' },
  { texte: 'Boire ou conduire, il faut choisir. J’ai choisi : je reste au bar.', auteur: 'Le pilier du fond' },
  { texte: 'La modération est une chose excellente. Surtout celle des autres.', auteur: 'Sagesse de comptoir' },
  { texte: 'Il vaut mieux être saoul que con : au moins, ça finit par passer.', auteur: 'Anonyme' },
  { texte: 'Le vin, c’est la lumière du soleil tenue ensemble par l’eau.', auteur: 'Galilée (attribué)' },
  { texte: 'Un homme qui se noie dans le vin meurt rarement de soif.', auteur: 'Sagesse de zinc' },
  { texte: 'Rien ne sert de boire : il faut trinquer à point.', auteur: 'La Fontaine, revisité' },
  { texte: 'On ne devient pas pilier de comptoir. On naît avec la soif.', auteur: 'Tonton Robert' },
  { texte: 'Le travail, c’est la santé. Ne rien faire, c’est la conserver. Et boire, c’est la fêter.', auteur: 'Esprit de comptoir' },
  { texte: 'Buvez sans soif, riez sans raison : c’est ça qui nous distingue des bêtes.', auteur: 'D’après Beaumarchais' },
  { texte: 'L’eau ferait rouiller les tuyaux. Le rouge, lui, les entretient.', auteur: 'Le plombier du bar' },
  { texte: 'Mieux vaut un petit verre tout de suite qu’un grand discours plus tard.', auteur: 'Sagesse de comptoir' },
];

export function citationAuHasard(): Citation {
  return CITATIONS[Math.floor(Math.random() * CITATIONS.length)];
}
