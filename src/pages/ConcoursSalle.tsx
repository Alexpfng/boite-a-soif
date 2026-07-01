import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { useAuth } from '../features/auth/AuthContext';
import { tchin } from '../features/audio/sons';
import {
  rejoindreParCode, lireConcours, lireParticipants, lireScores,
  lancerConcours, terminerConcours, publierScore, abonnerConcours,
  type Concours, type Participant, type Score,
} from '../features/concours/api';

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

  const estHote = concours != null && concours.hote === monId;
  const jaiJoue = scores.some((s) => s.user_id === monId);
  const classement = [...scores].sort((a, b) => a.score - b.score); // réflexes : + bas = meilleur

  // ── Épreuve Réflexes ──
  const [phase, setPhase] = useState<'pret' | 'attente' | 'go'>('pret');
  const startRef = useRef(0);
  const toRef = useRef<number | undefined>(undefined);
  useEffect(() => () => { if (toRef.current) window.clearTimeout(toRef.current); }, []);
  useEffect(() => { if (concours?.statut === 'termine') tchin(); }, [concours?.statut]);

  function lancerEpreuve() {
    setPhase('attente');
    toRef.current = window.setTimeout(() => { startRef.current = Date.now(); setPhase('go'); }, 1200 + Math.random() * 2800);
  }
  async function clicEpreuve() {
    if (phase === 'attente') { if (toRef.current) window.clearTimeout(toRef.current); setPhase('pret'); return; }
    if (phase === 'go' && id) {
      const ms = Date.now() - startRef.current;
      setPhase('pret');
      await publierScore(id, ms);
      recharger(id);
    }
  }

  const cadre = (contenu: React.ReactNode) => (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '20px 22px' }}>
        <button onClick={() => navigate('/concours')} style={{ border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', padding: 0, marginBottom: 6 }}>← Les concours</button>
        <h1 className="pmu-titre" style={{ fontSize: '1.7rem', margin: 0 }}>Concours <span className="accent">{code}</span></h1>
      </div>
      <section style={{ margin: '16px 16px 0' }}>{contenu}</section>
    </AppShell>
  );

  if (introuvable) return cadre(<p style={{ color: COL.texte2, lineHeight: 1.5 }}>Ce code ne correspond à aucun concours. Vérifie-le, ou crée-en un nouveau.</p>);
  if (!concours) return cadre(<p style={{ color: COL.texte2, textAlign: 'center', padding: '20px 0' }}>Connexion au salon… 🍺</p>);

  const listeClassement = (
    <ol style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {classement.map((s, i) => (
        <li key={s.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: s.user_id === monId ? COL.orangeClair : COL.panneau, border: `1px solid ${i === 0 ? COL.or : COL.bleu1}`, borderRadius: 12, padding: '10px 12px' }}>
          <span className="craie-accent" style={{ fontFamily: 'monospace', fontWeight: 800, minWidth: 30 }}>{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontWeight: 800, color: COL.creme }}>{s.pseudo}{s.user_id === monId ? ' ⭐' : ''}</span>
          <span style={{ color: COL.or, fontWeight: 800 }}>{s.score} ms</span>
        </li>
      ))}
      {classement.length === 0 && <li style={{ color: COL.texte2, textAlign: 'center', padding: '10px 0' }}>Personne n’a encore joué…</li>}
    </ol>
  );

  // ── ATTENTE ──
  if (concours.statut === 'attente') {
    return cadre(
      <>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Code à partager</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 800, fontSize: '2.2rem', color: COL.or, letterSpacing: '0.06em' }}>{concours.code}</div>
          <button onClick={() => { const url = `${window.location.origin}${import.meta.env.BASE_URL}concours/${concours.code}`; if (navigator.share) navigator.share({ title: 'Concours Boît’à Soif', text: `Rejoins mon concours : ${concours.code}`, url }).catch(() => {}); else navigator.clipboard?.writeText(url); }}
            className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 10, padding: '0 18px', minHeight: 44 }}>📤 Partager</button>
        </div>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '18px 2px 8px' }}>Salle d’attente ({participants.length})</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {participants.map((p) => (
            <li key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 12, padding: '10px 12px' }}>
              <span aria-hidden="true">🍺</span><span style={{ fontWeight: 700, color: COL.creme }}>{p.pseudo}{p.user_id === concours.hote ? ' 👑' : ''}</span>
            </li>
          ))}
        </ul>
        {estHote ? (
          <button onClick={() => id && lancerConcours(id)} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 60 }} disabled={participants.length < 1}>🚦 Lancer le concours</button>
        ) : (
          <p style={{ color: COL.texte2, textAlign: 'center', marginTop: 18 }}>En attente que l’hôte lance… 🍻</p>
        )}
      </>
    );
  }

  // ── EN COURS ──
  if (concours.statut === 'en_cours') {
    return cadre(
      <>
        {!jaiJoue ? (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.2rem', color: COL.creme, margin: '0 0 10px' }}>⚡ Épreuve Réflexes</h2>
            {phase === 'pret' && (
              <>
                <p style={{ color: COL.texte2, lineHeight: 1.5 }}>Attends le <strong style={{ color: COL.vert }}>vert</strong>, tape le plus vite possible. Une seule tentative comptée !</p>
                <button onClick={lancerEpreuve} className="pmu-arcade" style={{ width: '100%', marginTop: 16, minHeight: 64 }}>⚡ Prêt !</button>
              </>
            )}
            {(phase === 'attente' || phase === 'go') && (
              <button onClick={clicEpreuve} style={{ width: '100%', minHeight: 240, borderRadius: 20, border: 'none', marginTop: 8, background: phase === 'go' ? COL.vert : COL.rouge, color: '#fff', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem' }}>
                {phase === 'go' ? 'TAPE !' : 'Attends le vert…'}
              </button>
            )}
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.2rem', color: COL.creme, margin: 0, textAlign: 'center' }}>Ton score est envoyé ! Classement en direct :</h2>
            {listeClassement}
          </>
        )}
        {estHote && (
          <button onClick={() => id && terminerConcours(id)} className="pmu-arcade pmu-arcade--ardoise" style={{ width: '100%', marginTop: 18, minHeight: 52 }}>🏁 Terminer & voir le podium</button>
        )}
      </>
    );
  }

  // ── TERMINÉ ──
  return cadre(
    <>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.6rem' }} aria-hidden="true">🏆</div>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.or }}>Podium</h2>
        {classement[0] && <p style={{ color: COL.creme, marginTop: 4 }}>Vainqueur : <strong style={{ color: COL.or }}>{classement[0].pseudo}</strong> ({classement[0].score} ms) 🥇</p>}
      </div>
      {listeClassement}
      <button onClick={() => navigate('/concours')} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 56 }}>Nouveau concours</button>
    </>
  );
}
