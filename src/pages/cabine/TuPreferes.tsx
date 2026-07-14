import { useEffect, useRef, useState } from "react";
import { Entete } from "./Cadre";
import { COL, FRAUNCES } from "../../ui/theme";
import { vibrer } from "../../features/audio/sons";
import { useAuth } from "../../features/auth/AuthContext";
import { DILEMMES, CATEGORIES_TP, GAGES, type Dilemme } from "../../features/cabine/tuPreferes";
import { ouvrirSalleTP, genererCodeTP, type SalleTP, type DilemmeDistant } from "../../features/cabine/tuPreferesSalle";

// « Tu préfères ? » — deux façons de jouer :
//  • Sur un seul téléphone : mode libre (on discute) ou challenge (tour de rôle + gages).
//  • À distance via un code : chacun sur son téléphone rejoint la même partie,
//    vote A/B, et voit le décompte en direct (Supabase Realtime, sans table).

function melanger<T>(src: T[]): T[] {
  const t = [...src];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function poolDepuis(cats: Set<string>): Dilemme[] {
  const filtres = DILEMMES.filter((d) => cats.has(d.cat));
  return melanger(filtres.length ? filtres : DILEMMES);
}

export function TuPreferes({ onRetour }: { onRetour: () => void }) {
  const { user } = useAuth();
  const monId = user?.id || "anon";
  const pseudo = ((user?.user_metadata?.pseudo as string) || "").trim() || "Pilier";

  const [phase, setPhase] = useState<"reglages" | "jeu" | "salle">("reglages");

  // Réglages
  const [joueurs, setJoueurs] = useState<string[]>([]);
  const [nom, setNom] = useState("");
  const [cats, setCats] = useState<Set<string>>(() => new Set(CATEGORIES_TP.map((c) => c.cle)));
  const [codeInput, setCodeInput] = useState("");

  // Partie locale (un seul téléphone)
  const [pool, setPool] = useState<Dilemme[]>([]);
  const [pos, setPos] = useState(0);
  const [compteur, setCompteur] = useState(1);
  const [choix, setChoix] = useState<"a" | "b" | null>(null);
  const [tour, setTour] = useState(0);
  const [gage, setGage] = useState<string | null>(null);

  // Partie à distance (via code)
  const [codeSalle, setCodeSalle] = useState<string | null>(null);
  const [estHote, setEstHote] = useState(false);
  const [presents, setPresents] = useState<string[]>([]);
  const [distD, setDistD] = useState<DilemmeDistant | null>(null);
  const [votes, setVotes] = useState<Record<string, { choix: "a" | "b"; round: number }>>({});
  const [monVote, setMonVote] = useState<"a" | "b" | null>(null);
  const salleRef = useRef<SalleTP | null>(null);
  const hoteRef = useRef<{ pool: Dilemme[]; pos: number; round: number } | null>(null);
  const estHoteRef = useRef(false);

  // ── Réglages : joueurs & thèmes ──
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

  // ── Partie locale ──
  const commencer = () => {
    setPool(poolDepuis(cats));
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
        setPool((old) => melanger(old));
        return 0;
      }
      return np;
    });
    if (joueurs.length) setTour((t) => (t + 1) % joueurs.length);
  };
  const choisir = (c: "a" | "b") => { vibrer(12); setChoix(c); };
  const tirerGage = () => { vibrer([40, 30, 40]); setGage(GAGES[Math.floor(Math.random() * GAGES.length)]); };

  // ── Partie à distance ──
  const payloadCourant = (): DilemmeDistant | null => {
    const h = hoteRef.current;
    if (!h) return null;
    const d = h.pool[h.pos];
    return { a: d.a, b: d.b, cat: d.cat, round: h.round };
  };
  const creerPartie = () => {
    hoteRef.current = { pool: poolDepuis(cats), pos: 0, round: 1 };
    estHoteRef.current = true;
    setEstHote(true);
    setCodeSalle(genererCodeTP());
    setDistD(null);
    setVotes({});
    setMonVote(null);
    setPresents([]);
    setPhase("salle");
  };
  const rejoindrePartie = () => {
    const code = codeInput.trim().toUpperCase();
    if (code.length < 4) return;
    hoteRef.current = null;
    estHoteRef.current = false;
    setEstHote(false);
    setCodeSalle(code);
    setDistD(null);
    setVotes({});
    setMonVote(null);
    setPresents([]);
    setPhase("salle");
  };
  const hoteDilemmeSuivant = () => {
    const h = hoteRef.current;
    if (!h) return;
    h.round += 1;
    const np = h.pos + 1;
    if (np >= h.pool.length) { h.pool = melanger(h.pool); h.pos = 0; }
    else h.pos = np;
    const p = payloadCourant();
    if (p) salleRef.current?.envoyerDilemme(p);
  };
  const voterDistant = (c: "a" | "b") => {
    if (!distD || monVote) return;
    vibrer(12);
    setMonVote(c);
    salleRef.current?.envoyerVote(c, distD.round);
  };
  const quitterSalle = () => setPhase("reglages");

  // Ouverture / fermeture du canal de la salle
  useEffect(() => {
    if (phase !== "salle" || !codeSalle) return;
    const salle = ouvrirSalleTP({
      code: codeSalle,
      monId,
      pseudo,
      onPret: () => {
        if (estHoteRef.current) {
          const p = payloadCourant();
          if (p) salle.envoyerDilemme(p);
        }
      },
      onDilemme: (d) => {
        setDistD((prev) => {
          if (!prev || prev.round !== d.round) { setVotes({}); setMonVote(null); }
          return d;
        });
      },
      onVote: (v) => setVotes((prev) => ({ ...prev, [v.id]: { choix: v.choix, round: v.round } })),
      onPresents: setPresents,
      onSync: () => {
        if (estHoteRef.current) {
          const p = payloadCourant();
          if (p) salle.envoyerDilemme(p);
        }
      },
    });
    salleRef.current = salle;
    return () => { salle.quitter(); salleRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, codeSalle]);

  const chip = (actif: boolean): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 13px", borderRadius: 999,
    border: `2px solid ${actif ? COL.or : COL.bleu1}`, background: actif ? "rgba(233,196,106,0.14)" : "transparent",
    color: actif ? COL.or : COL.texte2, fontWeight: 800, fontSize: "0.82rem", cursor: "pointer",
  });

  // ══ Écran RÉGLAGES ══
  if (phase === "reglages") {
    return (
      <>
        <Entete titre="Tu préfères ?" onRetour={onRetour} />
        <section style={{ margin: "14px 16px 0" }}>
          {/* À distance via un code */}
          <div style={{ background: `linear-gradient(135deg, ${COL.rougeNeon}, ${COL.ambre})`, borderRadius: 18, padding: "16px 16px", color: "#fff", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.6rem" }} aria-hidden="true">🌐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", textTransform: "uppercase" }}>Jouer à distance</div>
                <div style={{ fontSize: "0.82rem", opacity: 0.95 }}>Chacun son téléphone, on vote en direct.</div>
              </div>
            </div>
            <button onClick={creerPartie} style={{ width: "100%", marginTop: 12, minHeight: 50, borderRadius: 12, border: "none", background: "#fff", color: "#2A1F10", fontWeight: 800, fontSize: "0.95rem" }}>
              ➕ Créer une partie (obtenir un code)
            </button>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === "Enter") rejoindrePartie(); }}
                placeholder="CODE"
                maxLength={4}
                style={{ flex: 1, minHeight: 50, padding: "10px 14px", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.2em", textAlign: "center", background: "rgba(0,0,0,0.25)", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12, color: "#fff" }}
              />
              <button onClick={rejoindrePartie} style={{ padding: "0 18px", minHeight: 50, borderRadius: 12, border: "2px solid #fff", background: "transparent", color: "#fff", fontWeight: 800 }}>
                Rejoindre
              </button>
            </div>
          </div>

          <p style={{ margin: "16px 0 14px", color: COL.texte2, fontSize: "0.88rem", lineHeight: 1.5, textAlign: "center" }}>
            …ou <strong style={{ color: COL.creme }}>sur un seul téléphone</strong> :
          </p>

          {/* Joueurs (local) */}
          <h3 style={{ margin: "0 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>
            Les joueurs <span style={{ fontSize: "0.8rem", color: COL.texte2, fontWeight: 600 }}>(optionnel)</span>
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={nom} onChange={(e) => setNom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ajouterJoueur(); }}
              placeholder="Prénom d'un joueur…" maxLength={16}
              style={{ flex: 1, minHeight: 50, padding: "10px 14px", fontSize: "0.95rem", background: "#14110F", border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.creme }} />
            <button onClick={ajouterJoueur} className="pmu-arcade" style={{ padding: "0 16px", minHeight: 50 }}>+ Ajouter</button>
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
              Sans joueur : <strong style={{ color: COL.creme }}>mode libre</strong>. Avec des joueurs : <strong style={{ color: COL.creme }}>chacun son tour</strong> (+ gage pour les dégonflés 😈).
            </p>
          )}

          {/* Thèmes */}
          <h3 style={{ margin: "22px 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>Les thèmes</h3>
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

          <button onClick={commencer} disabled={cats.size === 0} className="pmu-arcade" style={{ width: "100%", marginTop: 22, minHeight: 64, fontSize: "1.1rem", opacity: cats.size === 0 ? 0.5 : 1 }}>
            🎲 Jouer sur ce téléphone
          </button>
          {cats.size === 0 && <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: "0.8rem", color: COL.texte2 }}>Coche au moins un thème.</p>}
          <div style={{ height: 16 }} />
        </section>
      </>
    );
  }

  // ══ Écran SALLE (à distance) ══
  if (phase === "salle") {
    const tally = { a: 0, b: 0 };
    if (distD) {
      for (const v of Object.values(votes)) if (v.round === distD.round) tally[v.choix] += 1;
    }
    const total = tally.a + tally.b;
    const pctA = total ? Math.round((tally.a / total) * 100) : 50;

    return (
      <>
        <Entete titre="Tu préfères ? · à distance" onRetour={onRetour} />
        <section style={{ margin: "14px 16px 0" }}>
          {/* Code + présents */}
          <div style={{ background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 16, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: COL.texte2 }}>Code de la partie {estHote ? "· tu es l'hôte" : ""}</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 800, fontSize: "2.4rem", color: COL.or, letterSpacing: "0.18em" }}>{codeSalle}</div>
            <button
              onClick={() => {
                const url = `${window.location.origin}${import.meta.env.BASE_URL}cabine`;
                const txt = `Rejoins ma partie « Tu préfères ? » 🤔 dans La Boît'à Soif → La Cabine → Tu préfères → Rejoindre, code : ${codeSalle}`;
                if (navigator.share) navigator.share({ title: "Tu préfères ?", text: txt, url }).catch(() => {});
                else navigator.clipboard?.writeText(`${txt} (${url})`).catch(() => {});
              }}
              className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 6, padding: "0 16px", minHeight: 42 }}
            >
              📤 Partager le code
            </button>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {presents.length === 0 ? (
                <span style={{ fontSize: "0.82rem", color: COL.texte2 }}>Connexion…</span>
              ) : (
                presents.map((p, i) => (
                  <span key={i} style={{ background: "rgba(233,196,106,0.12)", border: `1px solid ${COL.bleu1}`, borderRadius: 999, padding: "4px 10px", fontSize: "0.78rem", fontWeight: 700, color: COL.creme }}>🍺 {p}</span>
                ))
              )}
            </div>
          </div>

          {/* Dilemme synchronisé */}
          {!distD ? (
            <div style={{ marginTop: 18, textAlign: "center", color: COL.texte2, padding: "24px 0", lineHeight: 1.5 }}>
              {estHote ? "Lancement de la partie…" : "En attente que l'hôte lance le premier dilemme… 🍻"}
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.3rem", color: COL.creme, margin: "18px 0 12px" }}>
                Tu préfères…
              </div>
              {(["a", "b"] as const).map((cle) => {
                const texte = cle === "a" ? distD.a : distD.b;
                const bg = cle === "a" ? COL.rougeNeon : COL.or;
                const fg = cle === "a" ? "#fff" : "#2A1F10";
                const choisi = monVote === cle;
                const grise = monVote !== null && !choisi;
                return (
                  <div key={cle} style={{ marginBottom: cle === "a" ? 10 : 0 }}>
                    <button onClick={() => voterDistant(cle)} disabled={monVote !== null}
                      style={{ width: "100%", border: choisi ? "3px solid #fff" : "none", borderRadius: 18, background: bg, color: fg, padding: "18px 16px", minHeight: 96, display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.08rem", lineHeight: 1.3, boxShadow: "0 5px 0 rgba(0,0,0,0.4)", opacity: grise ? 0.5 : 1 }}>
                      <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{cle === "a" ? "🅐" : "🅑"}</span>
                      <span style={{ flex: 1 }}>{texte}</span>
                      {monVote !== null && <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{tally[cle]}</span>}
                    </button>
                  </div>
                );
              })}

              {/* Barre de décompte en direct */}
              {monVote !== null && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", height: 16, borderRadius: 999, overflow: "hidden", border: `1px solid ${COL.bleu1}` }}>
                    <div style={{ width: `${pctA}%`, background: COL.rougeNeon }} />
                    <div style={{ flex: 1, background: COL.or }} />
                  </div>
                  <div style={{ textAlign: "center", marginTop: 6, fontSize: "0.82rem", color: COL.texte2 }}>
                    {total} vote{total > 1 ? "s" : ""} · 🅐 {tally.a} — 🅑 {tally.b}
                  </div>
                </div>
              )}

              {estHote && (
                <button onClick={hoteDilemmeSuivant} className="pmu-arcade" style={{ width: "100%", marginTop: 18, minHeight: 56 }}>
                  Dilemme suivant →
                </button>
              )}
              {!estHote && (
                <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: "0.82rem", color: COL.texte2 }}>
                  {monVote ? "L'hôte lance le prochain dilemme quand vous êtes prêts." : "À toi de voter !"}
                </p>
              )}
            </>
          )}

          <button onClick={quitterSalle} style={{ width: "100%", marginTop: 18, minHeight: 48, background: "transparent", border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.texte2, fontWeight: 700, fontSize: "0.9rem" }}>
            Quitter la partie
          </button>
          <div style={{ height: 18 }} />
        </section>
      </>
    );
  }

  // ══ Écran JEU (un seul téléphone) ══
  const d = pool[pos];
  const joueurCourant = joueurs.length ? joueurs[tour] : null;
  const panneau = (cle: "a" | "b", texte: string, bg: string, fg: string) => {
    const estChoisi = choix === cle;
    const autreChoisi = choix !== null && !estChoisi;
    return (
      <button onClick={() => choisir(cle)}
        style={{ width: "100%", border: estChoisi ? "3px solid #fff" : "none", borderRadius: 18, background: bg, color: fg, padding: "20px 18px", minHeight: 118, display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.12rem", lineHeight: 1.3, boxShadow: "0 5px 0 rgba(0,0,0,0.4)", opacity: autreChoisi ? 0.45 : 1, transform: estChoisi ? "scale(1.02)" : "none", transition: "opacity .15s ease, transform .15s ease" }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{cle === "a" ? "🅐" : "🅑"}</span>
        <span style={{ flex: 1 }}>{texte}</span>
      </button>
    );
  };

  return (
    <>
      <Entete titre="Tu préfères ?" onRetour={onRetour} />
      <section style={{ margin: "12px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ flex: 1, fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.texte2 }}>Dilemme n° {compteur}</span>
          <button onClick={() => setPhase("reglages")} style={{ border: "none", background: "transparent", color: COL.texte2, fontWeight: 700, fontSize: "0.8rem", textDecoration: "underline" }}>⚙︎ Réglages</button>
        </div>

        {joueurCourant && (
          <div style={{ background: "rgba(233,196,106,0.12)", border: `2px solid ${COL.or}`, borderRadius: 14, padding: "10px 14px", marginBottom: 14, textAlign: "center" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.texte2 }}>À toi de jouer</span>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: COL.or }}>🎯 {joueurCourant}</div>
          </div>
        )}

        <div style={{ textAlign: "center", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: COL.creme, margin: "0 0 14px" }}>Tu préfères…</div>
        {panneau("a", d.a, COL.rougeNeon, "#fff")}
        <div style={{ textAlign: "center", fontFamily: FRAUNCES, fontWeight: 800, color: COL.or, fontSize: "1.1rem", margin: "10px 0" }}>— OU —</div>
        {panneau("b", d.b, COL.or, "#2A1F10")}

        {choix && (
          <div role="status" style={{ marginTop: 16, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, color: COL.creme, fontWeight: 700, fontSize: "0.95rem" }}>Tu as choisi <strong style={{ color: COL.or }}>{choix === "a" ? "🅐" : "🅑"}</strong> — assume et explique pourquoi ! 😏</p>
          </div>
        )}
        {gage && (
          <div role="status" style={{ marginTop: 16, background: "#341F1B", border: `2px solid ${COL.rougeNeon}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.rougeNeon }}>😈 Gage du dégonflé</div>
            <p style={{ margin: "6px 0 0", color: COL.creme, fontWeight: 700, fontSize: "1rem", lineHeight: 1.4 }}>{gage}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <button onClick={tirerGage} className="pmu-arcade pmu-arcade--ardoise" style={{ flex: 1, minWidth: 130, minHeight: 54, fontSize: "0.9rem" }}>🎲 Gage (dégonflé)</button>
          <button onClick={suivant} className="pmu-arcade" style={{ flex: 1, minWidth: 130, minHeight: 54, fontSize: "0.95rem" }}>Dilemme suivant →</button>
        </div>
        <div style={{ height: 18 }} />
      </section>
    </>
  );
}
