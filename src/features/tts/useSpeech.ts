import { useCallback, useEffect, useRef, useState } from 'react';

// Lecture vocale via Web Speech API, voix fr-FR, vitesse 0,9.
// Gère lecture / pause / reprise / arrêt et signale le bloc en cours via onBloc.

export type EtatLecture = 'inactif' | 'lecture' | 'pause';

export function useSpeech() {
  const [etat, setEtat] = useState<EtatLecture>('inactif');
  const [blocEnCours, setBlocEnCours] = useState<number | null>(null);
  const fileRef = useRef<SpeechSynthesisUtterance[]>([]);
  const disponible = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!disponible) return;
    fileRef.current = [];
    window.speechSynthesis.cancel();
    setEtat('inactif');
    setBlocEnCours(null);
  }, [disponible]);

  // Arrêt de la lecture quand on quitte la page
  useEffect(() => stop, [stop]);

  const choisirVoix = () => {
    const voix = window.speechSynthesis.getVoices();
    return voix.find((v) => v.lang === 'fr-FR') ?? voix.find((v) => v.lang.startsWith('fr')) ?? null;
  };

  /** Lit une suite de blocs de texte ; index passé à setBlocEnCours pour le surlignage. */
  const lire = useCallback(
    (blocs: string[]) => {
      if (!disponible || blocs.length === 0) return;
      window.speechSynthesis.cancel();
      const voix = choisirVoix();
      fileRef.current = blocs.map((texte, i) => {
        const u = new SpeechSynthesisUtterance(texte);
        u.lang = 'fr-FR';
        u.rate = 0.9;
        if (voix) u.voice = voix;
        u.onstart = () => setBlocEnCours(i);
        u.onend = () => {
          if (i === blocs.length - 1) {
            setEtat('inactif');
            setBlocEnCours(null);
          }
        };
        return u;
      });
      fileRef.current.forEach((u) => window.speechSynthesis.speak(u));
      setEtat('lecture');
    },
    [disponible]
  );

  const pause = useCallback(() => {
    if (!disponible) return;
    window.speechSynthesis.pause();
    setEtat('pause');
  }, [disponible]);

  const reprendre = useCallback(() => {
    if (!disponible) return;
    window.speechSynthesis.resume();
    setEtat('lecture');
  }, [disponible]);

  return { disponible, etat, blocEnCours, lire, pause, reprendre, stop };
}

/** Prononce une phrase isolée (outils interactifs : OUI, NON, parties du corps…). */
export function prononcer(texte: string, rate = 0.9) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = 'fr-FR';
  u.rate = rate;
  const voix = window.speechSynthesis.getVoices();
  const fr = voix.find((v) => v.lang === 'fr-FR') ?? voix.find((v) => v.lang.startsWith('fr'));
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}
