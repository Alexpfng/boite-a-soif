import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { useAuth } from '../features/auth/AuthContext';
import { tchin } from '../features/audio/sons';
import {
  rejoindreParCode, lireConcours, lireParticipants, lireScores,
  lancerConcours, avancerManche, terminerConcours, publierScore, abonnerConcours,
  classementCumule, type Concours, type Participant, type Score,
} from '../features/concours/api';

type Fini = (s: number) => void;

// ── Épreuve : Réflexes ──
function Reflexes({ onFini }: { onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'attente' | 'go'>('pret');
  const start = useRef(0); const to = useRef<number>();
  useEffect(() => () => { if (to.current) window.clearTimeout(to.current); }, []);
  function lancer() { setPhase('attente'); to.current = window.setTimeout(() => { start.current = Date.now(); setPhase('go'); }, 1200 + Math.random() * 2600); }
  function clic() { if (phase === 'attente') { if (to.current) window.clearTimeout(to.current); setPhase('pret'); return; } if (phase === 'go') onFini(Date.now() - start.current); }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>⚡ Prêt !</button>;
  return <button onClick={clic} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: phase === 'go' ? COL.vert : COL.rouge, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem' }}>{phase === 'go' ? 'TAPE !' : 'Attends le vert…'}</button>;
}
// ── Épreuve : Tape-max ──
function TapMax({ onFini }: { onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'go'>('pret');
  const [reste, setReste] = useState(5); const [coups, setCoups] = useState(0); const iv = useRef<number>();
  useEffect(() => () => { if (iv.current) window.clearInterval(iv.current); }, []);
  function lancer() { setPhase('go'); setCoups(0); setReste(5); let r = 5; iv.current = window.setInterval(() => { r -= 1; setReste(r); if (r <= 0) { window.clearInterval(iv.current); setPhase('pret'); setCoups((c) => { onFini(c); return c; }); } }, 1000); }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>👊 Go (5 s) !</button>;
  return <button onClick={() => setCoups((c) => c + 1)} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: COL.or, color: '#2A1F10', fontFamily: FRAUNCES, fontWeight: 700 }}><div style={{ fontSize: '3.4rem', lineHeight: 1 }}>{coups}</div><div style={{ fontSize: '1rem', marginTop: 6 }}>TAPE ! ({reste}s)</div></button>;
}
// ── Épreuve : Stop à 5,00 s ──
function ChronoStop({ onFini }: { onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'go'>('pret');
  const [t, setT] = useState(0); const start = useRef(0); const iv = useRef<number>();
  useEffect(() => () => { if (iv.current) window.clearInterval(iv.current); }, []);
  function lancer() { setPhase('go'); start.current = Date.now(); setT(0); iv.current = window.setInterval(() => setT(Date.now() - start.current), 47); }
  function stop() { if (iv.current) window.clearInterval(iv.current); const e = Math.abs((Date.now() - start.current) - 5000); setPhase('pret'); onFini(e); }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>⏱️ Démarrer</button>;
  return <button onClick={stop} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: COL.rougeNeon, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700 }}><div style={{ fontSize: '3.4rem', lineHeight: 1 }}>{(t / 1000).toFixed(2)}s</div><div style={{ fontSize: '1rem', marginTop: 6 }}>STOP à 5,00 !</div></button>;
}
// ── Épreuve : Le Cri de guerre (micro) ──
function Cri({ onFini }: { onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'go' | 'refus'>('pret');
  const [niv, setNiv] = useState(0); const raf = useRef<number>();
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);
  async function lancer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new Ctx(); const src = ctx.createMediaStreamSource(stream); const an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      setPhase('go'); let peak = 0; const t0 = Date.now();
      const tick = () => {
        an.getByteFrequencyData(buf); const avg = buf.reduce((s, x) => s + x, 0) / buf.length; peak = Math.max(peak, avg); setNiv(Math.round(avg));
        if (Date.now() - t0 < 4000) raf.current = requestAnimationFrame(tick);
        else { stream.getTracks().forEach((t) => t.stop()); ctx.close(); setPhase('pret'); onFini(Math.round(peak)); }
      };
      raf.current = requestAnimationFrame(tick);
    } catch { setPhase('refus'); }
  }
  if (phase === 'refus') return <div style={{ color: COL.texte2 }}>Micro refusé/indispo. <button onClick={lancer} className="pmu-arcade" style={{ marginTop: 10, minHeight: 44, padding: '0 14px' }}>Réessayer</button></div>;
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>🗣️ Hurle ! (4 s)</button>;
  return (
    <div style={{ minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontSize: '3rem' }} aria-hidden="true">🗣️</div>
      <div style={{ width: '82%', height: 26, background: COL.panneau, borderRadius: 999, overflow: 'hidden', border: `1px solid ${COL.bleu1}` }}>
        <div style={{ width: `${Math.min(100, niv)}%`, height: '100%', background: niv > 65 ? COL.rouge : COL.or, transition: 'width .05s' }} />
      </div>
      <div style={{ color: COL.creme, fontWeight: 800 }}>PLUS FORT !!!</div>
    </div>
  );
}
// ── Épreuve : mouvement (Shaker / Équilibre) ──
function Mouvement({ consigne, onFini }: { consigne: string; onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'go' | 'refus'>('pret');
  const [reste, setReste] = useState(5);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<{ h?: any; iv?: number; prev?: { x: number; y: number; z: number }; somme: number; recu: boolean }>({ somme: 0, recu: false });
  useEffect(() => () => stop(), []);
  function stop() { const r = ref.current; if (r.h) window.removeEventListener('devicemotion', r.h); if (r.iv) window.clearInterval(r.iv); }
  async function lancer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DM = (window as any).DeviceMotionEvent;
    if (DM && typeof DM.requestPermission === 'function') { try { const p = await DM.requestPermission(); if (p !== 'granted') { setPhase('refus'); return; } } catch { setPhase('refus'); return; } }
    ref.current = { somme: 0, recu: false };
    const h = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity || e.acceleration; if (!a) return; ref.current.recu = true;
      const cur = { x: a.x || 0, y: a.y || 0, z: a.z || 0 }; const p = ref.current.prev;
      if (p) ref.current.somme += Math.abs(cur.x - p.x) + Math.abs(cur.y - p.y) + Math.abs(cur.z - p.z);
      ref.current.prev = cur;
    };
    window.addEventListener('devicemotion', h); ref.current.h = h; setPhase('go'); setReste(5); let s = 5;
    ref.current.iv = window.setInterval(() => { s -= 1; setReste(s); if (s <= 0) { stop(); setPhase('pret'); onFini(ref.current.recu ? Math.round(ref.current.somme) : 0); } }, 1000);
  }
  if (phase === 'refus') return <div style={{ color: COL.texte2 }}>Capteur refusé/indispo (à tester sur téléphone). <button onClick={lancer} className="pmu-arcade" style={{ marginTop: 10, minHeight: 44, padding: '0 14px' }}>Réessayer</button></div>;
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>Go (5 s) !</button>;
  return <div style={{ minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}><div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3.4rem', color: COL.or }}>{reste}</div><div style={{ color: COL.creme, fontWeight: 800 }}>{consigne}</div></div>;
}
// ── Épreuve : Compte à l'aveugle ──
function Blind({ onFini }: { onFini: Fini }) {
  const [phase, setPhase] = useState<'pret' | 'go'>('pret'); const start = useRef(0);
  if (phase === 'pret') return <button onClick={() => { setPhase('go'); start.current = Date.now(); }} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>🕶️ Démarrer (vise 8,00 s)</button>;
  return <button onClick={() => { onFini(Math.abs((Date.now() - start.current) - 8000)); setPhase('pret'); }} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: '#1B1917', color: COL.texte2, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem' }}>Tape à 8,00 s…<br /><span style={{ fontSize: '0.9rem', opacity: 0.55 }}>(aucun compteur, à l’instinct)</span></button>;
}

