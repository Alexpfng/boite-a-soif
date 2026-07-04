/**
 * Bandeau discret affiché aux invités (connexion anonyme) : rappelle que les
 * données restent sur l'appareil et propose de « garder son compte ».
 * Se masque pour la session de navigation en cours (pas de harcèlement).
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { COL } from '../../ui/theme';

const CLE_MASQUE = 'bas:bandeau-invite-masque';

export function BandeauInvite() {
  const { estInvite } = useAuth();
  const [masque, setMasque] = useState(() => {
    try {
      return sessionStorage.getItem(CLE_MASQUE) === '1';
    } catch {
      return false;
    }
  });

  if (!estInvite || masque) return null;

  const masquer = () => {
    setMasque(true);
    try {
      sessionStorage.setItem(CLE_MASQUE, '1');
    } catch {
      /* stockage indisponible : le bandeau reviendra, tant pis */
    }
  };

  return (
    <div role="note" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(233,196,106,0.12)', borderBottom: `1px solid ${COL.or}`, fontSize: '0.8rem', lineHeight: 1.35 }}>
      <span aria-hidden="true">🎭</span>
      <span style={{ flex: 1, color: COL.texte2 }}>
        Mode invité — tes exploits restent sur ce téléphone.{' '}
        <Link to="/connexion" style={{ color: COL.or, fontWeight: 800, textDecoration: 'underline' }}>
          Garder mon compte
        </Link>
      </span>
      <button onClick={masquer} aria-label="Masquer ce bandeau"
        style={{ border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 800, fontSize: '0.9rem', padding: '4px 6px', cursor: 'pointer' }}>
        ✕
      </button>
    </div>
  );
}
