import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { parlerTavernier } from '../features/audio/sons';
import { etatBac, paramsIvresse, bredouiller } from '../features/pesealco/widmark';
import { reponsePatron } from '../features/cabine/oracle';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

type Vue = 'menu' | 'souffle' | 'equilibre' | 'patron';

export default function Cabine() {
  const navigate = useNavigate();
  const [vue, setVue] = useState<Vue>('menu');

  return (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '24px 22px 22px' }}>
        <h1 className="pmu-titre" style={{ fontSize: '1.95rem' }}>
          LA <span className="accent">CABINE</span>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: COL.texte2, lineHeight: 1.5 }}>
          Les petits numéros du comptoir. À faire sur téléphone, c’est meilleur.
        </p>
      </div>

      {vue === 'menu' && (
        <>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '18px 16px 0' }}>
            <Tuile emoji="🎤" titre="L’Éthylotest à souffle" desc="Souffle dans le micro… le verdict tombe." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('souffle')} />
            <Tuile emoji="📳" titre="Le test d’équilibre" desc="Tiens le téléphone immobile 5 secondes. On verra bien." bg={COL.or} fg="#2A1F10" onClick={() => setVue('equilibre')} />
            <Tuile emoji="🔮" titre="Demande au patron" desc="Pose ta question. Le patron tranche (à sa façon)." bg={COL.ambre} fg="#2A1F10" onClick={() => setVue('patron')} />
          </nav>
          <section style={{ margin: '24px 16px 0' }}>
            <div style={{ background: COL.orangeClair, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2, lineHeight: 1.55 }}>
                <strong style={{ color: COL.or }}>🤡 100 % pour rire.</strong> Ces tests n’ont aucune valeur :
                un éthylotest certifié, ça ne se souffle pas dans un téléphone. L’abus d’alcool est dangereux. Jamais au volant.
              </p>
            </div>
          </section>
          <div style={{ margin: '22px 16px 0' }}>
            <button onClick={() => navigate('/app')} className="pmu-arcade pmu-arcade--ardoise" style={{ width: '100%' }}>
              Retour au comptoir
            </button>
          </div>
        </>
      )}

      {vue === 'souffle' && <Souffle onRetour={() => setVue('menu')} />}
      {vue === 'equilibre' && <Equilibre onRetour={() => setVue('menu')} />}
      {vue === 'patron' && <Patron onRetour={() => setVue('menu')} />}
    </AppShell>
  );
}

function Tuile({ emoji, titre, desc, bg, fg, onClick }: {
  emoji: string; titre: string; desc: string; bg: string; fg: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
      background: bg, color: fg, border: 'none', borderRadius: 18, padding: '18px 18px',
      boxShadow: '0 5px 0 rgba(0,0,0,0.45)',
    }}>
      <span style={{ fontSize: '2.1rem', lineHeight: 1 }} aria-hidden="true">{emoji}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.01em' }}>{titre}</span>
        <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.9, marginTop: 2 }}>{desc}</span>
      </span>
    </button>
  );
}

