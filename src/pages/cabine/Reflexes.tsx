import { useEffect, useRef, useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';
import { usePeseAlco } from '../../features/pesealco/usePeseAlco';

// ── Le Test de Réflexes ─────────────────────────────────────────────────────
// Tape dès que l'écran passe au vert. Le temps de réaction parle de lui-même…
// surtout quand le Pèse-Alco grimpe.
function verdict(t: number): { t: string; s: string } {
  if (t < 250) return { t: 'Éclair de comptoir', s: 'Réflexes de sniper. Pour l’instant.' };
  if (t < 350) return { t: 'Correct, l’ami', s: 'Encore sobre, on dirait.' };
  if (t < 500) return { t: 'Ça ramollit', s: 'Le bras suit plus trop, hein.' };
  if (t < 800) return { t: 'Pâteux', s: 'T’as touché… trois secondes après.' };
  return { t: 'Comateux', s: 'On te rappellera demain.' };
}

export function Reflexes({ onRetour }: { onRetour: () => void }) {
  const { bac } = usePeseAlco();
  const [phase, setPhase] = useState<'pret' | 'attente' | 'go' | 'resultat' | 'tropvite'>('pret');
  const [ms, setMs] = useState(0);
  const startRef = useRef(0);
  const toRef = useRef<number | undefined>(undefined);

  useEffect(() => () => { if (toRef.current) window.clearTimeout(toRef.current); }, []);

  function lancer() {
    setPhase('attente');
    const delai = 1200 + Math.random() * 2800;
    toRef.current = window.setTimeout(() => { startRef.current = Date.now(); setPhase('go'); }, delai);
  }
  function clic() {
    if (phase === 'attente') {
      if (toRef.current) window.clearTimeout(toRef.current);
      setPhase('tropvite');
      return;
    }
    if (phase === 'go') {
      const t = Date.now() - startRef.current;
      setMs(t);
      setPhase('resultat');
      parlerTavernier(`${t} millisecondes. ${verdict(t).s}`, 0.5, 0.9);
    }
  }

  const v = verdict(ms);
  const bacTxt = bac > 0 ? `À ${bac.toFixed(2).replace('.', ',')} g/L, faut pas viser la médaille.` : 'Et encore, t’es à jeun.';

  return (
    <>
      <Entete titre="Le Test de Réflexes" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">⚡</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Attends que l’écran passe au <strong style={{ color: COL.vert }}>vert</strong>, puis <strong style={{ color: COL.texte }}>tape le plus vite possible</strong>. Plus t’as bu, plus c’est dur…
            </p>
            <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>⚡ Prêt !</button>
          </>
        )}

        {(phase === 'attente' || phase === 'go') && (
          <button onClick={clic}
            style={{ width: '100%', minHeight: 260, borderRadius: 20, border: 'none', marginTop: 6, background: phase === 'go' ? COL.vert : COL.rouge, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem' }}>
            {phase === 'go' ? 'TAPE !' : 'Attends le vert…'}
          </button>
        )}

        {phase === 'tropvite' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.rouge}`, borderRadius: 20, padding: '22px 18px', marginTop: 6 }}>
            <div style={{ fontSize: '2.4rem' }} aria-hidden="true">🤦</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.3rem', color: COL.creme, marginTop: 6 }}>Trop pressé !</div>
            <p style={{ color: COL.texte2, marginTop: 6 }}>T’as tapé avant le vert. Ça sent le verre de trop. <strong style={{ color: COL.or }}>Tu bois.</strong></p>
            <button onClick={lancer} className="pmu-arcade" style={{ marginTop: 14, padding: '0 18px', minHeight: 48 }}>↻ Revanche</button>
          </div>
        )}

        {phase === 'resultat' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 20, padding: '22px 18px', marginTop: 6 }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Temps de réaction</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3.4rem', lineHeight: 1, color: COL.or, marginTop: 4 }}>{ms}<span style={{ fontSize: '1.2rem' }}> ms</span></div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: COL.creme, marginTop: 8 }}>{v.t}</div>
            <p style={{ fontSize: '0.9rem', color: COL.texte2, marginTop: 6 }}>{v.s} {bacTxt}</p>
            <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>↻ Recommencer</button>
          </div>
        )}
      </section>
    </>
  );
}
