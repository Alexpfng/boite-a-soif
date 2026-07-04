// Composant invisible monté à la racine (comme PresenceAuto) : où que je sois
// dans l'app, un « tchin à distance » d'un pote fait sonner le verre, vibrer
// le téléphone et affiche un toast. Le moment magique de la tablée.
import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { tchin, vibrer } from '../audio/sons';
import { abonnerTchins } from './tchinDistance';

export function EcouteurTchin() {
  const { user } = useAuth();
  const { annoncer } = useToast();
  const monId = user?.id;

  useEffect(() => {
    if (!monId) return;
    return abonnerTchins(monId, ({ pseudo }) => {
      tchin();
      vibrer([60, 40, 60]);
      annoncer(`🍻 ${pseudo} trinque avec toi !`);
    });
  }, [monId, annoncer]);

  return null;
}
