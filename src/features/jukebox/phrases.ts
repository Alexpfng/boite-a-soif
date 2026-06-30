// ──────────────────────────────────────────────────────────────────────────
// Répertoire du « Juke-Box à Conneries » — répliques de comptoir bien beauf,
// pilier de bar assumé, que le tavernier déclame d'une voix grave. Bon enfant :
// ça chambre, ça picole, mais ça reste diffusable. Aucun asset : tout en texte.
// ──────────────────────────────────────────────────────────────────────────

/** Une réplique de comptoir prête à être déclamée par le tavernier. */
export interface Phrase {
  /** Identifiant stable (clé React, aria) */
  id: string;
  /** Texte exact lu à voix haute */
  texte: string;
  /** Emoji d'illustration sur le bouton */
  emoji: string;
  /** Famille de réplique (sert à grouper visuellement) */
  categorie: string;
}

// Catégories : « Commande », « Soif », « Ambiance », « Philosophie de comptoir »,
// « Sortie », « Chambrage » (le coin limite-limite, bien beauf).
export const PHRASES: Phrase[] = [
  // ── Commande ──────────────────────────────────────────────────────────
  { id: 'petite-soeur', texte: 'Mets-moi la petite sœur, tavernier !', emoji: '🍺', categorie: 'Commande' },
  { id: 'la-meme-compte', texte: 'Patron, la même — et arrête de compter, on n’est pas à la messe !', emoji: '🍺', categorie: 'Commande' },
  { id: 'tournee-ardoise', texte: 'Allez, c’est ma tournée ! … tu notes sur l’ardoise, hein ?', emoji: '🧾', categorie: 'Commande' },
  { id: 'canon-de-rouge', texte: 'Un canon de rouge, et fais péter le bon, pas la piquette !', emoji: '🍷', categorie: 'Commande' },
  { id: 'un-jaune', texte: 'Un petit jaune bien tassé, s’il te plaît !', emoji: '🟡', categorie: 'Commande' },

  // ── Soif ──────────────────────────────────────────────────────────────
  { id: 'glotte-a-sec', texte: 'J’ai la glotte à sec.', emoji: '🏜️', categorie: 'Soif' },
  { id: 'gosier-en-pente', texte: 'J’ai le gosier en pente, faut bien l’arroser.', emoji: '⛰️', categorie: 'Soif' },
  { id: 'la-pepie', texte: 'J’ai la pépie, là ! Faut éteindre l’incendie.', emoji: '🔥', categorie: 'Soif' },

  // ── Ambiance ──────────────────────────────────────────────────────────
  { id: 'coude-sur-zinc', texte: 'On est pas bien, là ? Le coude sur le zinc, peinards…', emoji: '😎', categorie: 'Ambiance' },
  { id: 'a-la-tienne', texte: 'Allez, tchin ! À la tienne Étienne, à la mienne aussi !', emoji: '🍻', categorie: 'Ambiance' },
  { id: 'biere-espoir', texte: 'Tant qu’y a d’la bière, y a d’l’espoir, mon gars !', emoji: '🍺', categorie: 'Ambiance' },
  { id: 'on-le-trinque', texte: 'Ici, on refait pas le monde… on le trinque !', emoji: '🍷', categorie: 'Ambiance' },

  // ── Philosophie de comptoir ───────────────────────────────────────────
  { id: 'eau-rouille', texte: 'L’eau, ça rouille les tuyaux ! Le coup de rouge, ça les entretient.', emoji: '🍷', categorie: 'Philosophie de comptoir' },
  { id: 'apero-sacre', texte: 'Le travail c’est la santé… mais l’apéro, c’est sacré.', emoji: '⛪', categorie: 'Philosophie de comptoir' },
  { id: 'verre-a-moitie', texte: 'Le verre, je le vois toujours à moitié plein. Faut juste le remplir.', emoji: '🥛', categorie: 'Philosophie de comptoir' },

  // ── Sortie ────────────────────────────────────────────────────────────
  { id: 'der-des-der', texte: 'Allez, la der des der ! … la vraie, cette fois.', emoji: '🍷', categorie: 'Sortie' },
  { id: 'madame-recherches', texte: 'Bon, j’me sauve avant que madame envoie les recherches.', emoji: '📞', categorie: 'Sortie' },
  { id: 'rentre-a-pied', texte: 'Je rentre à pied, hein — la bagnole, elle cuve au parking.', emoji: '🚶', categorie: 'Sortie' },

  // ── Commande (rab) ────────────────────────────────────────────────────
  { id: 'double-triple', texte: 'Patron, un double ! Non, un triple — j’ai eu une dure journée.', emoji: '🥃', categorie: 'Commande' },
  { id: 'decolle-moquette', texte: 'Sers-moi un truc qui décolle la moquette !', emoji: '🚀', categorie: 'Commande' },
  { id: 'soif-pas-faim', texte: 'J’ai pas faim, mais alors soif… qu’est-ce que j’ai soif !', emoji: '🍺', categorie: 'Commande' },

  // ── Soif (rab) ────────────────────────────────────────────────────────
  { id: 'probleme-sans', texte: 'J’ai pas un problème avec l’alcool : j’ai un problème SANS.', emoji: '🚱', categorie: 'Soif' },
  { id: 'cactus-langue', texte: 'J’ai la langue qui colle au palais, ça pousse le cactus !', emoji: '🌵', categorie: 'Soif' },

  // ── Ambiance (rab) ────────────────────────────────────────────────────
  { id: 'cul-sec-vaisselle', texte: 'Celui qui repose son verre fait la vaisselle ! Cul sec !', emoji: '🍺', categorie: 'Ambiance' },
  { id: 'quatre-pattes', texte: 'Ce soir on rentre à quatre pattes, mais on rentre dignes !', emoji: '🐕', categorie: 'Ambiance' },
  { id: 'derniere-minute', texte: 'La dernière ! … minute, chez moi elle dure trois heures.', emoji: '⏰', categorie: 'Ambiance' },

  // ── Philosophie de comptoir (rab) ─────────────────────────────────────
  { id: 'lui-me-tient', texte: 'J’tiens pas l’alcool… c’est lui qui me tient, le bougre.', emoji: '🤷', categorie: 'Philosophie de comptoir' },
  { id: 'change-toubib', texte: 'Mon toubib m’a dit d’arrêter. J’ai changé de toubib.', emoji: '🩺', categorie: 'Philosophie de comptoir' },
  { id: 'biere-soupe', texte: 'Le houblon, c’est un légume. Donc la bière, c’est une soupe.', emoji: '🥬', categorie: 'Philosophie de comptoir' },

  // ── Chambrage (le coin limite-limite) ─────────────────────────────────
  { id: 'tete-tournee', texte: 'Toi, t’as une bonne tête… à payer la prochaine tournée.', emoji: '😏', categorie: 'Chambrage' },
  { id: 'tue-microbes', texte: 'L’alcool tue les microbes… et accessoirement ta timidité.', emoji: '🦠', categorie: 'Chambrage' },
  { id: 'femme-ou-apero', texte: 'Elle m’a dit « c’est l’apéro ou moi ». Elle va me manquer.', emoji: '💔', categorie: 'Chambrage' },
  { id: 'regime-demain', texte: 'Régime sec demain. Comme hier. Comme tous les demains.', emoji: '📅', categorie: 'Chambrage' },
  { id: 'beaux-yeux-flou', texte: 'T’as de beaux yeux, tu sais… enfin j’crois, t’es tout flou.', emoji: '😵‍💫', categorie: 'Chambrage' },
  { id: 'belle-maman', texte: 'Belle-maman débarque ce week-end : patron, garde la bouteille !', emoji: '👹', categorie: 'Chambrage' },
];
