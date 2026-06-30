// « Vos répliques » — communautaire (Supabase). Tout le monde voit, propose et
// like ; la plus likée du mois trône en haut du Juke-Box. Depuis que le compte
// est obligatoire : 1 like par COMPTE (table replique_likes) et chaque réplique
// affiche son auteur.

import { supabase } from '../../integrations/supabase/client';

export interface Proposition {
  id: string;
  texte: string;
  likes: number;
  created_at: string;
  auteur: string | null;
  dejaLike?: boolean;
}

const TABLE = 'repliques';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function from(t: string) { return (supabase as any).from(t); }

/** Toutes les répliques (plus likées d'abord), avec « ai-je liké ? » par compte. */
export async function lirePropositions(): Promise<Proposition[]> {
  const { data, error } = await from(TABLE)
    .select('id, texte, likes, created_at, auteur')
    .order('likes', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200);
  if (error || !data) return [];

  const mesLikes = new Set<string>();
  const { data: u } = await supabase.auth.getUser();
  if (u.user) {
    const { data: likes } = await from('replique_likes').select('replique_id');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (likes as any[] | null)?.forEach((l) => mesLikes.add(l.replique_id));
  }
  return (data as Proposition[]).map((p) => ({ ...p, dejaLike: mesLikes.has(p.id) }));
}

export async function ajouterProposition(texte: string): Promise<boolean> {
  const t = texte.trim();
  if (t.length < 2) return false;
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return false;
  const pseudo = ((user.user_metadata?.pseudo as string) || '').trim() || 'Pilier';
  const { error } = await from(TABLE).insert({ texte: t.slice(0, 120), auteur: pseudo, auteur_id: user.id });
  return !error;
}

/** Like / unlike (1 par compte). Renvoie le nouvel état (true = liké). */
export async function likerProposition(id: string): Promise<boolean | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('basculer_like', { rid: id });
  if (error) return null;
  return Boolean(data);
}

/** Réplique du mois = la plus likée parmi celles créées ce mois-ci. */
export function repliqueDuMois(liste: Proposition[]): Proposition | null {
  const debut = new Date();
  debut.setDate(1);
  debut.setHours(0, 0, 0, 0);
  const duMois = liste.filter((p) => new Date(p.created_at) >= debut);
  if (duMois.length === 0) return null;
  return duMois.reduce((meilleur, p) => (p.likes > meilleur.likes ? p : meilleur), duMois[0]);
}
