// ──────────────────────────────────────────────────────────────────────────
// Tchin à distance : quand je trinque avec un pote, SON téléphone sonne et
// vibre aussi — via Supabase Realtime (broadcast), sans table ni migration.
// Chaque pilier écoute son canal personnel `tchin:<user_id>` ; trinquer =
// envoyer un message éphémère sur le canal du pote. Meilleure-chance : si le
// pote n'a pas l'app ouverte, le tchin se perd (et c'est très bien comme ça).
// ──────────────────────────────────────────────────────────────────────────

import { supabase } from '../../integrations/supabase/client';

export interface TchinRecu {
  deId: string;
  pseudo: string;
}

/** Écoute les tchins qui me sont destinés. Renvoie une fonction de désabonnement. */
export function abonnerTchins(monId: string, onTchin: (t: TchinRecu) => void): () => void {
  const canal = supabase
    .channel(`tchin:${monId}`)
    .on('broadcast', { event: 'tchin' }, ({ payload }) => {
      const p = payload as Partial<TchinRecu> | undefined;
      if (p && typeof p.deId === 'string' && typeof p.pseudo === 'string') {
        onTchin({ deId: p.deId, pseudo: p.pseudo });
      }
    })
    .subscribe();
  return () => { supabase.removeChannel(canal); };
}

/**
 * Envoie un tchin sur le téléphone d'un pote. Canal éphémère : on rejoint,
 * on envoie, on referme. Aucune erreur remontée (geste festif, pas critique).
 */
export function envoyerTchin(versId: string, deId: string, pseudo: string): void {
  const canal = supabase.channel(`tchin:${versId}`);
  let ferme = false;
  const fermer = () => {
    if (ferme) return;
    ferme = true;
    supabase.removeChannel(canal);
  };
  const garde = window.setTimeout(fermer, 8000); // filet si SUBSCRIBED n'arrive jamais
  canal.subscribe((statut) => {
    if (statut === 'SUBSCRIBED') {
      canal
        .send({ type: 'broadcast', event: 'tchin', payload: { deId, pseudo } })
        .catch(() => { /* tant pis, on a trinqué localement */ })
        .finally(() => { window.clearTimeout(garde); fermer(); });
    } else if (statut === 'CHANNEL_ERROR' || statut === 'TIMED_OUT') {
      window.clearTimeout(garde);
      fermer();
    }
  });
}
