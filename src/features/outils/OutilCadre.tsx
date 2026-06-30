import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Cadre plein écran commun aux outils (480px centré) + bouton Quitter

export function vibrer() {
  try {
    navigator.vibrate?.(80);
  } catch {
    /* non supporté */
  }
}

interface Props {
  children: ReactNode;
  background?: string;
  /** Bouton secondaire en haut à droite */
  action?: ReactNode;
  quitterSombre?: boolean;
  label: string;
}

export function OutilCadre({ children, background = '#F7F5F2', action, quitterSombre, label }: Props) {
  const navigate = useNavigate();

  return (
    <div
      role="region"
      aria-label={label}
      style={{
        position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, zIndex: 50,
        display: 'flex', flexDirection: 'column', background,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', flexShrink: 0 }}>
        <button
          onClick={() => { window.speechSynthesis?.cancel(); navigate(-1); }}
          style={{
            border: 'none', borderRadius: 999,
            background: quitterSombre ? 'rgba(28,43,51,0.55)' : '#1C2B33',
            color: '#fff', padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          ‹ Quitter
        </button>
        {action}
      </div>
      {children}
    </div>
  );
}
