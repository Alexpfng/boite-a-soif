// Les Concours : salon de concours entre amis, via un code court.
// Classement en temps réel (Supabase Realtime). Aucune géolocalisation.

import { supabase } from '../../integrations/supabase/client';

export type Mode = 'reflexes' | 'repliques' | 'quiz';
export type Statut = 'attente' | 'en_cours' | 'termine';

export interface Concours { id: string; code: string; hote: string; mode: Mode; statut: Statut }
export interface Participant { user_id: string; pseudo: string }
export interface Score { user_id: string; pseudo: string; score: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function f(t: string) { return (supabase as any).from(t); }
async function moi() { const { data } = await supabase.auth.getUser(); return data.user; }
function pseudoDe(u: { user_metadata?: { pseudo?: string } } | null): string {
  return ((u?.user_metadata?.pseudo as string) || '').trim() || 'Pilier';
}
function codeAleatoire(): string {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return 'PMU-' + s;
}

export async function creerConcours(mode: Mode): Promise<Concours | null> {
  const u = await moi();
  if (!u) return null;
  for (let essai = 0; essai < 5; essai++) {
    const code = codeAleatoire();
    const { data, error } = await f('concours').insert({ code, hote: u.id, mode, statut: 'attente' }).select().single();
    if (!error && data) {
      await f('concours_participants').insert({ concours_id: data.id, user_id: u.id, pseudo: pseudoDe(u) });
      return data as Concours;
    }
  }
  return null;
}

/** Rejoint (ou retrouve) un concours par son code. Renvoie l'id, ou null si code inconnu. */
export async function rejoindreParCode(code: string): Promise<string | null> {
  const u = await moi();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('rejoindre_concours', { p_code: code.trim().toUpperCase(), p_pseudo: pseudoDe(u) });
  if (error) return null;
  return (data as string) || null;
}

export async function lireConcours(id: string): Promise<Concours | null> {
  const { data } = await f('concours').select('id, code, hote, mode, statut').eq('id', id).maybeSingle();
  return (data as Concours) || null;
}
export async function lancerConcours(id: string) { await f('concours').update({ statut: 'en_cours' }).eq('id', id); }
export async function terminerConcours(id: string) { await f('concours').update({ statut: 'termine' }).eq('id', id); }

export async function publierScore(id: string, score: number) {
  const u = await moi();
  if (!u) return;
  await f('concours_scores').upsert({ concours_id: id, user_id: u.id, pseudo: pseudoDe(u), score }, { onConflict: 'concours_id,user_id' });
}

export async function lireParticipants(id: string): Promise<Participant[]> {
  const { data } = await f('concours_participants').select('user_id, pseudo').eq('concours_id', id);
  return (data as Participant[]) || [];
}
export async function lireScores(id: string): Promise<Score[]> {
  const { data } = await f('concours_scores').select('user_id, pseudo, score').eq('concours_id', id);
  return (data as Score[]) || [];
}

export function abonnerConcours(id: string, cb: () => void): () => void {
  const ch = supabase
    .channel('concours-' + id)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'concours', filter: `id=eq.${id}` }, cb)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'concours_participants', filter: `concours_id=eq.${id}` }, cb)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'concours_scores', filter: `concours_id=eq.${id}` }, cb)
    .subscribe();
  return () => { supabase.removeChannel(ch); };
}
