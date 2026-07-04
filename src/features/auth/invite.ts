// ──────────────────────────────────────────────────────────────────────────
// Mode invité : entrer dans la boîte SANS créer de compte, via la connexion
// anonyme Supabase. L'invité a un vrai user.id → le stockage namespacé, la
// synchro cloud et le Realtime fonctionnent à l'identique. Le compte peut
// ensuite être « gardé » (converti en compte email + mot de passe).
//
// ⚠️ Côté projet Supabase : activer « Anonymous sign-ins »
// (Authentication → Sign In / Up), sinon signInAnonymously renvoie une erreur.
// ──────────────────────────────────────────────────────────────────────────
import { supabase } from '../../integrations/supabase/client';

const SURNOMS = ['Masqué', 'Mystère', 'Incognito', 'Fantôme', 'de Passage', 'sans Nom'];

/** Pseudo de comptoir aléatoire pour un invité (« Pilier Masqué #427 »). */
export function pseudoInvite(): string {
  const surnom = SURNOMS[Math.floor(Math.random() * SURNOMS.length)];
  const numero = 100 + Math.floor(Math.random() * 900);
  return `Pilier ${surnom} #${numero}`;
}

/** Ouvre la boîte en invité. Lève si la connexion anonyme est désactivée ou hors-ligne. */
export async function entrerEnInvite(): Promise<void> {
  const { error } = await supabase.auth.signInAnonymously({
    options: { data: { pseudo: pseudoInvite() } },
  });
  if (error) throw error;
}

/**
 * Convertit le compte invité en vrai compte. Le mot de passe est posé tout de
 * suite ; l'email part en confirmation si elle est exigée par le projet.
 * Toutes les données (ardoise, cuites, XP…) restent : même user.id.
 */
export async function convertirInvite(email: string, motDePasse: string, pseudo: string): Promise<void> {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password: motDePasse,
    data: { pseudo },
  });
  if (error) throw error;
  // Meilleure-chance : refléter le pseudo choisi dans le profil public
  // (le trigger de création ne rejoue pas sur une conversion).
  try {
    const id = data.user?.id;
    if (id) await (supabase as any).from('profiles').update({ pseudo }).eq('id', id);
  } catch {
    /* le profil garde son pseudo d'invité, modifiable plus tard */
  }
}
