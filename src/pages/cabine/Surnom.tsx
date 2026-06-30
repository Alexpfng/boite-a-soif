import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Générateur de Surnom de Pilier ───────────────────────────────────────
// Tire au sort un blaze de comptoir : un préfixe « bon copain » + un suffixe
// « gueule de bois assumée ». 100 % pour rire, évidemment.

const PREFIXES = [
  'Dédé', 'Mimi', 'Le Gégé', 'Riton', 'Nanard', 'Bébert',
  'La Gisèle', 'Tonton', 'La Roberte', 'Le Marcel', 'Pépère', 'La Josette',
];

const SUFFIXES = [
  'la Gnôle', 'Cubi', 'Sans-Soif', 'la Tise', 'du Zinc', 'Triple-Dose',
  'Cul-Sec', 'la Mousse', 'le Galopin', 'Demi-Pression', 'la Tournée', 'du Comptoir',
];

// Petit tirage au hasard dans un tableau.
function piocher<T>(liste: readonly T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}

export function Surnom({ onRetour }: { onRetour: () => void }) {
  // Le prénom est purement décoratif : on le garde pour le fun, il n'entre pas
  // dans la génération du blaze (un pilier ne choisit pas son surnom !).
  const [prenom, setPrenom] = useState('');
  const [surnom, setSurnom] = useState<string | null>(null);

  function generer() {
    const blaze = `${piocher(PREFIXES)} ${piocher(SUFFIXES)}`;
    setSurnom(blaze);
    parlerTavernier(blaze);
  }

  return (
    <>
      <Entete titre="Le Générateur de Surnom de Pilier" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          Le comptoir te baptise. Donne ton prénom si tu veux (juste pour le fun)
          et laisse la machine choisir ton vrai blaze de pilier.
        </p>

        <input
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Ton prénom (facultatif)…"
          style={{
            width: '100%',
            background: '#14110F',
            border: `2px solid ${COL.bleu1}`,
            borderRadius: 12,
            color: COL.creme,
            padding: '12px 14px',
            fontSize: '1rem',
          }}
        />

        <button onClick={generer} className="pmu-arcade" style={{ width: '100%', marginTop: 14, minHeight: 64 }}>
          🏷️ Mon blaze de pilier
        </button>

        {surnom && (
          <div className="pmu-ardoise" style={{ marginTop: 18, textAlign: 'center' }}>
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {prenom.trim() ? `${prenom.trim()}, désormais connu sous le nom de` : 'Ton blaze de pilier'}
            </div>
            <p className="craie-accent" style={{ margin: '12px 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.15 }}>
              « {surnom} »
            </p>
            <button onClick={generer} className="pmu-arcade pmu-arcade--or" style={{ marginTop: 18, padding: '0 18px', minHeight: 48 }}>
              🎲 Un autre !
            </button>
          </div>
        )}

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Un surnom, ça se mérite au comptoir. Celui-là, c’est cadeau.
        </p>
      </section>
    </>
  );
}
