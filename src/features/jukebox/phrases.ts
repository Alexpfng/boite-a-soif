// ──────────────────────────────────────────────────────────────────────────
// Répertoire du « Juke-Box à Conneries » — répliques de comptoir bon enfant
// que le tavernier déclame d'une voix grave. Aucun asset : tout est en texte.
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

// Catégories utilisées : « Commande », « Soif », « Ambiance »,
// « Philosophie de comptoir », « Sortie ». On reste taquin mais bon enfant.
export const PHRASES: Phrase[] = [
  // ── Commande ──────────────────────────────────────────────────────────
  { id: 'petite-soeur', texte: 'Mets-moi la petite sœur, tavernier !', emoji: '🍺', categorie: 'Commande' },
  { id: 'la-meme-chose', texte: 'Patron, la même chose !', emoji: '🔁', categorie: 'Commande' },
  { id: 'tournee-generale', texte: 'Tournée générale, c’est ma tournée !', emoji: '🍻', categorie: 'Commande' },
  { id: 'remets-ca', texte: 'Allez, remets-nous ça, on est entre nous.', emoji: '🥃', categorie: 'Commande' },
  { id: 'un-jaune', texte: 'Un petit jaune bien tassé, s’il te plaît !', emoji: '🟡', categorie: 'Commande' },

  // ── Soif ──────────────────────────────────────────────────────────────
  { id: 'glotte-a-sec', texte: 'J’ai la glotte à sec.', emoji: '🏜️', categorie: 'Soif' },
  { id: 'gosier-en-pente', texte: 'J’ai le gosier en pente, faut bien l’arroser.', emoji: '⛰️', categorie: 'Soif' },
  { id: 'soif-de-chameau', texte: 'J’ai une soif de chameau, moi !', emoji: '🐪', categorie: 'Soif' },

  // ── Ambiance ──────────────────────────────────────────────────────────
  { id: 'plus-on-est-fous', texte: 'Plus on est de fous, plus on rit !', emoji: '😂', categorie: 'Ambiance' },
  { id: 'on-est-bien-la', texte: 'On est bien là, hein, on est bien.', emoji: '😌', categorie: 'Ambiance' },
  { id: 'sante-les-amis', texte: 'Santé les amis, et que ça dure !', emoji: '🥂', categorie: 'Ambiance' },
  { id: 'chanson-au-comptoir', texte: 'Allez, on pousse la chansonnette !', emoji: '🎶', categorie: 'Ambiance' },

  // ── Philosophie de comptoir ───────────────────────────────────────────
  { id: 'refaire-le-monde', texte: 'De toute façon, c’est au comptoir qu’on refait le monde.', emoji: '🌍', categorie: 'Philosophie de comptoir' },
  { id: 'qui-boit-vivra', texte: 'Qui a bu boira, qui a soif rigole.', emoji: '🤔', categorie: 'Philosophie de comptoir' },
  { id: 'verre-a-moitie', texte: 'Le verre, je le vois toujours à moitié plein. Faut juste le remplir.', emoji: '🥛', categorie: 'Philosophie de comptoir' },

  // ── Sortie ────────────────────────────────────────────────────────────
  { id: 'les-gogues', texte: 'Où sont les gogues ?', emoji: '🚻', categorie: 'Sortie' },
  { id: 'derniere-pour-la-route', texte: 'Allez, la dernière pour la route… à pied, hein !', emoji: '🚶', categorie: 'Sortie' },
  { id: 'a-la-revoyure', texte: 'Bon, j’y vais. À la revoyure, la compagnie !', emoji: '👋', categorie: 'Sortie' },
];
