import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Niveau de Beauferie (petit quiz bon enfant, score sur 10) ─────────────

const QUESTIONS: { q: string; reponses: { texte: string; pts: number }[] }[] = [
  {
    q: 'L’apéro idéal ?',
    reponses: [
      { texte: '🍵 Un kombucha bien frais', pts: 0 },
      { texte: '🍹 Un petit spritz en terrasse', pts: 1 },
      { texte: '🍷 Pastaga-saucisson, et que ça saute', pts: 2 },
    ],
  },
  {
    q: 'La musique de la soirée ?',
    reponses: [
      { texte: '🎧 Un vinyle jazz un peu pointu', pts: 0 },
      { texte: '🎶 Le tube de l’été à fond', pts: 1 },
      { texte: '📣 « Les Lacs du Connemara », tous debout', pts: 2 },
    ],
  },
  {
    q: 'Ta tenue pour le barbeuc ?',
    reponses: [
      { texte: '👕 Chemise en lin impeccable', pts: 0 },
      { texte: '🩳 Bermuda et tongs, peinard', pts: 1 },
      { texte: '🎽 Marcel blanc, c’est l’uniforme', pts: 2 },
    ],
  },
  {
    q: 'On parle de quoi à table ?',
    reponses: [
      { texte: '📖 Du dernier roman qu’on a lu', pts: 0 },
      { texte: '⚽ Du match d’hier soir', pts: 1 },
      { texte: '🥩 De la cuisson parfaite des merguez', pts: 2 },
    ],
  },
  {
    q: 'Le dessert qui te fait craquer ?',
    reponses: [
      { texte: '🍮 Un dessert maison un peu chic', pts: 0 },
      { texte: '🍦 Une bonne glace artisanale', pts: 1 },
      { texte: '🍨 La coupe Dame Blanche du PMU', pts: 2 },
    ],
  },
  {
    q: 'Les vacances de rêve ?',
    reponses: [
      { texte: '🏛️ Les musées de Florence', pts: 0 },
      { texte: '⛰️ Une rando en montagne', pts: 1 },
      { texte: '⛺ Camping clim, apéro-pétanque', pts: 2 },
    ],
  },
  {
    q: 'Ta voiture, c’est plutôt ?',
    reponses: [
      { texte: '🚲 Un vélo cargo électrique', pts: 0 },
      { texte: '🚗 Une petite citadine pratique', pts: 1 },
      { texte: '🌲 Tuning, sapin désodorisant et sono', pts: 2 },
    ],
  },
  {
    q: 'Le café du matin ?',
    reponses: [
      { texte: '🍵 Un matcha latte d’avoine', pts: 0 },
      { texte: '☕ Un café serré, classique', pts: 1 },
      { texte: '🥃 Café-calva, pour démarrer fort', pts: 2 },
    ],
  },
  {
    q: 'Le réveillon idéal ?',
    reponses: [
      { texte: '🍽️ Un resto étoilé en amoureux', pts: 0 },
      { texte: '🎉 Une grosse soirée entre potes', pts: 1 },
      { texte: '🪩 Cotillons et Patrick Sébastien', pts: 2 },
    ],
  },
  {
    q: 'Ton animal de compagnie ?',
    reponses: [
      { texte: '🐱 Un chat persan sur coussin', pts: 0 },
      { texte: '🐕 Un bon gros labrador', pts: 1 },
      { texte: '🐶 Un berger « qui mord pas… normalement »', pts: 2 },
    ],
  },
  {
    q: 'La déco du salon ?',
    reponses: [
      { texte: '🛋️ Scandinave, épurée', pts: 0 },
      { texte: '🖼️ Cosy, quelques cadres', pts: 1 },
      { texte: '🦌 La biche au coucher de soleil, encadrée', pts: 2 },
    ],
  },
  {
    q: 'Le pain au chocolat, ça se dit… ?',
    reponses: [
      { texte: '🤷 J’en sais rien, je mange salé', pts: 0 },
      { texte: '🥐 Pain au chocolat, évidemment', pts: 1 },
      { texte: '🥖 Chocolatine, et on n’en parle plus', pts: 2 },
    ],
  },
  {
    q: 'Le karaoké, tu chantes quoi ?',
    reponses: [
      { texte: '🎼 Rien, je préfère écouter', pts: 0 },
      { texte: '🎤 Un classique de variété', pts: 1 },
      { texte: '📣 « Les Lacs du Connemara », forcément', pts: 2 },
    ],
  },
];

const MAX = QUESTIONS.length * 2;

function niveau(score: number): { emoji: string; titre: string } {
  const pct = MAX ? score / MAX : 0;
  if (pct < 0.3) return { emoji: '🧘', titre: 'Hipster au kombucha' };
  if (pct < 0.55) return { emoji: '😎', titre: 'Beauf du dimanche' };
  if (pct < 0.8) return { emoji: '🍖', titre: 'Roi du barbeuc en marcel' };
  return { emoji: '👑', titre: 'Légende du PMU' };
}

export function Beauferie({ onRetour }: { onRetour: () => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [fini, setFini] = useState(false);

  function repondre(pts: number) {
    const total = score + pts;
    setScore(total);
    if (index + 1 >= QUESTIONS.length) {
      setFini(true);
      const n = niveau(total);
      parlerTavernier(`Niveau de beauferie : ${n.titre} !`, 0.5, 0.95);
    } else {
      setIndex(index + 1);
    }
  }

  function refaire() {
    setIndex(0);
    setScore(0);
    setFini(false);
  }

  return (
    <>
      <Entete titre="Le Niveau de Beauferie" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        {!fini ? (
          <>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>
              Question {index + 1} / {QUESTIONS.length}
            </div>
            <div style={{ height: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
              <div style={{ height: '100%', width: `${((index + 1) / QUESTIONS.length) * 100}%`, background: COL.or, borderRadius: 999, transition: 'width .25s ease' }} />
            </div>

            <h3 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.5rem', color: COL.creme, lineHeight: 1.3, margin: '20px 4px 0' }}>
              {QUESTIONS[index].q}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              {QUESTIONS[index].reponses.map((r, i) => (
                <button
                  key={i}
                  onClick={() => repondre(r.pts)}
                  className="pmu-arcade pmu-arcade--ardoise"
                  style={{ width: '100%', minHeight: 58, fontSize: '1rem' }}
                >
                  {r.texte}
                </button>
              ))}
            </div>
          </>
        ) : (() => {
          const n = niveau(score);
          return (
            <div style={{ background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 20, padding: '24px 18px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>
                Niveau de Beauferie
              </div>
              <div style={{ fontSize: '4rem', marginTop: 8 }} aria-hidden="true">{n.emoji}</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.9rem', lineHeight: 1.2, color: COL.or, marginTop: 4 }}>
                {n.titre}
              </div>
              <p style={{ fontSize: '0.95rem', color: COL.creme, marginTop: 12 }}>
                Score : <strong style={{ color: COL.ambre }}>{score}</strong> / {MAX} points de beauferie.
              </p>
              <button onClick={refaire} className="pmu-arcade" style={{ width: '100%', marginTop: 18 }}>
                🔄 Refaire le test
              </button>
            </div>
          );
        })()}
      </section>
    </>
  );
}
