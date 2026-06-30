import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier, tchin } from '../../features/audio/sons';

// ── La Rivière 🃏 ────────────────────────────────────────────────────────────
// Remonte la rivière : « plus ou moins » à l'aller, « rouge ou noir » au retour.
// À chaque erreur, tu bois et tu repars du début de la jambe en cours.

interface Carte { v: number; rouge: boolean; symbole: string }
const LONG_ALLER = 5;
const LONG_RETOUR = 5;

function tirer(): Carte {
  const v = 1 + Math.floor(Math.random() * 13);
  const rouge = Math.random() < 0.5;
  const symbole = rouge ? (Math.random() < 0.5 ? '♥' : '♦') : (Math.random() < 0.5 ? '♠' : '♣');
  return { v, rouge, symbole };
}
function rang(v: number): string {
  if (v === 1) return 'A';
  if (v === 11) return 'V';
  if (v === 12) return 'D';
  if (v === 13) return 'R';
  return String(v);
}

export function Riviere({ onRetour }: { onRetour: () => void }) {
  const [carte, setCarte] = useState<Carte>(() => tirer());
  const [jambe, setJambe] = useState<'aller' | 'retour' | 'gagne'>('aller');
  const [etape, setEtape] = useState(0);
  const [gorgees, setGorgees] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  function rater() {
    setGorgees((g) => g + 1);
    setEtape(0);
    setCarte(tirer());
    setMsg('Raté ! 🍺 Tu bois et tu repars du début.');
    parlerTavernier('Raté ! Tu bois, mon grand.', 0.5, 0.95);
  }

  function plusMoins(plus: boolean) {
    const suiv = tirer();
    const bon = suiv.v !== carte.v && (plus ? suiv.v > carte.v : suiv.v < carte.v);
    if (!bon) { rater(); return; }
    const e = etape + 1;
    if (e >= LONG_ALLER) {
      setJambe('retour'); setEtape(0); setCarte(tirer());
      setMsg('Aller bouclé ! 🔄 Phase retour : rouge ou noir.');
      tchin();
    } else {
      setEtape(e); setCarte(suiv); setMsg(null);
    }
  }

  function couleur(rouge: boolean) {
    const suiv = tirer();
    if (suiv.rouge !== rouge) { rater(); return; }
    const e = etape + 1;
    if (e >= LONG_RETOUR) {
      setJambe('gagne'); setCarte(suiv); setMsg(null);
      tchin(); parlerTavernier('Et voilà ! T’as remonté la rivière. La tournée est pour les autres !', 0.5, 0.95);
    } else {
      setEtape(e); setCarte(suiv); setMsg(null);
    }
  }

  function rejouer() { setCarte(tirer()); setJambe('aller'); setEtape(0); setGorgees(0); setMsg(null); }

  const total = jambe === 'retour' ? LONG_RETOUR : LONG_ALLER;
  const btn: React.CSSProperties = { flex: 1, minHeight: 64, borderRadius: 14, border: 'none', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem' };

  return (
    <>
      <Entete titre="La Rivière" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          <strong style={{ color: COL.texte }}>Aller</strong> : la prochaine carte sera-t-elle <em>plus</em> ou <em>moins</em> ? <strong style={{ color: COL.texte }}>Retour</strong> : <em>rouge</em> ou <em>noir</em> ? À chaque erreur, tu bois.
        </p>

        {jambe !== 'gagne' && (
          <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>
            {jambe === 'aller' ? '⬆️ Aller — plus ou moins' : '🔄 Retour — rouge ou noir'} · étape {etape}/{total}
          </div>
        )}

        {/* La carte */}
        <div style={{ margin: '12px auto 0', width: 150, height: 200, borderRadius: 18, background: '#FBF4E2', border: `3px solid ${COL.or}`, boxShadow: '0 6px 18px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', top: 8, left: 12, fontWeight: 800, fontSize: '1.1rem', color: carte.rouge ? '#C62828' : '#1B1917' }}>{rang(carte.v)}</span>
          <span style={{ fontSize: '4.2rem', lineHeight: 1, color: carte.rouge ? '#C62828' : '#1B1917' }}>{carte.symbole}</span>
          <span style={{ position: 'absolute', bottom: 8, right: 12, fontWeight: 800, fontSize: '1.1rem', color: carte.rouge ? '#C62828' : '#1B1917', transform: 'rotate(180deg)' }}>{rang(carte.v)}</span>
        </div>

        {msg && <p style={{ margin: '12px 0 0', color: COL.or, fontWeight: 700 }}>{msg}</p>}

        {jambe === 'aller' && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => plusMoins(true)} style={{ ...btn, background: COL.vert, color: '#1c2414' }}>⬆️ Plus</button>
            <button onClick={() => plusMoins(false)} style={{ ...btn, background: COL.rougeNeon, color: '#fff' }}>⬇️ Moins</button>
          </div>
        )}
        {jambe === 'retour' && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => couleur(true)} style={{ ...btn, background: '#C62828', color: '#fff' }}>🔴 Rouge</button>
            <button onClick={() => couleur(false)} style={{ ...btn, background: '#1B1917', color: '#fff', border: `2px solid ${COL.bleu1}` }}>⚫ Noir</button>
          </div>
        )}
        {jambe === 'gagne' && (
          <div style={{ background: COL.orangeClair, border: `2px solid ${COL.or}`, borderRadius: 18, padding: '20px 16px', marginTop: 16 }}>
            <div style={{ fontSize: '2.6rem' }} aria-hidden="true">🏆🍻</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.creme, marginTop: 6 }}>Rivière remontée !</div>
            <p style={{ color: COL.texte2, marginTop: 6 }}>T’as bu {gorgees} gorgée{gorgees > 1 ? 's' : ''} en route. La tournée est pour les autres.</p>
            <button onClick={rejouer} className="pmu-arcade" style={{ width: '100%', marginTop: 14, minHeight: 56 }}>↻ Rejouer</button>
          </div>
        )}

        {jambe !== 'gagne' && (
          <p style={{ margin: '16px 0 0', fontSize: '0.84rem', color: COL.texte2 }}>🍺 Gorgées bues : <strong style={{ color: COL.or }}>{gorgees}</strong></p>
        )}
      </section>
    </>
  );
}
