import { useEffect, useRef, useState } from "react";
import { Entete } from "./Cadre";
import { COL, FRAUNCES } from "../../ui/theme";
import { vibrer } from "../../features/audio/sons";
import {
  pasSimulation, scorerMene, prochainLanceur,
  TERRAIN, R_BOULE, R_COCHONNET, LANCEUR, V_MAX,
  type Corps, type ResultatMene,
} from "../../features/cabine/petanque";

// La Pétanque — vue de dessus. On glisse le doigt vers la cible : plus le
// glissé est long/rapide, plus la boule part loin (l'angle donne la direction).
// On pointe (approcher du cochonnet) ou on tire (chasser une boule). Mode
// challenge local : chacun son tour sur le même téléphone, jusqu'à 13 points.

const COULEURS = ["#F2C14E", "#E14B3A", "#5BAA5B", "#4E86C7", "#EC9A4B", "#B07CC6"];
const GRAVIER = "#b39a6b";

interface Joueur { nom: string; couleur: string }
interface EtatJeu {
  joueurs: Joueur[];
  boulesParJoueur: number;
  pointsPourGagner: number;
  scores: number[];
  boulesRestantes: number[];
  lanceur: number;
  etat: "vise" | "lance" | "mene-finie";
  mene: number;
  resultat: ResultatMene | null;
  vainqueur: number | null;
  corps: Corps[]; // [0] = cochonnet
}

