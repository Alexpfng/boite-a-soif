import { useEffect, useRef, useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Niveau à Bulle « es-tu droit ? » ─────────────────────────────────────
// Vrai niveau à bulle via l'inclinaison du téléphone (DeviceOrientation).
// Posé à plat : bulle centrée = t'es d'aplomb. Sinon, le comptoir le sent.
export function NiveauABulle({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'actif' | 'refus'>('pret');
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const lastRef = useRef(0);

  useEffect(() => () => arreter(), []);
  function arreter() {
    if (handlerRef.current) {
      window.removeEventListener('deviceorientation', handlerRef.current);
      handlerRef.current = null;
    }
  }

  async function demarrer() {
    const DO = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    if (DO && typeof DO.requestPermission === 'function') {
      try {
        const p = await DO.requestPermission();
        if (p !== 'granted') { setPhase('refus'); return; }
      } catch { setPhase('refus'); return; }
    }
    let recu = false;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta == null && e.gamma == null) return;
      recu = true;
      const now = Date.now();
      if (now - lastRef.current < 60) return;
      lastRef.current = now;
      setTilt({
        x: Math.max(-45, Math.min(45, e.gamma || 0)),
        y: Math.max(-45, Math.min(45, e.beta || 0)),
      });
    };
    window.addEventListener('deviceorientation', handler);
    handlerRef.current = handler;
    setPhase('actif');
    window.setTimeout(() => { if (!recu) { arreter(); setPhase('refus'); } }, 1600);
  }

  const ecart = Math.min(45, Math.hypot(tilt.x, tilt.y));
  const droiture = Math.round(100 - (ecart / 45) * 100);
  const verdict = ecart < 4 ? { t: 'Droit comme un i', s: 'Trop droit, même. T’as vraiment bu, toi ?' }
    : ecart < 10 ? { t: 'À peu près d’aplomb', s: 'Ça passe, marin d’eau douce.' }
      : ecart < 20 ? { t: 'Ça penche, hein', s: 'Le comptoir tangue un peu.' }
        : ecart < 32 ? { t: 'Tour de Pise', s: 'Accroche-toi au zinc, capitaine.' }
          : { t: 'Niveau chamallow', s: 'Assieds-toi. Tout de suite.' };

  const R = 90;
  const bx = (tilt.x / 45) * R;
  const by = (tilt.y / 45) * R;
  const couleurBulle = ecart < 10 ? COL.vert : ecart < 25 ? COL.ambre : COL.rouge;

  return (
    <>
      <Entete titre="Le Niveau à Bulle" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">🫧</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Pose le téléphone <strong style={{ color: COL.texte }}>à plat sur ta main</strong>. Si la bulle reste au centre, t’es d’aplomb. Sinon… on saura.
            </p>
            <button onClick={demarrer} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>🫧 Suis-je droit ?</button>
          </>
        )}

        {phase === 'actif' && (
          <>
            <div style={{ position: 'relative', width: 220, height: 220, margin: '6px auto 0', borderRadius: '50%', background: COL.panneau, border: `2px solid ${COL.bleu1}`, boxShadow: 'inset 0 0 30px rgba(0,0,0,0.55)' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 54, height: 54, marginLeft: -27, marginTop: -27, borderRadius: '50%', border: `2px dashed ${COL.or}` }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: '50%', background: couleurBulle, transform: `translate(${bx}px, ${by}px)`, transition: 'transform 0.08s linear', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }} />
            </div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.4rem', color: COL.or, marginTop: 14, lineHeight: 1 }}>{droiture}%</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.2rem', color: COL.creme, marginTop: 4 }}>{verdict.t}</div>
            <p style={{ fontSize: '0.9rem', color: COL.texte2, marginTop: 4 }}>{verdict.s}</p>
            <button onClick={() => parlerTavernier(`Droiture : ${droiture} pour cent. ${verdict.s}`, 0.5, 0.9)} className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 14, padding: '0 18px', minHeight: 48 }}>🔊 Verdict du comptoir</button>
          </>
        )}

        {phase === 'refus' && (
          <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '18px 16px', marginTop: 10 }}>
            <p style={{ color: COL.texte2, lineHeight: 1.5, margin: 0 }}>
              Pas de capteur d’inclinaison ici (ou autorisation refusée). À tester sur ton téléphone, en acceptant l’accès au mouvement.
            </p>
            <button onClick={() => setPhase('pret')} className="pmu-arcade" style={{ marginTop: 14, padding: '0 18px', minHeight: 48 }}>← Réessayer</button>
          </div>
        )}
      </section>
    </>
  );
}
