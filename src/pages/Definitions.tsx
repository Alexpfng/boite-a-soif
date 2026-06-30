import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { COL, FRAUNCES, CARD_SHADOW_SM } from '../ui/theme';
import CONTENT from '../content';

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function Definitions() {
  const location = useLocation();
  const initialOpen = (location.state as { ouvrir?: string } | null)?.ouvrir ?? null;
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(initialOpen);

  const nq = norm(q);
  const items = CONTENT.definitions.filter(
    (d) => !nq || norm(`${d.terme} ${d.def}`).includes(nq)
  );

  return (
    <AppShell>
      <Hero color={COL.bleu9}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          Mieux comprendre
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>Définitions</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.89rem', opacity: 0.94 }}>
          Les mots de l&apos;aphasie, expliqués simplement.
        </p>
      </Hero>

      <div style={{ padding: '18px 16px 0 16px' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher un terme…"
          aria-label="Chercher un terme"
          style={{
            width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 16,
            padding: '13px 18px', fontSize: '1rem', background: '#fff', color: COL.texte,
            minHeight: 56, outlineColor: COL.bleu5,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0 0 0' }}>
          {items.map((d) => {
            const ouvert = open === d.terme;
            return (
              <div key={d.terme} data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpen(ouvert ? null : d.terme)}
                  aria-expanded={ouvert}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: 12,
                    border: 'none', background: 'transparent', padding: '14px 18px',
                    textAlign: 'left', minHeight: 60,
                  }}
                >
                  <span
                    style={{
                      width: 34, height: 34, borderRadius: 10, background: COL.bleu1, color: COL.bleu9,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FRAUNCES, fontWeight: 700, flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {d.terme[0].toUpperCase()}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, color: COL.bleu9, fontSize: '1rem' }}>{d.terme}</span>
                  <span style={{ color: COL.texte2, fontSize: '1.11rem' }} aria-hidden="true">{ouvert ? '−' : '+'}</span>
                </button>
                {ouvert && (
                  <div style={{ padding: '0 18px 16px 64px' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: COL.texte }}>{d.def}</p>
                    {d.aValider && (
                      <span
                        style={{
                          display: 'inline-block', margin: '8px 0 0 0',
                          background: COL.orangeClair, color: COL.orangeFonce,
                          borderRadius: 999, padding: '1px 10px', fontSize: '0.72rem', fontWeight: 600,
                        }}
                      >
                        À valider par Clara
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
