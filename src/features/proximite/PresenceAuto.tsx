import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { lireStockage } from '../../lib/storage';
import { lireReglages, publierPresence } from './api';
import { calculerBAC, PROFIL_DEFAUT, type Conso, type Profil } from '../pesealco/widmark';

// Rafraîchit la position tant que l'appli est OUVERTE (foreground), si l'utilisateur
// a activé le partage (« geo-actif ») et n'est pas en mode fantôme. Le web ne permet
// pas le suivi en arrière-plan appli fermée — c'est le maximum faisable en PWA.
export function PresenceAuto() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    let stop = false;
    function publier() {
      if (stop || !lireStockage<boolean>('geo-actif', false)) return;
      if (lireReglages().visibilite === 'fantome' || !navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (g) => {
          const consos = lireStockage<Conso[]>('pese-alco-consos', []);
          const profil = lireStockage<Profil>('pese-alco-profil', PROFIL_DEFAUT);
          publierPresence(g.coords.latitude, g.coords.longitude, calculerBAC(consos, profil, Date.now()), consos.length).catch(() => {});
        },
        () => {},
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 90000 },
      );
    }
    publier();
    const iv = window.setInterval(publier, 150000);
    const onVis = () => { if (!document.hidden) publier(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { stop = true; window.clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [user]);
  return null;
}
