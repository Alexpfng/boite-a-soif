import { useState, useRef, useEffect } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── La Roue « Qui paie ? » ───────────────────────────────────────────────────
// Le sort désigne, parmi les participants, qui régale la tournée. Animation de
// surbrillance aléatoire qui ralentit puis s'arrête sur un gagnant.
export function QuiPaie({ onRetour }: { onRetour: () => void }) {
  const [noms, setNoms] = useState<string[]>([]);
  const [saisie, setSaisie] = useState('');
  const [actif, setActif] = useState<number | null>(null); // index en surbrillance pendant le tirage
  const [gagnant, setGagnant] = useState<string | null>(null);
  const [tourne, setTourne] = useState(false);
  const ref = useRef<{ timer?: number }>({});

  useEffect(() => () => nettoyer(), []);
  function nettoyer() {
    if (ref.current.timer) window.clearTimeout(ref.current.timer);
    ref.current = {};
  }

  function ajouter() {
    const t = saisie.trim();
    if (!t) return;
    setNoms((l) => [...l, t]);
    setSaisie('');
  }
  function retirer(idx: number) {
    if (tourne) return;
    setNoms((l) => l.filter((_, k) => k !== idx));
  }

  function tourner() {
    if (tourne || noms.length < 2) return;
    nettoyer();
    setGagnant(null);
    setTourne(true);

    const debut = performance.now();
    const duree = 2500;
    let courant = -1;

    const pas = () => {
      // Évite de retomber sur le même index deux fois de suite.
      let suivant = Math.floor(Math.random() * noms.length);
      if (noms.length > 1 && suivant === courant) suivant = (suivant + 1) % noms.length;
      courant = suivant;
      setActif(courant);

      const ecoule = performance.now() - debut;
      if (ecoule >= duree) {
        const elu = noms[courant];
        setActif(null);
        setGagnant(elu);
        setTourne(false);
        nettoyer();
        parlerTavernier(`${elu} paie la tournée !`);
        return;
      }
      // L'intervalle augmente avec le temps écoulé : la roue ralentit.
      const intervalle = 60 + Math.pow(ecoule / duree, 3) * 460; // ~60 ms → ~520 ms
      ref.current.timer = window.setTimeout(pas, intervalle);
    };
    pas();
  }

  return (
    <>
      <Entete titre="La Roue « Qui paie ? »" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 12px', lineHeight: 1.5 }}>
          Ajoute les piliers présents, puis lance la roue : le sort désigne qui régale.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') ajouter(); }}
            placeholder="Prénom du candidat…"
            disabled={tourne}
            style={{ flex: 1, minHeight: 50, fontSize: '0.95rem', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.creme, padding: '12px 14px' }}
          />
          <button onClick={ajouter} disabled={tourne} className="pmu-arcade" style={{ padding: '0 16px', minHeight: 50 }}>
            Ajouter
          </button>
        </div>

        {noms.length === 0 ? (
          <div style={{ marginTop: 16, background: COL.panneau, border: `2px dashed ${COL.bleu1}`, borderRadius: 14, padding: '20px 16px', textAlign: 'center', color: COL.texte2 }}>
            Personne au comptoir… Ajoute au moins deux noms.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {noms.map((nom, i) => {
              const surbrillance = actif === i;
              return (
                <li
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: surbrillance ? COL.or : COL.panneau,
                    color: surbrillance ? '#2A1F10' : COL.creme,
                    border: `2px solid ${surbrillance ? COL.or : COL.bleu1}`,
                    borderRadius: 999, padding: '8px 8px 8px 14px',
                    fontWeight: 700, fontSize: '0.95rem',
                    transition: 'background .05s linear, color .05s linear',
                  }}
                >
                  <span>{nom}</span>
                  {!tourne && (
                    <button
                      onClick={() => retirer(i)}
                      aria-label={`Retirer ${nom}`}
                      style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.18)', color: 'inherit', fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <button
          onClick={tourner}
          disabled={tourne || noms.length < 2}
          className="pmu-arcade pmu-arcade--ambre"
          style={{ width: '100%', marginTop: 18, minHeight: 66, fontSize: '1.05rem', opacity: tourne || noms.length < 2 ? 0.5 : 1 }}
        >
          {tourne ? 'Ça tourne…' : '🎡 Tourne !'}
        </button>

        {gagnant && !tourne && (
          <div className="pmu-ardoise" style={{ marginTop: 18, textAlign: 'center' }}>
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Le sort a tranché</div>
            <p className="craie" style={{ margin: '12px 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.2 }}>
              {gagnant} paie la tournée ! 🍻
            </p>
          </div>
        )}
      </section>
    </>
  );
}
