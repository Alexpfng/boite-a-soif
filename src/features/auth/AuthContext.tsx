import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { definirUtilisateurStockage, importerDonneesLocales, onChangementStockage } from '../../lib/storage';
import { tirerOuInitialiser, pousser } from './cloudSync';

interface AuthCtx {
  user: User | null;
  session: Session | null;
  chargement: boolean;
  // Vrai quand la session est résolue ET, le cas échéant, la synchro cloud
  // initiale terminée (ou échouée, on continue alors en local).
  pret: boolean;
  seDeconnecter: () => Promise<void>;
}

const Contexte = createContext<AuthCtx>({
  user: null,
  session: null,
  chargement: true,
  pret: false,
  seDeconnecter: async () => {},
});

export function useAuth(): AuthCtx {
  return useContext(Contexte);
}

// Applique l'espace de noms de stockage AVANT que l'app ne lise les données,
// puis importe une fois les données locales existantes dans le compte.
function appliquerUtilisateur(session: Session | null): void {
  const id = session?.user?.id ?? null;
  definirUtilisateurStockage(id);
  if (id) importerDonneesLocales(id);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [chargement, setChargement] = useState(true);
  const [syncPret, setSyncPret] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      appliquerUtilisateur(s);
      setSession(s);
      setChargement(false);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      appliquerUtilisateur(s);
      setSession(s);
      setChargement(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  // Synchro initiale (tirage cloud) à chaque connexion d'utilisateur.
  useEffect(() => {
    if (!userId) {
      setSyncPret(false);
      return;
    }
    let annule = false;
    setSyncPret(false);
    tirerOuInitialiser(userId)
      .catch(() => { /* hors-ligne ou table absente : on continue en local */ })
      .finally(() => { if (!annule) setSyncPret(true); });
    return () => { annule = true; };
  }, [userId]);

  // Poussée automatique (débouncée) à chaque modification des données perso.
  useEffect(() => {
    if (!userId) return;
    let minuteur: ReturnType<typeof setTimeout> | undefined;
    const off = onChangementStockage(() => {
      if (minuteur) clearTimeout(minuteur);
      minuteur = setTimeout(() => { pousser(userId).catch(() => { /* réessai au prochain changement */ }); }, 1500);
    });
    return () => { if (minuteur) clearTimeout(minuteur); off(); };
  }, [userId]);

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    definirUtilisateurStockage(null);
  };

  const pret = !chargement && (!userId || syncPret);

  return (
    <Contexte.Provider value={{ user: session?.user ?? null, session, chargement, pret, seDeconnecter }}>
      {children}
    </Contexte.Provider>
  );
}
