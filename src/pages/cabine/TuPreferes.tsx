import { useState } from "react";
import { Entete } from "./Cadre";
import { COL, FRAUNCES } from "../../ui/theme";
import { vibrer } from "../../features/audio/sons";
import { DILEMMES, CATEGORIES_TP, GAGES, type Dilemme } from "../../features/cabine/tuPreferes";

// « Tu préfères ? » — le grand jeu à plusieurs. On choisit les thèmes et les
// joueurs, puis on enchaîne les dilemmes (deck mélangé, sans fin). En mode
// challenge, chaque dilemme désigne un joueur ; le dégonflé qui refuse de
// choisir pioche un gage. But : débattre et rigoler.

function melanger<T>(src: T[]): T[] {
  const t = [...src];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

export function TuPreferes({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<"reglages" | "jeu">("reglages");

  // Réglages
  const [joueurs, setJoueurs] = useState<string[]>([]);
  const [nom, setNom] = useState("");
  const [cats, setCats] = useState<Set<string>>(() => new Set(CATEGORIES_TP.map((c) => c.cle)));

  // Partie
  const [pool, setPool] = useState<Dilemme[]>([]);
  const [pos, setPos] = useState(0);
  const [compteur, setCompteur] = useState(1);
  const [choix, setChoix] = useState<"a" | "b" | null>(null);
  const [tour, setTour] = useState(0);
  const [gage, setGage] = useState<string | null>(null);

  const ajouterJoueur = () => {
    const n = nom.trim().slice(0, 16);
    if (!n || joueurs.length >= 12) return;
    setJoueurs((j) => [...j, n]);
    setNom("");
  };
  const retirerJoueur = (i: number) => setJoueurs((j) => j.filter((_, k) => k !== i));

  const basculerCat = (cle: string) => {
    setCats((prev) => {
      const s = new Set(prev);
      if (s.has(cle)) s.delete(cle);
      else s.add(cle);
      return s;
    });
  };

  const commencer = () => {
    const filtres = DILEMMES.filter((d) => cats.has(d.cat));
    const jeu = melanger(filtres.length ? filtres : DILEMMES);
    setPool(jeu);
    setPos(0);
    setCompteur(1);
    setChoix(null);
    setGage(null);
    setTour(0);
    setPhase("jeu");
  };

  const suivant = () => {
    setChoix(null);
    setGage(null);
    setCompteur((c) => c + 1);
    setPos((p) => {
      const np = p + 1;
      if (np >= pool.length) {
        setPool((old) => melanger(old)); // on remélange, sans fin
        return 0;
      }
      return np;
    });
    if (joueurs.length) setTour((t) => (t + 1) % joueurs.length);
  };

  const choisir = (c: "a" | "b") => {
    vibrer(12);
    setChoix(c);
  };

  const tirerGage = () => {
    vibrer([40, 30, 40]);
    setGage(GAGES[Math.floor(Math.random() * GAGES.length)]);
  };

  // ── Écran de réglages ──
  if (phase === "reglages") {
    const chip = (actif: boolean): React.CSSProperties => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "9px 13px",
      borderRadius: 999,
      border: `2px solid ${actif ? COL.or : COL.bleu1}`,
      background: actif ? "rgba(233,196,106,0.14)" : "transparent",
      color: actif ? COL.or : COL.texte2,
      fontWeight: 800,
      fontSize: "0.82rem",
      cursor: "pointer",
    });

    return (
      <>
        <Entete titre="Tu préfères ?" onRetour={onRetour} />
        <section style={{ margin: "14px 16px 0" }}>
          <p style={{ margin: "0 0 16px", color: COL.texte2, fontSize: "0.92rem", lineHeight: 1.5 }}>
            Le grand jeu à débattre. Choisissez vos thèmes, ajoutez les joueurs, et c&apos;est parti
            pour des heures de dilemmes ! 🎲
          </p>

          {/* Joueurs */}
          <h3 style={{ margin: "0 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>
            Les joueurs <span style={{ fontSize: "0.8rem", color: COL.texte2, fontWeight: 600 }}>(optionnel)</span>
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") ajouterJoueur(); }}
              placeholder="Prénom d'un joueur…"
              maxLength={16}
              style={{ flex: 1, minHeight: 50, padding: "10px 14px", fontSize: "0.95rem", background: "#14110F", border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.creme }}
            />
            <button onClick={ajouterJoueur} className="pmu-arcade" style={{ padding: "0 16px", minHeight: 50 }}>
              + Ajouter
            </button>
          </div>
          {joueurs.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {joueurs.map((j, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 999, padding: "7px 8px 7px 14px", color: COL.creme, fontWeight: 700, fontSize: "0.88rem" }}>
                  {j}
                  <button onClick={() => retirerJoueur(i)} aria-label={`Retirer ${j}`} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(243,232,207,0.12)", color: COL.texte2, fontWeight: 800 }}>×</button>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: "10px 2px 0", fontSize: "0.8rem", color: COL.texte2, lineHeight: 1.45 }}>
              Sans joueur : <strong style={{ color: COL.creme }}>mode libre</strong>, on discute sans tour de rôle.
              Avec des joueurs : <strong style={{ color: COL.creme }}>mode challenge</strong>, chacun son tour (et gage pour les dégonflés 😈).
            </p>
          )}

          {/* Thèmes */}
          <h3 style={{ margin: "22px 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>
            Les thèmes
          </h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setCats(new Set(CATEGORIES_TP.map((c) => c.cle)))} style={{ ...chip(false), fontSize: "0.78rem" }}>Tout cocher</button>
            <button onClick={() => setCats(new Set())} style={{ ...chip(false), fontSize: "0.78rem" }}>Tout décocher</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES_TP.map((c) => (
              <button key={c.cle} onClick={() => basculerCat(c.cle)} style={chip(cats.has(c.cle))}>
                <span aria-hidden="true">{c.emoji}</span> {c.nom}
              </button>
            ))}
          </div>

          <button
            onClick={commencer}
            disabled={cats.size === 0}
            className="pmu-arcade"
            style={{ width: "100%", marginTop: 22, minHeight: 64, fontSize: "1.1rem", opacity: cats.size === 0 ? 0.5 : 1 }}
          >
            🎲 C&apos;est parti !
          </button>
          {cats.size === 0 && (
            <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: "0.8rem", color: COL.texte2 }}>
              Coche au moins un thème.
            </p>
          )}
          <div style={{ height: 16 }} />
        </section>
      </>
    );
  }

  // ── Écran de jeu ──
  const d = pool[pos];
  const joueurCourant = joueurs.length ? joueurs[tour] : null;

  const panneau = (cle: "a" | "b", texte: string, bg: string, fg: string) => {
    const estChoisi = choix === cle;
    const autreChoisi = choix !== null && !estChoisi;
    return (
      <button
        onClick={() => choisir(cle)}
        style={{
          width: "100%",
          border: estChoisi ? `3px solid #fff` : "none",
          borderRadius: 18,
          background: bg,
          color: fg,
          padding: "20px 18px",
          minHeight: 118,
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
          fontFamily: FRAUNCES,
          fontWeight: 700,
          fontSize: "1.12rem",
          lineHeight: 1.3,
          boxShadow: "0 5px 0 rgba(0,0,0,0.4)",
          opacity: autreChoisi ? 0.45 : 1,
          transform: estChoisi ? "scale(1.02)" : "none",
          transition: "opacity .15s ease, transform .15s ease",
        }}
      >
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          {cle === "a" ? "🅐" : "🅑"}
        </span>
        <span style={{ flex: 1 }}>{texte}</span>
      </button>
    );
  };

  return (
    <>
      <Entete titre="Tu préfères ?" onRetour={onRetour} />
      <section style={{ margin: "12px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ flex: 1, fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.texte2 }}>
            Dilemme n° {compteur}
          </span>
          <button onClick={() => setPhase("reglages")} style={{ border: "none", background: "transparent", color: COL.texte2, fontWeight: 700, fontSize: "0.8rem", textDecoration: "underline" }}>
            ⚙︎ Réglages
          </button>
        </div>

        {joueurCourant && (
          <div style={{ background: "rgba(233,196,106,0.12)", border: `2px solid ${COL.or}`, borderRadius: 14, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.texte2 }}>À toi de jouer</span>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: COL.or }}>🎯 {joueurCourant}</div>
          </div>
        )}

        <div style={{ textAlign: "center", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: COL.creme, margin: "0 0 14px" }}>
          Tu préfères…
        </div>

        {panneau("a", d.a, COL.rougeNeon, "#fff")}
        <div style={{ textAlign: "center", fontFamily: FRAUNCES, fontWeight: 800, color: COL.or, fontSize: "1.1rem", margin: "10px 0" }}>— OU —</div>
        {panneau("b", d.b, COL.or, "#2A1F10")}

        {choix && (
          <div role="status" style={{ marginTop: 16, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, color: COL.creme, fontWeight: 700, fontSize: "0.95rem" }}>
              Tu as choisi <strong style={{ color: COL.or }}>{choix === "a" ? "🅐" : "🅑"}</strong> — maintenant assume et explique pourquoi ! 😏
            </p>
          </div>
        )}

        {gage && (
          <div role="status" style={{ marginTop: 16, background: "#341F1B", border: `2px solid ${COL.rougeNeon}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.rougeNeon }}>😈 Gage du dégonflé</div>
            <p style={{ margin: "6px 0 0", color: COL.creme, fontWeight: 700, fontSize: "1rem", lineHeight: 1.4 }}>{gage}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <button onClick={tirerGage} className="pmu-arcade pmu-arcade--ardoise" style={{ flex: 1, minWidth: 130, minHeight: 54, fontSize: "0.9rem" }}>
            🎲 Gage (dégonflé)
          </button>
          <button onClick={suivant} className="pmu-arcade" style={{ flex: 1, minWidth: 130, minHeight: 54, fontSize: "0.95rem" }}>
            Dilemme suivant →
          </button>
        </div>
        <div style={{ height: 18 }} />
      </section>
    </>
  );
}
