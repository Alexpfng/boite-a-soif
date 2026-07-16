import { useState } from "react";
import { Entete } from "./Cadre";
import { COL, FRAUNCES } from "../../ui/theme";
import { parlerTavernier } from "../../features/audio/sons";
import { REFS, type Ref } from "../../features/cabine/refsFilms";

// Le Jeu des Réfs : on affiche le DÉBUT d'une réplique culte du ciné français,
// vous la finissez à voix haute, puis on révèle la suite + le film. Deck mélangé
// sans fin, pour enchaîner pendant des heures.

function melanger<T>(src: T[]): T[] {
  const t = [...src];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

export function JeuDesRefs({ onRetour }: { onRetour: () => void }) {
  const [deck, setDeck] = useState<Ref[]>(() => melanger(REFS));
  const [pos, setPos] = useState(0);
  const [num, setNum] = useState(1);
  const [revele, setRevele] = useState(false);

  const ref = deck[pos];

  const suivant = () => {
    setRevele(false);
    setNum((n) => n + 1);
    setPos((p) => {
      const np = p + 1;
      if (np >= deck.length) { setDeck((d) => melanger(d)); return 0; }
      return np;
    });
  };

  return (
    <>
      <Entete titre="Le Jeu des Réfs" onRetour={onRetour} />
      <section style={{ margin: "14px 16px 0" }}>
        <p style={{ margin: "0 0 16px", color: COL.texte2, fontSize: "0.9rem", lineHeight: 1.5 }}>
          🎬 Le début d'une réplique culte s'affiche. <strong style={{ color: COL.creme }}>À vous de la finir</strong> à voix haute ! Puis on révèle la suite… et le film.
        </p>

        <div style={{ background: "#14110F", border: `2px solid ${COL.or}`, borderRadius: 20, padding: "22px 20px", boxShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: COL.texte2 }}>Réf n° {num}</div>
          <p style={{ margin: "10px 0 0", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.25, color: COL.creme }}>
            « {ref.debut}
            {!revele && <span style={{ color: COL.or }}> … ? »</span>}
            {revele && <span style={{ color: COL.or }}> {ref.fin} »</span>}
          </p>

          {revele && (
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: "rgba(233,196,106,0.12)", border: `1px solid ${COL.or}`, borderRadius: 12, padding: "10px 14px" }}>
              <span style={{ fontSize: "1.4rem" }} aria-hidden="true">🎞️</span>
              <span style={{ color: COL.creme, fontWeight: 800, fontSize: "0.95rem" }}>{ref.film}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button onClick={() => parlerTavernier(ref.debut, 0.5, 0.95)} className="pmu-arcade pmu-arcade--ardoise" style={{ minWidth: 54, minHeight: 56, padding: "0 16px", fontSize: "1rem" }} aria-label="Faire lire le début par le tavernier">
            🔊
          </button>
          {!revele ? (
            <button onClick={() => setRevele(true)} className="pmu-arcade pmu-arcade--or" style={{ flex: 1, minWidth: 140, minHeight: 56, fontSize: "1rem" }}>
              👀 Révéler la suite
            </button>
          ) : (
            <button onClick={suivant} className="pmu-arcade" style={{ flex: 1, minWidth: 140, minHeight: 56, fontSize: "1rem" }}>
              🎬 Réf suivante →
            </button>
          )}
        </div>

        <p style={{ margin: "16px 2px 0", fontSize: "0.78rem", color: COL.texte2, lineHeight: 1.45, textAlign: "center" }}>
          {REFS.length} répliques du ciné français, mélangées à l'infini.
        </p>
        <div style={{ height: 18 }} />
      </section>
    </>
  );
}
