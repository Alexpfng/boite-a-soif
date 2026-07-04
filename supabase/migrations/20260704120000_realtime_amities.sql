-- Demandes de potes en direct : publier `amities` sur le canal Realtime.
-- L'app s'abonne aux postgres_changes (RLS respectée) pour faire apparaître
-- une demande reçue sur l'accueil sans recharger. Sans cette publication,
-- l'app fonctionne quand même (chargement au montage de la page).
do $$
begin
  if to_regclass('public.amities') is not null
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'amities'
     )
  then
    alter publication supabase_realtime add table public.amities;
  end if;
end
$$;