// Catalogue des épreuves.
const POOL: Record<string, { emoji: string; nom: string; desc: string; asc: boolean; render: (f: Fini) => React.ReactNode }> = {
  reflexes: { emoji: '⚡', nom: 'Réflexes', desc: 'Tape dès que c’est vert.', asc: true, render: (f) => <Reflexes onFini={f} /> },
  tapmax: { emoji: '👊', nom: 'Tape-max', desc: 'Tape un max en 5 s.', asc: false, render: (f) => <TapMax onFini={f} /> },
  chronostop: { emoji: '⏱️', nom: 'Stop à 5,00 s', desc: 'Arrête le chrono près de 5,00 s.', asc: true, render: (f) => <ChronoStop onFini={f} /> },
  cri: { emoji: '🗣️', nom: 'Le Cri de guerre', desc: 'Hurle le plus fort dans le micro !', asc: false, render: (f) => <Cri onFini={f} /> },
  shaker: { emoji: '🍸', nom: 'Le Shaker', desc: 'Secoue le tél comme un cocktail (5 s) !', asc: false, render: (f) => <Mouvement key="sh" consigne="SECOUE À FOND !" onFini={f} /> },
  equilibre: { emoji: '🤸', nom: 'L’Équilibre du pochtron', desc: 'Tiens le tél immobile 5 s. Marche droit !', asc: true, render: (f) => <Mouvement key="eq" consigne="NE BOUGE PLUS…" onFini={f} /> },
  blind: { emoji: '🕶️', nom: 'Le Compte à l’aveugle', desc: 'Tape à 8,00 s… sans compteur !', asc: true, render: (f) => <Blind onFini={f} /> },
};
const DEFAUT = ['reflexes', 'tapmax', 'chronostop'];

