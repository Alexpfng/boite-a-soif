import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { creerConcours, type Mode } from '../features/concours/api';

const MODES: { cle: Mode; emoji: string; nom: string; desc: string; actif: boolean }[] = [
  { cle: 'reflexes', emoji: '⚡', nom: 'Tournoi Réflexes', desc: 'Le plus rapide au vert gagne.', actif: true },
  { cle: 'repliques', emoji: '🎤', nom: 'Duel de répliques', desc: 'La vanne la plus votée l’emporte.', actif: false },
  { cle: 'quiz', emoji: '🧠', nom: 'Quiz live', desc: 'Tout le monde répond en même temps.', actif: false },
];

export default function Concours() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function creer(mode: Mode) {
    setEnCours(true); setErr(null);
    const c = await creerConcours(mode);
    setEnCours(false);
    if (!c) { setErr('Impossible de créer le concours. Réessaie.'); return; }
    navigate(`/concours/${c.code}`);
  }
  function rejoindre() {
    const c = code.trim().toUpperCase();
    if (c.length < 3) { setErr('Entre un code valide.'); return; }
    navigate(`/concours/${c}`);
  }

  return (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '24px 22px 22px' }}>
        <h1 className="pmu-titre" style={{ fontSize: '1.95rem' }}>LES <span className="accent">CONCOURS</span></h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: COL.texte2, lineHeight: 1.5 }}>
          Défie tes potes : crée un concours, partage le code, et que le meilleur gagne.
        </p>
      </div>

      {err && <div role="alert" style={{ margin: '14px 16px 0', background: '#341F1B', border: `1px solid ${COL.rouge}`, color: '#f3c7bd', borderRadius: 12, padding: '12px 14px', fontSize: '0.9rem' }}>{err}</div>}

      <section style={{ margin: '18px 16px 0' }}>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.15rem', color: COL.or, margin: '0 2px 10px' }}>Lancer un concours</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MODES.map((m) => (
            <button key={m.cle} disabled={!m.actif || enCours} onClick={() => creer(m.cle)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', background: m.actif ? COL.panneau : '#171310', border: `1px solid ${m.actif ? COL.or : COL.bleu1}`, borderRadius: 16, padding: '14px 16px', color: COL.creme, opacity: m.actif ? 1 : 0.55 }}>
              <span style={{ fontSize: '1.8rem' }} aria-hidden="true">{m.emoji}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem' }}>{m.nom}{!m.actif && ' — bientôt'}</span>
                <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 2 }}>{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ margin: '24px 16px 0' }}>
        <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.15rem', color: COL.or, margin: '0 2px 10px' }}>Rejoindre par code</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PMU-1234" autoCapitalize="characters"
            style={{ flex: 1, minHeight: 54, padding: '12px 16px', fontSize: '1.05rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 14, color: COL.creme }} />
          <button onClick={rejoindre} className="pmu-arcade" style={{ padding: '0 18px', minHeight: 54 }}>Rejoindre</button>
        </div>
      </section>

      <section style={{ margin: '24px 16px 0' }}>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '0.84rem', color: COL.texte2, lineHeight: 1.55 }}>
            🏆 On se mesure sur l’adresse et le fun, jamais sur qui boit le plus. L’abus d’alcool est dangereux.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
