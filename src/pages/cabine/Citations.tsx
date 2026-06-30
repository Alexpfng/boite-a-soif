import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';
import { citationAuHasard, type Citation } from '../../features/cabine/citations';

// ── Citations d'Ivrognes ────────────────────────────────────────────────────
// La sagesse (très relative) du comptoir, déclamée par le tavernier.
export function Citations({ onRetour }: { onRetour: () => void }) {
  const [citation, setCitation] = useState<Citation>(() => citationAuHasard());

  function tirer() {
    const c = citationAuHasard();
    setCitation(c);
    parlerTavernier(c.texte, 0.5, 0.92);
  }

  return (
    <>
      <Entete titre="Citations d’Ivrognes" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          La sagesse (très relative) du comptoir. À méditer, le verre à la main.
        </p>

        <div className="pmu-ardoise" style={{ position: 'relative' }}>
          <div className="craie-accent" style={{ fontFamily: FRAUNCES, fontSize: '2.6rem', lineHeight: 0.6, marginBottom: 6 }} aria-hidden="true">“</div>
          <p className="craie" style={{ margin: 0, fontFamily: FRAUNCES, fontSize: '1.3rem', lineHeight: 1.4 }}>{citation.texte}</p>
          <div className="craie-2" style={{ marginTop: 12, fontSize: '0.9rem', textAlign: 'right' }}>— {citation.auteur}</div>
        </div>

        <button onClick={tirer} className="pmu-arcade" style={{ width: '100%', marginTop: 16, minHeight: 60 }}>
          🍷 Une autre citation
        </button>

        <p style={{ margin: '14px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Certaines citations sont… librement attribuées. C’est le comptoir, pas la Sorbonne.
        </p>
      </section>
    </>
  );
}
