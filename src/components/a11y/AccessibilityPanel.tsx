import { useEffect, useRef } from 'react';
import { useA11y, CRANS_TAILLE } from './AccessibilityContext';
import { IconeHautParleur } from '../../ui/icons';
import { COL, FRAUNCES } from '../../ui/theme';
import { useSpeech } from '../../features/tts/useSpeech';

// Tiroir latéral droit « Confort de lecture » — design exact

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ open, onClose }: Props) {
  const { prefs, setPrefs } = useA11y();
  const { lire } = useSpeech();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  function ecouterPage() {
    const main = document.querySelector('main');
    const txt = main ? (main as HTMLElement).innerText.slice(0, 1200) : "Bienvenue sur A'PHAS'AIDE.";
    onClose();
    lire([txt]);
  }

  const caseStyle = (coche: boolean): React.CSSProperties => ({
    width: 30, height: 30, borderRadius: 8,
    background: coche ? COL.bleu7 : '#fff',
    border: `2px solid ${COL.bleu7}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, flexShrink: 0,
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      <button
        onClick={onClose}
        aria-label="Fermer le panneau"
        style={{ position: 'absolute', inset: 0, border: 'none', background: 'rgba(14,58,77,0.4)', width: '100%' }}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Options d'accessibilité"
        tabIndex={-1}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: '86%', maxWidth: 360,
          background: '#fff',
          boxShadow: '-8px 0 30px rgba(14,58,77,0.25)',
          padding: 20,
          overflowY: 'auto',
          borderRadius: '24px 0 0 24px',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.22rem', color: COL.bleu9 }}>
            Confort de lecture
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width: 48, height: 48, border: 'none', borderRadius: 14,
              background: COL.sable, color: COL.texte, fontSize: '1.11rem', fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <h3 style={{ margin: '22px 0 8px 0', fontSize: '0.89rem', fontWeight: 600, color: COL.texte2 }}>Taille du texte</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {CRANS_TAILLE.map((sc) => {
            const sel = prefs.fontScale === sc;
            return (
              <button
                key={sc}
                onClick={() => setPrefs({ fontScale: sc })}
                aria-pressed={sel}
                style={{
                  border: `2px solid ${sel ? COL.bleu7 : COL.bleu1}`,
                  borderRadius: 14,
                  background: sel ? COL.bleu7 : '#fff',
                  color: sel ? '#fff' : COL.texte,
                  padding: '10px 4px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  minHeight: 56,
                }}
              >
                {sc} %
              </button>
            );
          })}
        </div>

        <h3 style={{ margin: '22px 0 8px 0', fontSize: '0.89rem', fontWeight: 600, color: COL.texte2 }}>Affichage</h3>
        <button
          onClick={() => setPrefs({ contrast: !prefs.contrast })}
          aria-pressed={prefs.contrast}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', gap: 12,
            border: `2px solid ${COL.bleu1}`, borderRadius: 16, background: '#fff',
            padding: '14px 16px', textAlign: 'left', minHeight: 64, margin: '0 0 10px 0',
          }}
        >
          <span style={caseStyle(prefs.contrast)} aria-hidden="true">{prefs.contrast ? '✓' : ''}</span>
          <span>
            <span style={{ display: 'block', fontWeight: 600, color: COL.texte }}>Contraste élevé</span>
            <span style={{ display: 'block', fontSize: '0.78rem', color: COL.texte2 }}>Fond blanc, texte noir, liens soulignés</span>
          </span>
        </button>
        <button
          onClick={() => setPrefs({ comfort: !prefs.comfort })}
          aria-pressed={prefs.comfort}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', gap: 12,
            border: `2px solid ${COL.bleu1}`, borderRadius: 16, background: '#fff',
            padding: '14px 16px', textAlign: 'left', minHeight: 64,
          }}
        >
          <span style={caseStyle(prefs.comfort)} aria-hidden="true">{prefs.comfort ? '✓' : ''}</span>
          <span>
            <span style={{ display: 'block', fontWeight: 600, color: COL.texte }}>Boutons agrandis</span>
            <span style={{ display: 'block', fontSize: '0.78rem', color: COL.texte2 }}>Des zones tactiles plus grandes</span>
          </span>
        </button>

        <h3 style={{ margin: '22px 0 8px 0', fontSize: '0.89rem', fontWeight: 600, color: COL.texte2 }}>Lecture vocale</h3>
        <button
          onClick={ecouterPage}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', gap: 12,
            border: 'none', borderRadius: 16, background: COL.bleu7, color: '#fff',
            padding: '14px 16px', textAlign: 'left', fontWeight: 600, minHeight: 64,
          }}
        >
          <IconeHautParleur size={24} />
          Écouter cette page
        </button>
        <p style={{ margin: '18px 0 0 0', fontSize: '0.78rem', color: COL.texte2 }}>
          Vos préférences sont enregistrées sur cet appareil.
        </p>
      </aside>
    </div>
  );
}
