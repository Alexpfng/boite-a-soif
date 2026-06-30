/**
 * Boîte à Soif est une appli récréative à utiliser tout de suite, au comptoir :
 * aucune connexion n'est requise. Les données (favoris, préférences) restent
 * en local sur l'appareil. Ce composant est donc un simple passe-plat —
 * conservé pour ne pas avoir à modifier le routeur.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
