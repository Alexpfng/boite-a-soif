import { useCallback, useEffect, useState } from 'react';
import { lireStockage, ecrireStockage } from '../../lib/storage';

const CLE = 'favoris';
const EVENT = 'aphasaide:favoris';

export type Favori = { id: string; section: string };

function lire(): Favori[] {
  return lireStockage<Favori[]>(CLE, []);
}

export function useFavoris() {
  const [favoris, setFavoris] = useState<Favori[]>(lire);

  // Synchronise si modifié depuis un autre onglet ou par une autre instance du hook
  useEffect(() => {
    function sync() {
      setFavoris(lire());
    }
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const estFavori = useCallback((id: string) => favoris.some((f) => f.id === id), [favoris]);

  const basculer = useCallback((id: string, section: string) => {
    setFavoris((prev) => {
      const suivant = prev.some((f) => f.id === id)
        ? prev.filter((f) => f.id !== id)
        : [...prev, { id, section }];
      ecrireStockage(CLE, suivant);
      window.dispatchEvent(new Event(EVENT));
      return suivant;
    });
  }, []);

  const supprimerFavori = useCallback((id: string) => {
    setFavoris((prev) => {
      const suivant = prev.filter((f) => f.id !== id);
      ecrireStockage(CLE, suivant);
      window.dispatchEvent(new Event(EVENT));
      return suivant;
    });
  }, []);

  return { favoris, estFavori, basculer, supprimerFavori };
}
