import { useCallback, useEffect, useState } from 'react';
import { lireStockage, ecrireStockage } from '../../lib/storage';

const CLE = 'rendezvous';
const EVENT = 'aphasaide:rendezvous';

export interface Rendez_vous {
  id: string;
  titre: string;
  type: string;
  date: string;
  heure: string;
  notes?: string;
}

function lire(): Rendez_vous[] {
  return lireStockage<Rendez_vous[]>(CLE, []);
}

export function useRendezvous() {
  const [rdvs, setRdvs] = useState<Rendez_vous[]>(lire);

  useEffect(() => {
    function sync() {
      setRdvs(lire());
    }
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const ecrire = useCallback((suivant: Rendez_vous[]) => {
    const sorted = [...suivant].sort((a, b) =>
      `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`)
    );
    setRdvs(sorted);
    ecrireStockage(CLE, sorted);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const ajouter = useCallback(
    (rdv: Omit<Rendez_vous, 'id'>) => {
      const nouveau = { ...rdv, id: `rdv-${Date.now()}` };
      ecrire([...lire(), nouveau]);
      return nouveau;
    },
    [ecrire]
  );

  const supprimer = useCallback(
    (id: string) => ecrire(lire().filter((r) => r.id !== id)),
    [ecrire]
  );

  const modifier = useCallback(
    (id: string, data: Partial<Omit<Rendez_vous, 'id'>>) =>
      ecrire(lire().map((r) => (r.id === id ? { ...r, ...data } : r))),
    [ecrire]
  );

  const aujourd = new Date().toISOString().split('T')[0];
  const prochains = rdvs.filter((r) => r.date >= aujourd);

  return { rdvs, prochains, ajouter, supprimer, modifier };
}
