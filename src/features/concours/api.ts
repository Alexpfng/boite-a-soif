// Les Concours : salon de concours entre amis, via un code court.
// Classement en temps réel (Supabase Realtime). Aucune géolocalisation.

import { supabase } from '../../integrations/supabase/client';

export type Mode = 'reflexes' | 'repliques' | 'quiz';
export type Statut = 'attente' | 'en_cours' | 'termine';

export interface Concours { id: string; code: string; hote: string; mode: Mode; statut: Statut; manche: number; jeux: string[] }

// Les épreuves possibles du tournoi ; chaque tournoi en tire quelques-unes au hasard.
export const JEUX_POOL = ['reflexes', 'tapmax', 'chronostop', 'cri', 'shaker', 'equilibre', 'blind'];
function choisirJeux(n = 4): string[] {
  const a = [...JEUX_POOL];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}
export interface Participant { user_id: string; pseudo: string }
export interface Score { user_id: string; pseudo: string; score: number; manche: number }

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
    const { data, error } = await f('concours').insert({ code, hote: u.id, mode, statut: 'attente', jeux: choisirJeux(4) }).select().single();
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
  const { data } = await f('concours').select('id, code, hote, mode, statut, manche, jeux').eq('id', id).maybeSingle();
  return (data as Concours) || null;
}
export async function lancerConcours(id: string) { await f('concours').update({ statut: 'en_cours', manche: 1 }).eq('id', id); }
export async function avancerManche(id: string, manche: number) { await f('concours').update({ manche }).eq('id', id); }
export async function terminerConcours(id: string) { await f('concours').update({ statut: 'termine' }).eq('id', id); }

export async function publierScore(id: string, manche: number, score: number) {
  const u = await moi();
  if (!u) return;
  await f('concours_scores').upsert({ concours_id: id, user_id: u.id, pseudo: pseudoDe(u), manche, score }, { onConflict: 'concours_id,user_id,manche' });
}

export async function lireParticipants(id: string): Promise<Participant[]> {
  const { data } = await f('concours_participants').select('user_id, pseudo').eq('concours_id', id);
  return (data as Participant[]) || [];
}
export async function lireScores(id: string): Promise<Score[]> {
  const { data } = await f('concours_scores').select('user_id, pseudo, score, manche').eq('concours_id', id);
  return (data as Score[]) || [];
}

export interface Rang { user_id: string; pseudo: string; points: number }
/** Classement cumulé : par manche on classe les scores et on attribue des points
 *  (1er = N pts … dernier = 1). Le total départage le tournoi. */
export function classementCumule(scores: Score[], ascParManche: Record<number, boolean>): Rang[] {
  const points = new Map<string, number>();
  const pseudo = new Map<string, string>();
  scores.forEach((s) => pseudo.set(s.user_id, s.pseudo));
  const manches = Array.from(new Set(scores.map((s) => s.manche)));
  for (const m of manches) {
    const asc = ascParManche[m] ?? true;
    const list = scores.filter((s) => s.manche === m).sort((a, b) => (asc ? a.score - b.score : b.score - a.score));
    const n = list.length;
    list.forEach((s, i) => points.set(s.user_id, (points.get(s.user_id) || 0) + (n - i)));
  }
  return [...points.entries()]
    .map(([user_id, pts]) => ({ user_id, pseudo: pseudo.get(user_id) || 'Pilier', points: pts }))
    .sort((a, b) => b.points - a.points);
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
