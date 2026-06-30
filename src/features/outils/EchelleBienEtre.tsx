import { useState } from 'react';
import { prononcer } from '../tts/useSpeech';
import { OutilCadre, vibrer } from './OutilCadre';
import { enregistrerRessenti } from '../bienetre/journal';
import { COL, FRAUNCES } from '../../ui/theme';
import CONTENT from '../../content';

// Bouches SVG du design (du plus triste au plus joyeux)
const MOUTHS = [
  'M19 41 Q30 30 41 41',
  'M19 39 Q30 33 41 39',
  'M19 37 L41 37',
  'M19 34 Q30 43 41 34',
  'M17 32 Q30 47 43 32',
];

export default function EchelleBienEtre() {
  const [sel, setSel] = useState<number | null>(null);

  function pick(id: number, dire: string) {
    setSel(id);
    vibrer();
    prononcer(dire, 0.95);
    enregistrerRessenti(id);
  }

  const selItem = CONTENT.echelle.find((e) => e.id === sel);

  return (
    <OutilCadre
      label="Échelle de bien-être"
      action={
        <button
          onClick={() => setSel(null)}
          style={{
            border: `2px solid ${COL.bleu7}`, borderRadius: 999, background: '#fff',
            color: COL.bleu7, padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          Recommencer
        </button>
      }
    >
      <p style={{ margin: '8px 22px 0 22px', textAlign: 'center', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.33rem', color: COL.bleu9, lineHeight: 1.3 }}>
        Comment vous sentez-vous ?
      </p>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: 16, minHeight: 0 }}>
        {CONTENT.echelle.map((e, i) => {
          const actif = sel === e.id;
          return (
            <button
              key={e.id}
              onClick={() => pick(e.id, e.dire)}
              aria-label={e.dire}
              aria-pressed={actif}
              style={{
                display: 'flex', alignItems: 'center', gap: 18,
                border: actif ? `4px solid ${e.couleur}` : '4px solid transparent',
                borderRadius: 22, background: '#fff', padding: '12px 18px',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                transform: actif ? 'scale(1.04)' : 'scale(1)',
                boxShadow: '0 2px 10px rgba(14,58,77,0.08)',
                minHeight: 88,
              }}
            >
              <svg viewBox="0 0 60 60" width="64" height="64" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="30" cy="30" r="27" fill={e.couleur} />
                <circle cx="21" cy="24" r="3.4" fill="#FFFFFF" />
                <circle cx="39" cy="24" r="3.4" fill="#FFFFFF" />
                <path d={MOUTHS[i]} stroke="#FFFFFF" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '1.22rem', fontWeight: 600, color: COL.texte }}>{e.label}</span>
            </button>
          );
        })}
      </div>
      {selItem && (
        <p
          aria-live="polite"
          style={{
            margin: '0 22px 20px 22px', textAlign: 'center', background: COL.bleu9, color: '#fff',
            borderRadius: 18, padding: 14, fontSize: '1.11rem', fontWeight: 600,
          }}
        >
          « {selItem.dire} »
        </p>
      )}
    </OutilCadre>
  );
}
