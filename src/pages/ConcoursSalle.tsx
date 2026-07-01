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

// Les 3 manches du tournoi (asc = plus petit = meilleur).
const MANCHES = [
  { emoji: '⚡', nom: 'Réflexes', desc: 'Tape dès que c’est vert.', asc: true, unite: 'ms' },
  { emoji: '👊', nom: 'Tape-max', desc: 'Tape le plus possible en 5 s.', asc: false, unite: 'coups' },
  { emoji: '⏱️', nom: 'Stop à 5,00 s', desc: 'Arrête le chrono le plus près de 5,00 s.', asc: true, unite: 'ms d’écart' },
];
const ASC: Record<number, boolean> = { 1: true, 2: false, 3: true };
const NB_MANCHES = MANCHES.length;

// ── Manche 1 : Réflexes ──
function Reflexes({ onFini }: { onFini: (s: number) => void }) {
  const [phase, setPhase] = useState<'pret' | 'attente' | 'go'>('pret');
  const start = useRef(0); const to = useRef<number>();
  useEffect(() => () => { if (to.current) window.clearTimeout(to.current); }, []);
  function lancer() { setPhase('attente'); to.current = window.setTimeout(() => { start.current = Date.now(); setPhase('go'); }, 1200 + Math.random() * 2600); }
  function clic() {
    if (phase === 'attente') { if (to.current) window.clearTimeout(to.current); setPhase('pret'); return; }
    if (phase === 'go') onFini(Date.now() - start.current);
  }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>⚡ Prêt !</button>;
  return <button onClick={clic} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: phase === 'go' ? COL.vert : COL.rouge, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem' }}>{phase === 'go' ? 'TAPE !' : 'Attends le vert…'}</button>;
}
// ── Manche 2 : Tape-max ──
function TapMax({ onFini }: { onFini: (s: number) => void }) {
  const [phase, setPhase] = useState<'pret' | 'go'>('pret');
  const [reste, setReste] = useState(5);
  const [coups, setCoups] = useState(0);
  const iv = useRef<number>();
  useEffect(() => () => { if (iv.current) window.clearInterval(iv.current); }, []);
  function lancer() {
    setPhase('go'); setCoups(0); setReste(5);
    let r = 5;
    iv.current = window.setInterval(() => { r -= 1; setReste(r); if (r <= 0) { window.clearInterval(iv.current); setPhase('pret'); setCoups((c) => { onFini(c); return c; }); } }, 1000);
  }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>👊 Go (5 s) !</button>;
  return (
    <button onClick={() => setCoups((c) => c + 1)} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: COL.or, color: '#2A1F10', fontFamily: FRAUNCES, fontWeight: 700 }}>
      <div style={{ fontSize: '3.4rem', lineHeight: 1 }}>{coups}</div>
      <div style={{ fontSize: '1rem', marginTop: 6 }}>TAPE ! ({reste}s)</div>
    </button>
  );
}
// ── Manche 3 : Stop à 5,00 s ──
function ChronoStop({ onFini }: { onFini: (s: number) => void }) {
  const [phase, setPhase] = useState<'pret' | 'go'>('pret');
  const [t, setT] = useState(0);
  const start = useRef(0); const iv = useRef<number>();
  useEffect(() => () => { if (iv.current) window.clearInterval(iv.current); }, []);
  function lancer() { setPhase('go'); start.current = Date.now(); setT(0); iv.current = window.setInterval(() => setT(Date.now() - start.current), 47); }
  function stop() { if (iv.current) window.clearInterval(iv.current); const e = Math.abs((Date.now() - start.current) - 5000); setPhase('pret'); onFini(e); }
  if (phase === 'pret') return <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', minHeight: 64 }}>⏱️ Démarrer</button>;
  return (
    <button onClick={stop} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', background: COL.rougeNeon, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700 }}>
      <div style={{ fontSize: '3.4rem', lineHeight: 1 }}>{(t / 1000).toFixed(2)}s</div>
      <div style={{ fontSize: '1rem', marginTop: 6 }}>STOP à 5,00 !</div>
    </button>
  );
}

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
      setId(cid);
      recharger(cid);
      off = abonnerConcours(cid, () => recharger(cid));
    });
    return () => { if (off) off(); };
  }, [code, recharger]);

  useEffect(() => { if (concours?.statut === 'termine') tchin(); }, [concours?.statut]);

  const estHote = concours != null && concours.hote === monId;
  const manche = concours?.manche ?? 0;
  const jaiJoueManche = scores.some((s) => s.user_id === monId && s.manche === manche);
  const nbJoueManche = scores.filter((s) => s.manche === manche).length;
  const rangs = classementCumule(scores, ASC);

  async function handleFini(score: number) {
    if (!id) return;
    await publierScore(id, manche, score);
    recharger(id);
  }

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

  // ── ATTENTE ──
  if (concours.statut === 'attente') {
    return cadre(
      <>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Code à partager</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 800, fontSize: '2.2rem', color: COL.or, letterSpacing: '0.06em' }}>{concours.code}</div>
          <button onClick={() => { const url = `${window.location.origin}${import.meta.env.BASE_URL}concours/${concours.code}`; if (navigator.share) navigator.share({ title: 'Tournoi Boît’à Soif', text: `Rejoins mon tournoi : ${concours.code}`, url }).catch(() => {}); else navigator.clipboard?.writeText(url); }}
            className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 10, padding: '0 18px', minHeight: 44 }}>📤 Partager</button>
        </div>
        <p style={{ color: COL.texte2, fontSize: '0.86rem', lineHeight: 1.5, margin: '12px 2px 0' }}>🏆 3 manches qui s’enchaînent : {MANCHES.map((m) => `${m.emoji} ${m.nom}`).join(' · ')}. Points par manche, total = vainqueur.</p>
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

  // ── EN COURS ──
  if (concours.statut === 'en_cours') {
    const m = MANCHES[manche - 1];
    return cadre(
      <>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Manche {manche}/{NB_MANCHES}</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.creme }}>{m.emoji} {m.nom}</div>
          <div style={{ fontSize: '0.86rem', color: COL.texte2 }}>{m.desc}</div>
        </div>
        {!jaiJoueManche ? (
          <div style={{ textAlign: 'center' }}>
            {manche === 1 && <Reflexes key="1" onFini={handleFini} />}
            {manche === 2 && <TapMax key="2" onFini={handleFini} />}
            {manche === 3 && <ChronoStop key="3" onFini={handleFini} />}
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', color: COL.vert, fontWeight: 700, marginBottom: 10 }}>✅ Manche jouée ! ({nbJoueManche}/{participants.length} ont fini)</div>
            {classement('Classement provisoire')}
          </>
        )}
        {estHote && (
          <div style={{ marginTop: 18 }}>
            {manche < NB_MANCHES
              ? <button onClick={() => id && avancerManche(id, manche + 1)} className="pmu-arcade" style={{ width: '100%', minHeight: 52 }}>Manche suivante → ({nbJoueManche}/{participants.length} ont joué)</button>
              : <button onClick={() => id && terminerConcours(id)} className="pmu-arcade pmu-arcade--ardoise" style={{ width: '100%', minHeight: 52 }}>🏁 Terminer & podium final</button>}
          </div>
        )}
      </>
    );
  }

  // ── TERMINÉ ──
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
