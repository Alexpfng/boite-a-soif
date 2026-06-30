// Encodage / décodage de la carte « Je suis aphasique » dans une URL
// (page publique /c#<données>), pour le partage par QR code.
// Les données voyagent dans le fragment (#) : elles ne sont jamais envoyées
// au serveur.

export interface CartePartagee {
  nom: string;
  prenom: string;
  confiance: string;
  tel: string;
}

export function encoderCarte(c: CartePartagee): string {
  const json = JSON.stringify([c.nom, c.prenom, c.confiance, c.tel]);
  // UTF-8 → base64url
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decoderCarte(fragment: string): CartePartagee | null {
  try {
    const b64 = fragment.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b64)));
    const [nom, prenom, confiance, tel] = JSON.parse(json) as string[];
    return { nom: nom ?? '', prenom: prenom ?? '', confiance: confiance ?? '', tel: tel ?? '' };
  } catch {
    return null;
  }
}
