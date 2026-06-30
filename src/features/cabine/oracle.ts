// « Demande au patron » — l'oracle de comptoir : une boule magique version
// troquet. La question importe peu, le patron répond ce qu'il veut. Bon enfant.

export const REPONSES_PATRON: string[] = [
  'Mon grand, la réponse est au fond du verre. Faut le finir.',
  'C’est oui. Enfin… après une autre tournée, on en reparle.',
  'Non. Et c’est ta tournée, tant qu’on y est.',
  'Demande à ta belle-mère, moi j’ai pas que ça à faire.',
  'Écoute, à cette heure-ci, tout est possible.',
  'Clairement non. Mais bois un coup, ça passera.',
  'Les astres disent oui. Le percolateur dit non.',
  'Reviens me voir quand t’auras un peu dessoûlé.',
  'C’est comme le beaujolais nouveau : ça dépend de l’année.',
  'Oui, mille fois oui ! …redemande demain pour être sûr.',
  'Je dirais ni oui ni non, bien au contraire.',
  'Fais comme moi : laisse tomber et remets-nous ça.',
  'Le patron a toujours raison. Donc : non.',
  'C’est écrit dans la mousse… et la mousse est retombée.',
  'Absolument. À condition que ce soit toi qui régales.',
  'Tant que t’as soif, t’as tort. Bois d’abord, on cause après.',
  'Oui — si t’arrives à dire « les chaussettes de l’archiduchesse ».',
  'Non. Et arrête de fixer le percolateur, il te juge pas.',
  'Le destin est formel : encore un petit jaune.',
  'Mmh… un grand peut-être, qui penche vers le rouge. Le vin, hein.',
  'Évidemment. Comme dirait Dédé : « ahah, ouais ».',
  'La maison répond pas à ça. La maison sert à boire.',
  'C’est tout vu : demande à quelqu’un de sobre. Bon courage.',
  'Oui, oui, oui. …bon, peut-être non. J’ai oublié la question.',
];

export function reponsePatron(): string {
  return REPONSES_PATRON[Math.floor(Math.random() * REPONSES_PATRON.length)];
}
