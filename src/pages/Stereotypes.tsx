import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { COL, FRAUNCES, CARD_SHADOW_SM } from '../ui/theme';
import CONTENT from '../content';

export default function Stereotypes() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <AppShell>
      <Hero color={COL.bleu9}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          Mieux comprendre
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>Les stéréotypes</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.89rem', opacity: 0.94 }}>
          Appuyez sur chaque idée reçue pour découvrir la réponse.
        </p>
      </Hero>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 16px 0 16px' }}>
        {CONTENT.stereotypes.map((s, i) => {
          const revele = !!open[i];
          if (!revele) {
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                data-card="true"
                aria-expanded={false}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', gap: 14,
                  border: 'none', background: '#fff', borderRadius: 20,
                  boxShadow: CARD_SHADOW_SM, padding: '18px 20px', textAlign: 'left', minHeight: 76,
                }}
              >
                <span
                  style={{
                    width: 34, height: 34, borderRadius: '50%', background: COL.orange, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  ✕
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 600, color: COL.texte, fontStyle: 'italic' }}>
                    « {s.idee} »
                  </span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: COL.texte2, marginTop: 4 }}>
                    Vrai ou faux ? Appuyez pour révéler
                  </span>
                </span>
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              data-tone="bleu9"
              aria-expanded={true}
              style={{
                display: 'block', width: '100%', border: 'none',
                background: COL.bleu9, color: '#fff', borderRadius: 20,
                padding: '18px 20px', textAlign: 'left',
              }}
            >
              <span style={{ display: 'block', fontSize: '0.84rem', fontStyle: 'italic', opacity: 0.8 }}>
                « {s.idee} »
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <span
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: COL.vert, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.22rem', color: COL.orangeAccent }}>
                  FAUX !
                </span>
              </span>
              <span style={{ display: 'block', marginTop: 8, fontSize: '0.95rem', lineHeight: 1.55 }}>
                {s.expl}
              </span>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
