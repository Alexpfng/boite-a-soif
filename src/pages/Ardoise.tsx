import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { usePeseAlco } from '../features/pesealco/usePeseAlco';
import { etatBac } from '../features/pesealco/widmark';
import {
  lireHistorique,
  viderHistorique,
  calculerBadges,
  type SessionArchive,
} from '../features/pesealco/historique';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
function fmtHeure(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function Ardoise() {
  const navigate = useNavigate();
  const { consos, picBac, bac, totalGrammes, cloturerSession } = usePeseAlco();
  const [histo, setHisto] = useState<SessionArchive[]>(() => lireHistorique());
  const [nudge, setNudge] = useState<string | null>(null);

  const montrerNudge = (m: string) => {
    setNudge(m);
    window.setTimeout(() => setNudge((cur) => (cur === m ? null : cur)), 3200);
  };

  const cloturer = () => {
    if (consos.length === 0) return;
    cloturerSession();
    setHisto(lireHistorique());
    montrerNudge('🧾 Soirée ajoutée à l’ardoise. À la revoyure !');
  };

  const vider = () => {
    viderHistorique();
    setHisto([]);
    montrerNudge('🧽 Ardoise effacée. On efface tout et on recommence.');
  };

  const badges = calculerBadges(histo, consos, picBac);
  const nbObtenus = badges.filter((b) => b.obtenu).length;

  return (
    <AppShell>
      {/* En-tête */}
      <div data-tone="bleu" style={{ background: COL.bleu9, color: COL.creme, padding: '28px 22px 26px' }}>
        <h1 className="pmu-titre" style={{ color: COL.creme, fontSize: '1.9rem' }}>
          L’ARDOISE DES <span className="accent" style={{ color: COL.orangeAccent }}>COMPTES</span>
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: '0.95rem', color: COL.texte2, lineHeight: 1.5 }}>
          Tes soirées, à la craie : le compte des consos, le pic de la session et les badges du comptoir.
        </p>
      </div>

      {nudge && (
        <div role="status" style={{ margin: '16px 16px 0', background: COL.bleu7, color: COL.creme, borderRadius: 14, padding: '12px 16px', fontWeight: 600, fontSize: '0.92rem' }}>
          {nudge}
        </div>
      )}

      {/* Soirée en cours — panneau ardoise/craie */}
      <section style={{ margin: '18px 16px 0' }}>
        <div className="pmu-ardoise">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }} className="craie-2">
              Soirée en cours
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.5rem' }} className="craie-accent">
              {fmtBac(bac)} <span style={{ fontSize: '0.8rem' }}>g/L</span>
            </span>
          </div>

          {consos.length === 0 ? (
            <p className="craie-2" style={{ margin: '12px 0 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Pas de soirée en cours. Le Pèse-Alco t’attend au comptoir.
            </p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[...consos].sort((a, b) => a.ts - b.ts).map((c) => (
                  <li key={c.id} className="craie" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', borderBottom: '1px dashed rgba(245,240,234,0.25)', paddingBottom: 6 }}>
                    <span style={{ fontSize: '1.2rem' }} aria-hidden="true">{c.emoji}</span>
                    <span style={{ flex: 1 }}>{c.label}</span>
                    <span className="craie-2" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtHeure(c.ts)}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 16, margin: '14px 0 0' }} className="craie">
                <span><strong>{consos.length}</strong> conso{consos.length > 1 ? 's' : ''}</span>
                <span><strong>{Math.round(totalGrammes)} g</strong> d’alcool</span>
                <span>pic ≈ <strong>{fmtBac(picBac)}</strong></span>
              </div>
              <button onClick={cloturer} className="pmu-arcade" style={{ width: '100%', marginTop: 16, background: COL.orange }}>
                🧾 Clôturer la soirée
              </button>
            </>
          )}
        </div>
      </section>

      {/* Badges */}
      <section style={{ margin: '26px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <h2 className="pmu-titre" style={{ fontSize: '1.25rem' }}>LES BADGES</h2>
          <span style={{ fontSize: '0.85rem', color: COL.texte2, fontWeight: 600 }}>{nbObtenus}/{badges.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {badges.map((b) => (
            <div key={b.id} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start', background: COL.panneau, borderRadius: 16, padding: '14px 14px',
              border: `2px solid ${b.obtenu ? COL.or : COL.bleu1}`, opacity: b.obtenu ? 1 : 0.55,
            }}>
              <span style={{ fontSize: '1.7rem', lineHeight: 1, filter: b.obtenu ? 'none' : 'grayscale(1)' }} aria-hidden="true">
                {b.obtenu ? b.emoji : '🔒'}
              </span>
              <span>
                <span style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: COL.creme }}>{b.nom}</span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: COL.texte2, marginTop: 2, lineHeight: 1.4 }}>{b.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Historique des soirées — façon tickets de bar */}
      <section style={{ margin: '26px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <h2 className="pmu-titre" style={{ fontSize: '1.25rem', flex: 1 }}>L’HISTORIQUE</h2>
          {histo.length > 0 && (
            <button onClick={vider} style={{ border: 'none', background: 'transparent', color: COL.rouge, fontWeight: 700, fontSize: '0.82rem', minHeight: 40 }}>
              Tout effacer
            </button>
          )}
        </div>

        {histo.length === 0 ? (
          <div style={{ background: COL.panneau, border: `2px dashed ${COL.bleu1}`, borderRadius: 16, padding: '22px 18px', textAlign: 'center', color: COL.texte2 }}>
            Aucune soirée clôturée pour l’instant. Ouvre une ardoise au Pèse-Alco, puis clôture-la ici.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {histo.map((s) => {
              const et = etatBac(s.picBac);
              return (
                <div key={s.id} style={{ background: COL.panneau, borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.35)', borderTop: `3px dashed ${COL.bleu1}`, borderBottom: `3px dashed ${COL.bleu1}`, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.02rem', color: COL.or, flex: 1, textTransform: 'capitalize' }}>{fmtDate(s.debut)}</span>
                    <span style={{ fontSize: '0.78rem', color: COL.texte2 }}>{fmtHeure(s.debut)} → {fmtHeure(s.fin)}</span>
                  </div>
                  <div style={{ margin: '10px 0', fontSize: '1.3rem', letterSpacing: 2 }} aria-hidden="true">
                    {s.consos.slice(0, 14).map((c) => c.emoji).join(' ')}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.86rem', color: COL.texte2, alignItems: 'center' }}>
                    <span><strong style={{ color: COL.texte }}>{s.nbConsos}</strong> conso{s.nbConsos > 1 ? 's' : ''}</span>
                    <span><strong style={{ color: COL.texte }}>{s.totalGrammes} g</strong></span>
                    <span style={{ marginLeft: 'auto', fontWeight: 700, color: et.accent }}>
                      pic {fmtBac(s.picBac)} g/L {et.emoji}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ margin: '24px 16px 0' }}>
        <button onClick={() => navigate('/pese-alco')} className="pmu-arcade" style={{ width: '100%', background: COL.bleu7 }}>
          Ouvrir le Pèse-Alco
        </button>
      </section>

      <footer style={{ margin: '22px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(243,232,207,0.14)' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2 }}>
          L’ardoise reste sur ton appareil. À consommer avec modération.
        </p>
      </footer>
    </AppShell>
  );
}
