import { useState, useRef, useEffect } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Détecteur de Mytho (polygraphe de comptoir, 100 % bidon) ──────────────

type Verdict = {
  cle: 'verite' | 'mytho';
  emoji: string;
  titre: string;
  annonce: string;
  couleur: string;
  commentaires: string[];
};

const VERDICTS: Verdict[] = [
  {
    cle: 'verite',
    emoji: '✅',
    titre: 'VÉRITÉ',
    annonce: 'Vérité !',
    couleur: COL.vert,
    commentaires: [
      'Parole d’évangile, le polygraphe est formel.',
      'Honnête comme un demi sans faux-col.',
      'Rien à signaler, le comptoir te croit sur parole.',
      'C’est limpide comme une eau gazeuse.',
    ],
  },
  {
    cle: 'mytho',
    emoji: '🤥',
    titre: 'MYTHO',
    annonce: 'Mytho total !',
    couleur: COL.rougeNeon,
    commentaires: [
      'Plus gros mensonge que la mousse d’une pression mal tirée.',
      'Le nez s’allonge à vue d’œil, mon grand.',
      'On t’a vu venir à trois tournées de distance.',
      'Même le percolateur n’y croit pas une seconde.',
    ],
  },
];

const piocher = <T,>(liste: T[]): T => liste[Math.floor(Math.random() * liste.length)];

export function Mytho({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'scan' | 'resultat'>('pret');
  const [verdict, setVerdict] = useState<Verdict>(VERDICTS[0]);
  const [commentaire, setCommentaire] = useState('');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function analyser() {
    if (timer.current) window.clearTimeout(timer.current);
    setPhase('scan');
    timer.current = window.setTimeout(() => {
      const v = piocher(VERDICTS);
      const c = piocher(v.commentaires);
      setVerdict(v);
      setCommentaire(c);
      setPhase('resultat');
      parlerTavernier(`${v.annonce} ${c}`, 0.5, 0.95);
    }, 1600);
  }

  return (
    <>
      <Entete titre="Le Détecteur de Mytho" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">🕵️</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Fais répondre un pote à une question, puis lance l’analyse.
            </p>
            <button onClick={analyser} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>
              🕵️ Analyser la réponse
            </button>
          </>
        )}

        {phase === 'scan' && (
          <div style={{ paddingTop: 18 }}>
            <div style={{ fontSize: '3.6rem', animation: 'mytho-pulse 0.8s ease-in-out infinite' }} aria-hidden="true">📡</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.or, marginTop: 12 }}>
              Analyse en cours…
            </div>
            <div style={{ height: 14, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 999, overflow: 'hidden', marginTop: 18 }}>
              <div style={{ height: '100%', width: '40%', background: COL.ambre, borderRadius: 999, animation: 'mytho-scan 1.2s ease-in-out infinite' }} />
            </div>
            <p style={{ color: COL.texte2, marginTop: 12, fontSize: '0.85rem' }}>Le polygraphe ausculte les micro-tremblements…</p>
            <style>{`
              @keyframes mytho-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.18); opacity: 0.55; } }
              @keyframes mytho-scan { 0% { margin-left: -40%; } 100% { margin-left: 100%; } }
            `}</style>
          </div>
        )}

        {phase === 'resultat' && (
          <div style={{ background: COL.panneau, border: `2px solid ${verdict.couleur}`, borderRadius: 20, padding: '22px 18px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>
              Verdict du polygraphe
            </div>
            <div style={{ fontSize: '3.4rem', marginTop: 8 }} aria-hidden="true">{verdict.emoji}</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.6rem', lineHeight: 1, color: verdict.couleur, marginTop: 4 }}>
              {verdict.titre}
            </div>
            <p style={{ fontSize: '1rem', color: COL.creme, marginTop: 12, lineHeight: 1.45 }}>{commentaire}</p>
            <p style={{ fontSize: '0.8rem', color: COL.texte2, marginTop: 10 }}>Verdict 100 % fantaisiste, évidemment. 😉</p>
            <button onClick={analyser} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>
              🔄 Recommencer
            </button>
          </div>
        )}
      </section>
    </>
  );
}
