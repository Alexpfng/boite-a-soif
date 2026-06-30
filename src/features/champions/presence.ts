// Champions en temps réel : chaque pilier connecté publie son taux du moment
// dans `etats_soiree`. La RLS ne laisse voir que soi + ses amis acceptés.
// On s'abonne aux changements via Supabase Realtime.

import { supabase } from '../../integrations/supabase/client';

export interface EtatSoiree {
  user_id: string;
  pseudo: string;
  bac: number;
  etat_cle: string | null;
  emoji: string | null;
  maj: string;
}

const TABLE = 'etats_soiree';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function table() { return (supabase as any).from(TABLE); }

/** Publie (ou met à jour) mon état du moment. */
export async function publierMonEtat(
  userId: string,
  pseudo: string,
  bac: number,
  etatCle: string,
  emoji: string,
): Promise<void> {
  await table().upsert(
    { user_id: userId, pseudo, bac: Number(bac.toFixed(3)), etat_cle: etatCle, emoji, maj: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
}

/** Mon état + ceux de mes amis acceptés (RLS), du plus chargé au moins chargé. */
export async function lireEtats(): Promise<EtatSoiree[]> {
  const { data, error } = await table().select('user_id, pseudo, bac, etat_cle, emoji, maj');
  if (error || !data) return [];
  return (data as EtatSoiree[])
    .map((e) => ({ ...e, bac: Number(e.bac) }))
    .sort((a, b) => b.bac - a.bac);
}

/** S'abonne aux changements d'états (le mien + ceux des amis). Renvoie un désabonnement. */
export function abonnerEtats(onChange: () => void): () => void {
  const canal = supabase
    .channel('etats-soiree')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => onChange())
    .subscribe();
  return () => { supabase.removeChannel(canal); };
}
