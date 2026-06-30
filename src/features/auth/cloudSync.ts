// Synchronisation multi-appareils des données personnelles via Supabase.
//
// Table : public.donnees_utilisateur (user_id uuid PK, donnees jsonb, updated_at)
// protégée par RLS (chacun n'accède qu'à sa ligne). Voir la migration
// supabase/migrations/*_donnees_utilisateur.sql.
//
// Stratégie : « dernière écriture gagne » sur l'ensemble du bloc, départagée
// par horodatage (modif locale vs updated_at du cloud). Tolérant au hors-ligne
// et à l'absence de la table (l'app fonctionne alors en local uniquement).

import { supabase } from '../../integrations/supabase/client';
import {
  lireBlobPerso,
  ecrireBlobPerso,
  lireHorodatageModif,
  definirHorodatageModif,
} from '../../lib/storage';

const TABLE = 'donnees_utilisateur';

// La table n'existe pas (encore) dans les types générés par Lovable : on évite
// la vérification de type sur ce nom de table précis.
function table() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(TABLE);
}

/** Pousse l'état local complet vers le cloud et marque le local comme synchronisé. */
export async function pousser(userId: string): Promise<void> {
  const maintenant = new Date().toISOString();
  const { error } = await table().upsert(
    { user_id: userId, donnees: lireBlobPerso(), updated_at: maintenant },
    { onConflict: 'user_id' },
  );
  if (error) throw error;
  definirHorodatageModif(userId, Date.parse(maintenant));
}

/**
 * À la connexion : récupère la version cloud et la fusionne avec le local.
 * - pas de ligne cloud → on envoie le local (première synchro du compte) ;
 * - local plus récent que le cloud → on envoie le local ;
 * - sinon → on hydrate le local avec le cloud.
 */
export async function tirerOuInitialiser(userId: string): Promise<void> {
  const { data, error } = await table()
    .select('donnees, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    await pousser(userId);
    return;
  }

  const localMaj = lireHorodatageModif(userId);
  const cloudTime = data.updated_at ? Date.parse(data.updated_at) : 0;

  if (localMaj > cloudTime) {
    await pousser(userId);
  } else {
    ecrireBlobPerso((data.donnees ?? {}) as Record<string, unknown>);
    definirHorodatageModif(userId, cloudTime);
  }
}