export function Petanque({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<"reglages" | "jeu" | "fin">("reglages");

  // Réglages
  const [joueurs, setJoueurs] = useState<Joueur[]>([
    { nom: "Joueur 1", couleur: COULEURS[0] },
    { nom: "Joueur 2", couleur: COULEURS[1] },
  ]);
  const [boulesParJoueur, setBoulesParJoueur] = useState(3);
  const [pointsPourGagner, setPointsPourGagner] = useState(13);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const G = useRef<EtatJeu | null>(null);
  const animRef = useRef<number | null>(null);
  const drag = useRef<{ actif: boolean; x0: number; y0: number; x: number; y: number }>({ actif: false, x0: 0, y0: 0, x: 0, y: 0 });
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  // ── Réglages ──
  const ajouterJoueur = () => {
    setJoueurs((j) => (j.length >= 6 ? j : [...j, { nom: `Joueur ${j.length + 1}`, couleur: COULEURS[j.length % COULEURS.length] }]));
  };
  const retirerJoueur = (i: number) => setJoueurs((j) => (j.length <= 2 ? j : j.filter((_, k) => k !== i)));
  const renommer = (i: number, nom: string) => setJoueurs((j) => j.map((p, k) => (k === i ? { ...p, nom: nom.slice(0, 14) } : p)));

  // ── Cycle de jeu ──
  function placerCochonnet(): Corps {
    const x = 28 + Math.random() * (TERRAIN.w - 56);
    const y = 20 + Math.random() * 34;
    return { x, y, vx: 0, vy: 0, r: R_COCHONNET, type: "cochonnet", joueur: -1 };
  }

  function nouvelleMene(premier: number) {
    const g = G.current;
    if (!g) return;
    g.corps = [placerCochonnet()];
    g.boulesRestantes = g.joueurs.map(() => g.boulesParJoueur);
    g.lanceur = premier;
    g.etat = "vise";
    g.resultat = null;
    g.mene += 1;
    rerender();
    dessiner();
  }

  function commencer() {
    G.current = {
      joueurs,
      boulesParJoueur,
      pointsPourGagner,
      scores: joueurs.map(() => 0),
      boulesRestantes: joueurs.map(() => boulesParJoueur),
      lanceur: 0,
      etat: "vise",
      mene: 0,
      resultat: null,
      vainqueur: null,
      corps: [],
    };
    setPhase("jeu");
    nouvelleMene(0);
  }

  function lancer(vx: number, vy: number) {
    const g = G.current;
    if (!g || g.etat !== "vise") return;
    g.corps.push({ x: LANCEUR.x, y: LANCEUR.y, vx, vy, r: R_BOULE, type: "boule", joueur: g.lanceur });
    g.boulesRestantes[g.lanceur] -= 1;
    g.etat = "lance";
    vibrer(14);
    rerender();
    boucle();
  }

  function boucle() {
    const g = G.current;
    if (!g) return;
    const bouge = pasSimulation(g.corps);
    dessiner();
    if (bouge) {
      animRef.current = requestAnimationFrame(boucle);
    } else {
      animRef.current = null;
      finDuLancer();
    }
  }

  function finDuLancer() {
    const g = G.current;
    if (!g) return;
    const total = g.boulesRestantes.reduce((s, n) => s + n, 0);
    if (total === 0) { finMene(); return; }
    g.lanceur = prochainLanceur(g.corps, g.corps[0], g.boulesRestantes);
    g.etat = "vise";
    rerender();
    dessiner();
  }

  function finMene() {
    const g = G.current;
    if (!g) return;
    const res = scorerMene(g.corps, g.corps[0], g.joueurs.length);
    if (res.gagnant >= 0) g.scores[res.gagnant] += res.points;
    g.resultat = res;
    g.etat = "mene-finie";
    const meneur = g.scores.indexOf(Math.max(...g.scores));
    if (g.scores[meneur] >= g.pointsPourGagner) {
      g.vainqueur = meneur;
      setPhase("fin");
    }
    rerender();
    dessiner();
  }

  const meneSuivante = () => {
    const g = G.current;
    if (!g) return;
    nouvelleMene(g.resultat && g.resultat.gagnant >= 0 ? g.resultat.gagnant : 0);
  };

  // ── Rendu canvas ──
  function dessiner() {
    const g = G.current;
    const cv = canvasRef.current;
    if (!g || !cv) return;
    const cssW = cv.clientWidth;
    const cssH = cv.clientHeight;
    if (!cssW || !cssH) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) {
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(cssH * dpr);
    }
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const s = cssW / TERRAIN.w; // échelle terrain → px CSS

    // Terrain
    ctx.fillStyle = GRAVIER;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, cssW - 3, cssH - 3);
    // Ligne de lancer
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, (LANCEUR.y - R_BOULE - 2) * s);
    ctx.lineTo(cssW, (LANCEUR.y - R_BOULE - 2) * s);
    ctx.stroke();

    const disque = (x: number, y: number, r: number, couleur: string, bord = "rgba(0,0,0,0.35)") => {
      ctx.beginPath();
      ctx.arc(x * s, y * s, r * s, 0, Math.PI * 2);
      ctx.fillStyle = couleur;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = bord;
      ctx.stroke();
      // reflet
      ctx.beginPath();
      ctx.arc((x - r * 0.3) * s, (y - r * 0.3) * s, r * 0.28 * s, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fill();
    };

    // Cochonnet
    const coch = g.corps[0];
    disque(coch.x, coch.y, coch.r, "#C8683C");

    // Boules posées
    for (const c of g.corps) {
      if (c.type !== "boule") continue;
      disque(c.x, c.y, c.r, g.joueurs[c.joueur]?.couleur || "#ccc");
    }

    // Boule fantôme + viseur pendant la visée
    if (g.etat === "vise") {
      const couleur = g.joueurs[g.lanceur]?.couleur || "#fff";
      disque(LANCEUR.x, LANCEUR.y, R_BOULE, couleur, "rgba(255,255,255,0.7)");
      if (drag.current.actif) {
        const dx = drag.current.x - drag.current.x0;
        const dy = drag.current.y - drag.current.y0;
        const len = Math.hypot(dx, dy);
        if (len > 4) {
          const maxDrag = cssH * 0.5;
          const p = Math.min(len, maxDrag) / maxDrag; // puissance 0..1
          const ux = dx / len;
          const uy = dy / len;
          const lx = LANCEUR.x * s;
          const ly = LANCEUR.y * s;
          const fl = p * cssH * 0.42; // longueur de la flèche
          const ex = lx + ux * fl;
          const ey = ly + uy * fl;
          ctx.strokeStyle = `rgba(255,255,255,${0.5 + p * 0.4})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          // pointe
          const ang = Math.atan2(uy, ux);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 10 * Math.cos(ang - 0.4), ey - 10 * Math.sin(ang - 0.4));
          ctx.lineTo(ex - 10 * Math.cos(ang + 0.4), ey - 10 * Math.sin(ang + 0.4));
          ctx.closePath();
          ctx.fillStyle = "#fff";
          ctx.fill();
          // jauge de puissance
          const gw = cssW * 0.6;
          const gx = (cssW - gw) / 2;
          const gy = cssH - 16;
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillRect(gx, gy, gw, 8);
          ctx.fillStyle = p > 0.8 ? "#E14B3A" : "#F2C14E";
          ctx.fillRect(gx, gy, gw * p, 8);
        }
      }
    }
  }

  // ── Entrée tactile ──
  function ptr(e: React.PointerEvent<HTMLCanvasElement>) {
    const cv = canvasRef.current;
    if (!cv) return { x: 0, y: 0 };
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = G.current;
    if (!g || g.etat !== "vise") return;
    const { x, y } = ptr(e);
    drag.current = { actif: true, x0: x, y0: y, x, y };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    dessiner();
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current.actif) return;
    const { x, y } = ptr(e);
    drag.current.x = x;
    drag.current.y = y;
    dessiner();
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current.actif) return;
    drag.current.actif = false;
    const { x, y } = ptr(e);
    const dx = x - drag.current.x0;
    const dy = y - drag.current.y0;
    const len = Math.hypot(dx, dy);
    const cv = canvasRef.current;
    const cssH = cv ? cv.clientHeight : 300;
    if (len < 6) { dessiner(); return; } // simple tap : pas de lancer
    const maxDrag = cssH * 0.5;
    const p = Math.min(len, maxDrag) / maxDrag;
    const mag = p * V_MAX;
    lancer((dx / len) * mag, (dy / len) * mag);
  };

  // Dessin initial quand on entre en jeu / redimensionnement.
  useEffect(() => {
    if (phase === "reglages") return;
    const id = requestAnimationFrame(() => dessiner());
    const onResize = () => dessiner();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  // ══ Réglages ══
  if (phase === "reglages") {
    const stepper = (val: number, set: (n: number) => void, min: number, max: number) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => set(Math.max(min, val - 1))} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${COL.bleu1}`, background: COL.panneau, color: COL.creme, fontWeight: 800, fontSize: "1.2rem" }}>−</button>
        <span style={{ minWidth: 28, textAlign: "center", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.3rem", color: COL.or }}>{val}</span>
        <button onClick={() => set(Math.min(max, val + 1))} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${COL.bleu1}`, background: COL.panneau, color: COL.creme, fontWeight: 800, fontSize: "1.2rem" }}>+</button>
      </div>
    );
    return (
      <>
        <Entete titre="La Pétanque" onRetour={onRetour} />
        <section style={{ margin: "14px 16px 0" }}>
          <p style={{ margin: "0 0 16px", color: COL.texte2, fontSize: "0.92rem", lineHeight: 1.5 }}>
            Glisse le doigt vers la cible pour lancer : <strong style={{ color: COL.creme }}>plus le geste est long/fort, plus la boule part loin</strong>. Pointe pour approcher, tire pour chasser. Chacun son tour sur ce téléphone. 🍹
          </p>

          <h3 style={{ margin: "0 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>Les joueurs (2 à 6)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {joueurs.map((j, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 12, padding: "8px 12px" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: j.couleur, flexShrink: 0, border: "2px solid rgba(255,255,255,0.5)" }} aria-hidden="true" />
                <input value={j.nom} onChange={(e) => renommer(i, e.target.value)} maxLength={14}
                  style={{ flex: 1, minWidth: 0, minHeight: 40, padding: "8px 10px", fontSize: "0.95rem", background: "#14110F", border: `1px solid ${COL.bleu1}`, borderRadius: 8, color: COL.creme }} />
                {joueurs.length > 2 && (
                  <button onClick={() => retirerJoueur(i)} aria-label={`Retirer ${j.nom}`} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "rgba(243,232,207,0.1)", color: COL.texte2, fontWeight: 800 }}>×</button>
                )}
              </div>
            ))}
          </div>
          {joueurs.length < 6 && (
            <button onClick={ajouterJoueur} className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 10, minHeight: 44, padding: "0 16px" }}>+ Ajouter un joueur</button>
          )}

          <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: COL.texte2, marginBottom: 6 }}>Boules / joueur</div>
              {stepper(boulesParJoueur, setBoulesParJoueur, 1, 6)}
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: COL.texte2, marginBottom: 6 }}>Points pour gagner</div>
              {stepper(pointsPourGagner, setPointsPourGagner, 3, 21)}
            </div>
          </div>

          <button onClick={commencer} className="pmu-arcade" style={{ width: "100%", marginTop: 24, minHeight: 64, fontSize: "1.1rem" }}>
            🎯 Lancer la partie
          </button>
          <div style={{ height: 16 }} />
        </section>
      </>
    );
  }

  // ══ Jeu / Fin ══
  const g = G.current;
  if (!g) return null;
  const scoreboard = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
      {g.joueurs.map((j, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: i === g.lanceur && g.etat === "vise" ? "rgba(233,196,106,0.16)" : COL.panneau, border: `1px solid ${i === g.lanceur && g.etat === "vise" ? COL.or : COL.bleu1}`, borderRadius: 999, padding: "4px 10px", fontSize: "0.8rem", fontWeight: 800, color: COL.creme }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: j.couleur }} aria-hidden="true" />
          {j.nom} · {g.scores[i]}
        </span>
      ))}
    </div>
  );

  return (
    <>
      <Entete titre="La Pétanque" onRetour={onRetour} />
      <section style={{ margin: "10px 16px 0" }}>
        {phase === "jeu" && (
          <div style={{ textAlign: "center", marginBottom: 8, minHeight: 26 }}>
            {g.etat === "vise" && (
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: g.joueurs[g.lanceur]?.couleur }}>
                🎯 À toi, {g.joueurs[g.lanceur]?.nom} <span style={{ color: COL.texte2, fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 700 }}>· {g.boulesRestantes[g.lanceur]} boule{g.boulesRestantes[g.lanceur] > 1 ? "s" : ""}</span>
              </span>
            )}
            {g.etat === "lance" && <span style={{ color: COL.texte2, fontWeight: 700 }}>La boule roule…</span>}
            {g.etat === "mene-finie" && g.resultat && (
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: COL.or }}>
                {g.resultat.gagnant >= 0 ? `Mène pour ${g.joueurs[g.resultat.gagnant].nom} : +${g.resultat.points} !` : "Mène nulle"}
              </span>
            )}
          </div>
        )}

        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          style={{ width: "100%", aspectRatio: `${TERRAIN.w} / ${TERRAIN.h}`, display: "block", borderRadius: 14, border: `2px solid ${COL.or}`, touchAction: "none", background: GRAVIER }}
        />

        {scoreboard}

        {phase === "jeu" && g.etat === "mene-finie" && (
          <button onClick={meneSuivante} className="pmu-arcade" style={{ width: "100%", marginTop: 14, minHeight: 56 }}>Mène suivante →</button>
        )}

        {phase === "fin" && g.vainqueur !== null && (
          <div style={{ marginTop: 14, background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "2.4rem" }} aria-hidden="true">🏆</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: COL.or }}>
              {g.joueurs[g.vainqueur].nom} remporte la partie !
            </div>
            <button onClick={() => setPhase("reglages")} className="pmu-arcade" style={{ width: "100%", marginTop: 14, minHeight: 54 }}>Rejouer</button>
          </div>
        )}

        {phase === "jeu" && (
          <p style={{ margin: "12px 2px 0", fontSize: "0.78rem", color: COL.texte2, lineHeight: 1.45, textAlign: "center" }}>
            Glisse vers la cible et relâche · la longueur du glissé = la puissance.
          </p>
        )}
        <div style={{ height: 18 }} />
      </section>
    </>
  );
}
