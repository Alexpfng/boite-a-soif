import { useState } from 'react';
import { prononcer } from '../tts/useSpeech';
import { OutilCadre, vibrer } from './OutilCadre';
import { COL, FRAUNCES } from '../../ui/theme';
import CONTENT from '../../content';
import type { CorpsZone } from '../../content/types';

type Vue = 'homme' | 'femme' | 'dos';

const TABS: { key: Vue; label: string }[] = [
  { key: 'homme', label: 'Homme — face' },
  { key: 'femme', label: 'Femme — face' },
  { key: 'dos', label: 'De dos' },
];

export default function SchemaCorps() {
  const [vue, setVue] = useState<Vue>('homme');
  const [zone, setZone] = useState<string | null>(null);

  const labelOf = (z: CorpsZone) => (vue === 'dos' ? z.dos : z.face);

  function pick(z: CorpsZone) {
    setZone(z.id);
    vibrer();
    prononcer(labelOf(z), 0.95);
  }

  const selZone = CONTENT.corpsZones.find((z) => z.id === zone);
  const zoneLabel = selZone
    ? labelOf(selZone).charAt(0).toUpperCase() + labelOf(selZone).slice(1)
    : 'Touchez une zone';

  return (
    <OutilCadre
      label="Schéma du corps"
      action={
        <button
          onClick={() => setZone(null)}
          style={{
            border: `2px solid ${COL.bleu7}`, borderRadius: 999, background: '#fff',
            color: COL.bleu7, padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          Effacer
        </button>
      }
    >
      <div role="tablist" aria-label="Choisir la vue" style={{ display: 'flex', gap: 8, padding: '4px 16px 0 16px' }}>
        {TABS.map((t) => {
          const sel = vue === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { setVue(t.key); setZone(null); }}
              role="tab"
              aria-selected={sel}
              style={{
                flex: 1, border: 'none', borderRadius: 999,
                background: sel ? COL.bleu9 : '#fff',
                color: sel ? '#fff' : COL.bleu7,
                padding: '11px 8px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        style={{
          margin: '14px 22px 0 22px', textAlign: 'center', minHeight: 58,
          fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.33rem', color: COL.orangeFonce, lineHeight: 1.3,
        }}
      >
        {zoneLabel}
      </p>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px 16px 16px', minHeight: 0 }}>
        <svg
          viewBox="0 0 200 305"
          style={{ width: '100%', maxWidth: 270, height: '100%', maxHeight: '52vh', display: 'block' }}
          role="group"
          aria-label="Schéma du corps"
        >
          {CONTENT.corpsZones.map((z) => {
            const actif = zone === z.id;
            const common = {
              fill: actif ? COL.orangeAccent : vue === 'femme' ? '#EAD9E2' : '#D8E6EC',
              stroke: actif ? COL.orangeFonce : COL.bleu7,
              strokeWidth: actif ? 3 : 1.6,
              style: { cursor: 'pointer', transition: 'fill 150ms ease' } as React.CSSProperties,
              tabIndex: 0,
              role: 'button',
              'aria-label': labelOf(z),
              onClick: () => pick(z),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  pick(z);
                }
              },
            };
            if (z.shape === 'circle') {
              return <circle key={z.id} cx={z.attrs.cx} cy={z.attrs.cy} r={z.attrs.r} {...common} />;
            }
            if (z.shape === 'ellipse') {
              return <ellipse key={z.id} cx={z.attrs.cx} cy={z.attrs.cy} rx={z.attrs.rx} ry={z.attrs.ry} {...common} />;
            }
            return (
              <rect key={z.id} x={z.attrs.x} y={z.attrs.y} width={z.attrs.width} height={z.attrs.height} rx={z.attrs.rx} {...common} />
            );
          })}
        </svg>
      </div>

      <p style={{ margin: '0 22px 16px 22px', textAlign: 'center', fontSize: '0.84rem', color: COL.texte2 }}>
        Touchez la zone du corps où vous avez mal.
      </p>
    </OutilCadre>
  );
}
