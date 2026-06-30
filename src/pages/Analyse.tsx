import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { usePeseAlco } from '../features/pesealco/usePeseAlco';
import { etatBac } from '../features/pesealco/widmark';
import { lireHistorique } from '../features/pesealco/historique';
import { diagnostiquer, tendanceHebdo, alibiAleatoire } from '../features/analyse/diagnostic';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

// Anneau de progression façon montre connectée.
function Anneau({ valeur, max, couleur, taille = 168, epaisseur = 14, centre }: {
  valeur: number; max: number; couleur: string; taille?: number; epaisseur?: number; centre: ReactNode;
}) {
  const rayon = (taille - epaisseur) / 2;
  const circ = 2 * Math.PI * rayon;
  const pct = Math.max(0, Math.min(1, max ? valeur / max : 0));
  return (
    <div style={{ position: 'relative', width: taille, height: taille }}>
      <svg width={taille} height={taille} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx={taille / 2} cy={taille / 2} r={rayon} fill="none" stroke="#2C2722" strokeWidth={epaisseur} />
        <circle cx={taille / 2} cy={taille / 2} r={rayon} fill="none" stroke={couleur} strokeWidth={epaisseur}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 8 }}>
        {centre}
      </div>
    </div>
  );
}

export default function Analyse() {
  const navigate = useNavigate();
  const { consos, picBac, totalGrammes, profil } = usePeseAlco();
  const [histo] = useState(() => lireHistorique());
  const [alibi, setAlibi] = useState(() => alibiAleatoire());

  const d = diagnostiquer(consos, picBac, totalGrammes, profil);
  const tendance = tendanceHebdo(histo);
  const maxPic = Math.max(1, ...tendance.map((t) => t.pic));

  return (
    <AppShell>
      {/* En-tête */}
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '26px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: COL.texte2 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: COL.or }} /> Bilan de performance
        </div>
        <h1 className="pmu-titre" style={{ fontSize: '2rem', marginTop: 10 }}>
          L’<span className="accent">ANALYSE</span>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: COL.texte2, lineHeight: 1.5 }}>
          Diagnostic poussé de ton niveau de pilier. Calculé sérieusement… interprété n’importe comment.
        </p>
      </div>

      {/* Score principal */}
      <section style={{ margin: '22px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Anneau valeur={d.scorePilier} max={100} couleur={d.scoreCouleur} centre={
          <>
            <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3rem', lineHeight: 1, color: d.scoreCouleur }}>{d.scorePilier}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: COL.texte2, marginTop: 4 }}>Forme du pilier</span>
          </>
        } />
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: d.scoreCouleur }}>{d.scoreLabel}</div>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: COL.texte2, maxWidth: '32ch' }}>{d.scoreVerdict}</p>
        </div>
      </section>

      {/* Jauges (anneaux) */}
      <section style={{ margin: '26px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {d.jauges.map((j) => (
          <div key={j.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 6px' }}>
            <Anneau valeur={j.valeur} max={j.max} couleur={j.couleur} taille={84} epaisseur={9} centre={
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem', color: j.couleur, lineHeight: 1 }}>
                {j.valeur}<span style={{ fontSize: '0.6rem' }}>{j.unite}</span>
              </span>
            } />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textAlign: 'center', color: COL.texte, lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{j.label}</span>
            <span style={{ fontSize: '0.66rem', color: COL.texte2, textAlign: 'center', lineHeight: 1.3 }}>{j.verdict}</span>
          </div>
        ))}
      </section>

      {/* Métriques avancées */}
      <section style={{ margin: '26px 16px 0' }}>
        <h2 className="pmu-titre" style={{ fontSize: '1.15rem', marginBottom: 12 }}>Métriques avancées</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {d.metriques.map((m) => (
            <div key={m.label} style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: COL.texte2, lineHeight: 1.25 }}>{m.label}</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.5rem', color: COL.or, margin: '4px 0 2px' }}>{m.valeur}</div>
              <div style={{ fontSize: '0.72rem', color: COL.texte2, lineHeight: 1.35 }}>{m.sous}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tendance de la semaine */}
      <section style={{ margin: '26px 16px 0' }}>
        <h2 className="pmu-titre" style={{ fontSize: '1.15rem', marginBottom: 4 }}>Tendance de la semaine</h2>
        <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: COL.texte2 }}>Charge alcoolique des dernières soirées (pic estimé).</p>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '16px 14px' }}>
          {tendance.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.86rem', color: COL.texte2, textAlign: 'center' }}>
              Pas encore d’historique. Clôture une soirée dans l’Ardoise et la courbe se remplira (le coach est impatient).
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {tendance.map((t, i) => {
                const et = etatBac(t.pic);
                const h = Math.max(6, Math.round((t.pic / maxPic) * 96));
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: '0.62rem', color: COL.texte2 }}>{fmtBac(t.pic)}</span>
                    <div style={{ width: '100%', height: h, background: et.accent, borderRadius: '6px 6px 0 0' }} />
                    <span style={{ fontSize: '0.62rem', color: COL.texte2 }}>{t.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Recommandations du coach */}
      <section style={{ margin: '26px 16px 0' }}>
        <h2 className="pmu-titre" style={{ fontSize: '1.15rem', marginBottom: 12 }}>Le coach recommande</h2>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '8px 16px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {d.recommandations.map((reco, i) => (
              <li key={i} style={{ padding: '12px 0', borderBottom: i < d.recommandations.length - 1 ? `1px solid ${COL.bleu1}` : 'none', fontSize: '0.92rem', color: COL.texte, lineHeight: 1.45 }}>
                {reco}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Alibi du lendemain */}
      <section style={{ margin: '26px 16px 0' }}>
        <h2 className="pmu-titre" style={{ fontSize: '1.15rem', marginBottom: 12 }}>Alibi du lendemain</h2>
        <div className="pmu-ardoise">
          <p className="craie" style={{ margin: 0, fontFamily: FRAUNCES, fontSize: '1.1rem', lineHeight: 1.4 }}>{alibi}</p>
          <button onClick={() => setAlibi(alibiAleatoire())} className="pmu-arcade pmu-arcade--or" style={{ marginTop: 14, padding: '0 18px', minHeight: 48 }}>
            🎲 Un autre alibi
          </button>
        </div>
      </section>

      {/* Avertissement parodie */}
      <section style={{ margin: '24px 16px 0' }}>
        <div style={{ background: COL.orangeClair, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2, lineHeight: 1.55 }}>
            <strong style={{ color: COL.or }}>😄 Pour rire, évidemment.</strong> Ces « analyses » n’ont aucune valeur médicale ni
            scientifique : c’est de la parodie pure. L’abus d’alcool est dangereux pour la santé. Jamais d’alcool au volant.
          </p>
        </div>
      </section>

      <section style={{ margin: '22px 16px 0' }}>
        <button onClick={() => navigate('/pese-alco')} className="pmu-arcade" style={{ width: '100%', background: COL.rougeNeon }}>
          Retour au Pèse-Alco
        </button>
      </section>

      <footer style={{ margin: '22px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(243,232,207,0.14)' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2 }}>
          La Boît’à Soif — analyse de comptoir certifiée 0 % sérieuse.
        </p>
      </footer>
    </AppShell>
  );
}
