import { useLocation, useNavigate } from 'react-router-dom';
import { IconeMaison } from '../../ui/icons';
import { COL } from '../../ui/theme';

type Cle = 'pesealco' | 'jukebox' | 'accueil' | 'ardoise' | 'champions';

function activeKey(pathname: string): Cle | null {
  if (pathname === '/app') return 'accueil';
  if (pathname.startsWith('/pese-alco')) return 'pesealco';
  if (pathname.startsWith('/juke-box')) return 'jukebox';
  if (pathname.startsWith('/ardoise')) return 'ardoise';
  if (pathname.startsWith('/champions')) return 'champions';
  return null;
}

// Petites icônes de la barre (24px)
const IcoJauge = ({ c }: { c: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 16 A8 8 0 0 1 20 16" /><line x1="12" y1="16" x2="16" y2="11" /><circle cx="12" cy="16" r="1.4" fill={c} stroke="none" />
  </svg>
);
const IcoHP = ({ c }: { c: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10 H8 L13 5 V19 L8 14 H4 Z" /><path d="M16.5 9 C18.5 10.5 18.5 13.5 16.5 15" />
  </svg>
);
const IcoArdoise = ({ c }: { c: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" /><line x1="7.5" y1="9" x2="16.5" y2="9" /><line x1="7.5" y1="12.5" x2="16.5" y2="12.5" /><line x1="7.5" y1="16" x2="12" y2="16" />
  </svg>
);
const IcoTrophee = ({ c }: { c: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 21 H16" /><path d="M12 17 V21" /><path d="M6 4 H18 V8 C18 11.3 15.3 13.5 12 13.5 C8.7 13.5 6 11.3 6 8 Z" /><path d="M18 5 H21 V7.5 C21 9 20 10 18.5 10" /><path d="M6 5 H3 V7.5 C3 9 4 10 5.5 10" />
  </svg>
);

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = activeKey(pathname);

  const tabStyle = (cle: Cle): React.CSSProperties => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    border: 'none', background: active === cle ? 'rgba(255,255,255,0.16)' : 'transparent',
    borderRadius: 14, padding: '8px 2px', color: active === cle ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
    fontSize: '0.64rem', fontWeight: 600, minHeight: 56,
  });
  const couleur = (cle: Cle) => (active === cle ? '#FFFFFF' : 'rgba(255,255,255,0.62)');

  return (
    <nav data-tone="bleu9" aria-label="Navigation principale"
      style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#120F0D', zIndex: 40, borderRadius: '22px 22px 0 0', borderTop: '1px solid rgba(233,196,106,0.25)', padding: '8px 6px calc(8px + env(safe-area-inset-bottom)) 6px', display: 'flex', alignItems: 'flex-end' }}>
      <button onClick={() => navigate('/pese-alco')} aria-label="Le Pèse-Alco" aria-current={active === 'pesealco' ? 'page' : undefined} style={tabStyle('pesealco')}>
        <IcoJauge c={couleur('pesealco')} />
        Pèse-Alco
      </button>
      <button onClick={() => navigate('/juke-box')} aria-label="Le Juke-Box à Conneries" aria-current={active === 'jukebox' ? 'page' : undefined} style={tabStyle('jukebox')}>
        <IcoHP c={couleur('jukebox')} />
        Juke-Box
      </button>
      <button onClick={() => navigate('/app')} aria-label="Accueil" aria-current={active === 'accueil' ? 'page' : undefined}
        style={{ flex: 1.1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', padding: '0 2px', color: '#fff', fontSize: '0.64rem', fontWeight: 600 }}>
        <span style={{ width: 58, height: 58, borderRadius: '50%', background: active === 'accueil' ? COL.orange : COL.bleu7, border: `4px solid ${COL.bleu9}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -26, boxShadow: '0 4px 12px rgba(14,58,77,0.3)' }}>
          <IconeMaison size={26} />
        </span>
        Comptoir
      </button>
      <button onClick={() => navigate('/ardoise')} aria-label="L’Ardoise des Comptes" aria-current={active === 'ardoise' ? 'page' : undefined} style={tabStyle('ardoise')}>
        <IcoArdoise c={couleur('ardoise')} />
        Ardoise
      </button>
      <button onClick={() => navigate('/champions')} aria-label="Le Tableau des Champions" aria-current={active === 'champions' ? 'page' : undefined} style={tabStyle('champions')}>
        <IcoTrophee c={couleur('champions')} />
        Champions
      </button>
    </nav>
  );
}