export default function ConcoursSalle() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const monId = user?.id ?? '';

  const [id, setId] = useState<string | null>(null);
  const [introuvable, setIntrouvable] = useState(false);
  const [concours, setConcours] = useState<Concours | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  const recharger = useCallback((cid: string) => {
    lireConcours(cid).then(setConcours);
    lireParticipants(cid).then(setParticipants);
    lireScores(cid).then(setScores);
  }, []);

  useEffect(() => {
    let off: (() => void) | undefined;
    rejoindreParCode(code).then((cid) => {
      if (!cid) { setIntrouvable(true); return; }
      setId(cid); recharger(cid); off = abonnerConcours(cid, () => recharger(cid));
    });
    return () => { if (off) off(); };
  }, [code, recharger]);

  useEffect(() => { if (concours?.statut === 'termine') tchin(); }, [concours?.statut]);

  const estHote = concours != null && concours.hote === monId;
  const jeux = concours && concours.jeux && concours.jeux.length ? concours.jeux : DEFAUT;
  const nbManches = jeux.length;
  const manche = concours?.manche ?? 0;
  const asc: Record<number, boolean> = {};
  jeux.forEach((k, i) => { asc[i + 1] = POOL[k]?.asc ?? true; });
  const jaiJoueManche = scores.some((s) => s.user_id === monId && s.manche === manche);
  const nbJoueManche = scores.filter((s) => s.manche === manche).length;
  const rangs = classementCumule(scores, asc);

  async function handleFini(score: number) { if (!id) return; await publierScore(id, manche, score); recharger(id); }

  const cadre = (contenu: React.ReactNode) => (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '20px 22px' }}>
        <button onClick={() => navigate('/concours')} style={{ border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', padding: 0, marginBottom: 6 }}>← Les concours</button>
        <h1 className="pmu-titre" style={{ fontSize: '1.7rem', margin: 0 }}>Tournoi <span className="accent">{code}</span></h1>
      </div>
      <section style={{ margin: '16px 16px 0' }}>{contenu}</section>
    </AppShell>
  );

  if (introuvable) return cadre(<p style={{ color: COL.texte2, lineHeight: 1.5 }}>Ce code ne correspond à aucun tournoi. Vérifie-le, ou crée-en un.</p>);
  if (!concours) return cadre(<p style={{ color: COL.texte2, textAlign: 'center', padding: '20px 0' }}>Connexion au salon… 🍺</p>);

  const classement = (titre: string) => (
    <>
      <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2, margin: '4px 2px 8px' }}>{titre}</div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rangs.map((r, i) => (
          <li key={r.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: r.user_id === monId ? COL.orangeClair : COL.panneau, border: `1px solid ${i === 0 ? COL.or : COL.bleu1}`, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, minWidth: 30 }}>{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
            <span style={{ flex: 1, fontWeight: 800, color: COL.creme }}>{r.pseudo}{r.user_id === monId ? ' ⭐' : ''}</span>
            <span style={{ color: COL.or, fontWeight: 800 }}>{r.points} pts</span>
          </li>
        ))}
        {rangs.length === 0 && <li style={{ color: COL.texte2, textAlign: 'center', padding: '10px 0' }}>Personne n’a encore joué…</li>}
      </ol>
    </>
  );

  if (concours.statut === 'attente') {
    return cadre(
      <>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Code à partager</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 800, fontSize: '2.2rem', color: COL.or, letterSpacing: '0.06em' }}>{concours.code}</div>
          <button onClick={() => { const url = `${window.location.origin}${import.meta.env.BASE_URL}concours/${concours.code}`; if (navigator.share) navigator.share({ title: 'Tournoi Boît’à Soif', text: `Rejoins mon tournoi : ${concours.code}`, url }).catch(() => {}); else navigator.clipboard?.writeText(url); }}
            className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 10, padding: '0 18px', minHeight: 44 }}>📤 Partager</button>
        </div>
        <p style={{ color: COL.texte2, fontSize: '0.86rem', lineHeight: 1.5, margin: '12px 2px 0' }}>🏆 Ce tournoi ({nbManches} manches) : {jeux.map((k) => `${POOL[k]?.emoji || ''} ${POOL[k]?.nom || k}`).join(' · ')}. Points par manche, total = vainqueur.</p>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '16px 2px 8px' }}>Salle d’attente ({participants.length})</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {participants.map((p) => (
            <li key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 12, padding: '10px 12px' }}>
              <span aria-hidden="true">🍺</span><span style={{ fontWeight: 700, color: COL.creme }}>{p.pseudo}{p.user_id === concours.hote ? ' 👑' : ''}</span>
            </li>
          ))}
        </ul>
        {estHote
          ? <button onClick={() => id && lancerConcours(id)} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 60 }}>🚦 Lancer le tournoi</button>
          : <p style={{ color: COL.texte2, textAlign: 'center', marginTop: 18 }}>En attente que l’hôte lance… 🍻</p>}
      </>
    );
  }

  if (concours.statut === 'en_cours') {
    const jeu = POOL[jeux[manche - 1]] || POOL.reflexes;
    return cadre(
      <>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Manche {manche}/{nbManches}</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.creme }}>{jeu.emoji} {jeu.nom}</div>
          <div style={{ fontSize: '0.86rem', color: COL.texte2 }}>{jeu.desc}</div>
        </div>
        {!jaiJoueManche ? (
          <div style={{ textAlign: 'center' }} key={manche}>{jeu.render(handleFini)}</div>
        ) : (
          <>
            <div style={{ textAlign: 'center', color: COL.vert, fontWeight: 700, marginBottom: 10 }}>✅ Manche jouée ! ({nbJoueManche}/{participants.length} ont fini)</div>
            {classement('Classement provisoire')}
          </>
        )}
        {estHote && (
          <div style={{ marginTop: 18 }}>
            {manche < nbManches
              ? <button onClick={() => id && avancerManche(id, manche + 1)} className="pmu-arcade" style={{ width: '100%', minHeight: 52 }}>Manche suivante → ({nbJoueManche}/{participants.length} ont joué)</button>
              : <button onClick={() => id && terminerConcours(id)} className="pmu-arcade pmu-arcade--ardoise" style={{ width: '100%', minHeight: 52 }}>🏁 Terminer & podium final</button>}
          </div>
        )}
      </>
    );
  }

  return cadre(
    <>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.6rem' }} aria-hidden="true">🏆</div>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.or }}>Podium final</h2>
        {rangs[0] && <p style={{ color: COL.creme, marginTop: 4 }}>Champion du tournoi : <strong style={{ color: COL.or }}>{rangs[0].pseudo}</strong> ({rangs[0].points} pts) 🥇</p>}
      </div>
      <div style={{ marginTop: 12 }}>{classement('Classement cumulé')}</div>
      <button onClick={() => navigate('/concours')} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 56 }}>Nouveau tournoi</button>
    </>
  );
}
