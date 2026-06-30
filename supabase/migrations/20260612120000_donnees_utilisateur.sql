-- Synchronisation multi-appareils de l'espace personnel.
-- Une ligne par utilisateur, contenant l'ensemble de ses données personnelles
-- (favoris, rendez-vous, bien-être, carte, arbre, phrases, carnet) en JSON.
-- Sécurité par RLS : chacun n'accède qu'à sa propre ligne.
-- Idempotent : peut être ré-exécuté sans erreur.

create table if not exists public.donnees_utilisateur (
  user_id uuid primary key references auth.users (id) on delete cascade,
  donnees jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.donnees_utilisateur enable row level security;

drop policy if exists "Lecture de ses propres donnees" on public.donnees_utilisateur;
create policy "Lecture de ses propres donnees"
  on public.donnees_utilisateur
  for select
  using (auth.uid() = user_id);

drop policy if exists "Insertion de ses propres donnees" on public.donnees_utilisateur;
create policy "Insertion de ses propres donnees"
  on public.donnees_utilisateur
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Mise a jour de ses propres donnees" on public.donnees_utilisateur;
create policy "Mise a jour de ses propres donnees"
  on public.donnees_utilisateur
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Suppression de ses propres donnees" on public.donnees_utilisateur;
create policy "Suppression de ses propres donnees"
  on public.donnees_utilisateur
  for delete
  using (auth.uid() = user_id);
