/**
 * Accès réservé aux comptes : « Ouvrir la boîte » nécessite désormais d'être
 * connecté (vraie communauté). Tant que la session se résout on patiente ;
 * sans session, on renvoie vers /connexion en mémorisant la page demandée.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { COL } from '../../ui/theme';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, chargement } = useAuth();
  const location = useLocation();

  if (chargement) {
    return (
      <div role="status" aria-label="Chargement"
        style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COL.texte2, fontWeight: 600 }}>
        Un instant…
      </div>
    );
  }
  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
