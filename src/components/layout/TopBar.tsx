import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wordmark, IconeAccessibilite, IconeRetour } from '../../ui/icons';
import { COL, FRAUNCES } from '../../ui/theme';
import { lireXP, niveauDepuisXP } from '../../features/cabine/progression';
import { onChangementStockage } from '../../lib/storage';

interface Props {
  onOpenPanel: () => void;
}

export function TopBar({ onOpenPanel }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const notAccueil = location.pathname !== '/app';

  // Niveau de Pilier toujours visible : chaque action de la Cabine nourrit un
  // statut affiché partout. Suit les écritures du stockage en direct.
  const [xp, setXp] = useState(() => lireXP());
  useEffect(() => onChangementStockage(() => setXp(lireXP())), []);
  const niv = niveauDepuisXP(xp);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(20,17,15,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(243,232,207,0.12)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', minHeight: 60 }}>
        {notAccueil && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Retour"
            className="hover-bleu"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 48, border: 'none', background: 'transparent',
              borderRadius: 14, color: COL.or,
            }}
          >
            <IconeRetour />
          </button>
        )}
        <button
          onClick={() => navigate('/app')}
          aria-label="Accueil Boîte à Soif"
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            border: 'none', background: 'transparent', color: COL.bleu9, padding: '4px 2px',
          }}
        >
          <img src={`${import.meta.env.BASE_URL}brand/logo.png`} alt="" width={36} height={36} style={{ borderRadius: 8, display: 'block' }} />
          <Wordmark taille="topbar" />
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate('/cabine')}
          aria-label={`Niveau ${niv.niveau} — ${niv.titre}. Ouvrir la Cabine.`}
          title={niv.titre}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, minHeight: 34,
            border: `1px solid ${COL.or}`, background: 'rgba(233,196,106,0.10)',
            borderRadius: 999, color: COL.or, padding: '2px 10px 2px 8px',
            fontFamily: FRAUNCES, fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1rem' }}>{niv.emoji}</span>
          Nv {niv.niveau}
        </button>
        <button
          onClick={onOpenPanel}
          aria-label="Ouvrir les options d'accessibilité"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, border: `2px solid ${COL.or}`, background: 'transparent',
            borderRadius: 14, color: COL.or,
          }}
        >
          <IconeAccessibilite />
        </button>
      </div>
    </header>
  );
}