function Entete({ titre, onRetour }: { titre: string; onRetour: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 16px 0' }}>
      <button onClick={onRetour} aria-label="Retour" style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${COL.bleu1}`, background: COL.panneau, color: COL.or, fontSize: '1.2rem', fontWeight: 800 }}>‹</button>
      <h2 className="pmu-titre" style={{ fontSize: '1.25rem' }}>{titre}</h2>
    </div>
  );
}

// ── 1) Éthylotest à souffle ────────────────────────────────────────────────
function Souffle({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'mesure' | 'resultat' | 'refus'>('pret');
  const [niveau, setNiveau] = useState(0);
  const [taux, setTaux] = useState(0);
  const ref = useRef<{ ctx?: AudioContext; stream?: MediaStream; raf?: number }>({});

  useEffect(() => () => nettoyer(), []);
  function nettoyer() {
    const r = ref.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    r.stream?.getTracks().forEach((t) => t.stop());
    r.ctx?.close().catch(() => {});
    ref.current = {};
  }

  async function souffler() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      ref.current = { ctx, stream };
      setPhase('mesure');
      setNiveau(0);

      const data = new Uint8Array(an.frequencyBinCount);
      const t0 = performance.now();
      let peak = 0, somme = 0, n = 0;
      const tick = () => {
        an.getByteTimeDomainData(data);
        let s = 0;
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; s += v * v; }
        const rms = Math.sqrt(s / data.length);
        peak = Math.max(peak, rms); somme += rms; n++;
        setNiveau(Math.min(1, rms * 4));
        if (performance.now() - t0 < 3000) {
          ref.current.raf = requestAnimationFrame(tick);
        } else {
          const moy = somme / Math.max(1, n);
          const score = Math.min(1, peak * 0.6 + moy * 4);
          const t = Math.round(score * 380) / 100; // 0 → 3,8 g/L (totalement bidon)
          nettoyer();
          setTaux(t);
          setPhase('resultat');
          const et = etatBac(t);
          const v = paramsIvresse(t);
          parlerTavernier(bredouiller(et.annonce, t), v.pitch, v.rate);
        }
      };
      ref.current.raf = requestAnimationFrame(tick);
    } catch {
      setPhase('refus');
    }
  }

  return (
    <>
      <Entete titre="L’Éthylotest à souffle" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">🎤</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Approche le téléphone de ta bouche et <strong style={{ color: COL.texte }}>souffle fort pendant 3 secondes</strong> au signal.
            </p>
            <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>
              🌬️ Je souffle !
            </button>
          </>
        )}

        {phase === 'mesure' && (
          <>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.or }}>Souffle… souffle… !</div>
            <div style={{ height: 26, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 999, overflow: 'hidden', marginTop: 18 }}>
              <div style={{ height: '100%', width: `${Math.round(niveau * 100)}%`, background: COL.rougeNeon, transition: 'width .08s linear' }} />
            </div>
            <p style={{ color: COL.texte2, marginTop: 12, fontSize: '0.85rem' }}>Le souffle-o-mètre te jauge…</p>
          </>
        )}

        {phase === 'resultat' && (() => {
          const et = etatBac(taux);
          return (
            <div style={{ background: et.fond, border: `2px solid ${et.accent}`, borderRadius: 20, padding: '22px 18px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Verdict du souffle</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3.4rem', lineHeight: 1, color: et.accent, marginTop: 6 }}>{fmtBac(taux)} <span style={{ fontSize: '1rem' }}>g/L</span></div>
              <div style={{ fontSize: '2rem', marginTop: 8 }} aria-hidden="true">{et.emoji}</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: et.texteSur, marginTop: 4 }}>{et.titre}</div>
              <p style={{ fontSize: '0.8rem', color: COL.texte2, marginTop: 10 }}>Mesure 100 % fantaisiste, évidemment. 😉</p>
              <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>🌬️ Re-souffler</button>
            </div>
          );
        })()}

        {phase === 'refus' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '18px 16px' }}>
            <p style={{ margin: 0, color: COL.texte, lineHeight: 1.5 }}>🎤 Pas d’accès au micro. Autorise le microphone (ou réessaie sur ton téléphone) pour souffler dans la machine.</p>
            <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>Réessayer</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 2) Test d'équilibre ────────────────────────────────────────────────────
function Equilibre({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'mesure' | 'resultat' | 'refus'>('pret');
  const [reste, setReste] = useState(5);
  const [grade, setGrade] = useState('A');
  const ref = useRef<{ handler?: (e: DeviceMotionEvent) => void; timer?: number; prev?: { x: number; y: number; z: number }; somme: number; n: number; recu: boolean }>({ somme: 0, n: 0, recu: false });

  useEffect(() => () => stop(), []);
  function stop() {
    const r = ref.current;
    if (r.handler) window.removeEventListener('devicemotion', r.handler);
    if (r.timer) window.clearInterval(r.timer);
  }

  const VERDICTS: Record<string, { titre: string; sous: string }> = {
    A: { titre: 'Stable comme un roc', sous: 'Trop stable, même. T’as vraiment bu, toi ?' },
    B: { titre: 'Léger roulis', sous: 'Rien à signaler, marin d’eau douce.' },
    C: { titre: 'Ça tangue gentiment', sous: 'Le pont bouge un peu, capitaine.' },
    D: { titre: 'Houla, ça remue', sous: 'Le sol fait des vagues, hein ?' },
    E: { titre: 'Démarche en crabe', sous: 'Tiens-toi au comptoir, mon grand.' },
    F: { titre: 'Niveau chamallow', sous: 'Assieds-toi. Tout de suite.' },
  };

  async function tester() {
    const DM = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
    if (DM && typeof DM.requestPermission === 'function') {
      try {
        const p = await DM.requestPermission();
        if (p !== 'granted') { setPhase('refus'); return; }
      } catch { setPhase('refus'); return; }
    }
    ref.current = { somme: 0, n: 0, recu: false };
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a) return;
      ref.current.recu = true;
      const cur = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
      const p = ref.current.prev;
      if (p) {
        ref.current.somme += Math.abs(cur.x - p.x) + Math.abs(cur.y - p.y) + Math.abs(cur.z - p.z);
        ref.current.n++;
      }
      ref.current.prev = cur;
    };
    window.addEventListener('devicemotion', handler);
    ref.current.handler = handler;
    setPhase('mesure');
    setReste(5);
    let s = 5;
    ref.current.timer = window.setInterval(() => {
      s -= 1;
      setReste(s);
      if (s <= 0) {
        stop();
        if (!ref.current.recu) { setPhase('refus'); return; }
        const moy = ref.current.somme / Math.max(1, ref.current.n);
        const g = moy < 0.25 ? 'A' : moy < 0.6 ? 'B' : moy < 1.1 ? 'C' : moy < 2 ? 'D' : moy < 3.5 ? 'E' : 'F';
        setGrade(g);
        setPhase('resultat');
        parlerTavernier(`Stabilité : ${g}. ${VERDICTS[g].sous}`, 0.5, 0.9);
      }
    }, 1000);
  }

  return (
    <>
      <Entete titre="Le test d’équilibre" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">📳</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Tends le bras et <strong style={{ color: COL.texte }}>tiens le téléphone le plus immobile possible 5 secondes</strong>. La machine juge ton tremblement.
            </p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>📳 Je me teste !</button>
          </>
        )}

        {phase === 'mesure' && (
          <>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4rem', color: COL.or, lineHeight: 1 }}>{reste}</div>
            <p style={{ color: COL.texte2, marginTop: 10 }}>Ne bouge plus… on te scanne.</p>
          </>
        )}

        {phase === 'resultat' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 20, padding: '22px 18px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Stabilité posturale</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4rem', lineHeight: 1, color: COL.or, marginTop: 4 }}>{grade}</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: COL.creme, marginTop: 8 }}>{VERDICTS[grade].titre}</div>
            <p style={{ fontSize: '0.9rem', color: COL.texte2, marginTop: 6 }}>{VERDICTS[grade].sous}</p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>📳 Recommencer</button>
          </div>
        )}

        {phase === 'refus' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '18px 16px' }}>
            <p style={{ margin: 0, color: COL.texte, lineHeight: 1.5 }}>📳 Capteur de mouvement indisponible (ou refusé). Ce test, c’est <strong>sur téléphone</strong> que ça se passe — autorise le mouvement et réessaie.</p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>Réessayer</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 3) Demande au patron ───────────────────────────────────────────────────
function Patron({ onRetour }: { onRetour: () => void }) {
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState<string | null>(null);

  function demander() {
    const r = reponsePatron();
    setReponse(r);
    parlerTavernier(r, 0.5, 0.9);
  }

  return (
    <>
      <Entete titre="Demande au patron" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0' }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pose ta question au patron…"
          style={{ width: '100%', minHeight: 54, padding: '12px 16px', fontSize: '1rem', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 14, color: COL.texte }}
        />
        <button onClick={demander} className="pmu-arcade" style={{ width: '100%', marginTop: 12, minHeight: 60 }}>
          🔮 Demander au patron
        </button>

        {reponse && (
          <div className="pmu-ardoise" style={{ marginTop: 18 }}>
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Le patron a parlé</div>
            <p className="craie" style={{ margin: '10px 0 0', fontFamily: FRAUNCES, fontSize: '1.2rem', lineHeight: 1.4 }}>« {reponse} »</p>
          </div>
        )}

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Le patron répond ce qu’il veut, quand il veut. La question, c’est surtout pour la forme.
        </p>
      </section>
    </>
  );
}
