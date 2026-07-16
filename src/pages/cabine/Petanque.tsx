import { useEffect, useRef, useState } from "react";
import { Entete } from "./Cadre";
import { COL, FRAUNCES } from "../../ui/theme";
import { vibrer, choc as sonChoc, lancerBoule as sonLancer, parlerTavernier } from "../../features/audio/sons";
import {
  pasSimulation, scorerMene, prochainLanceur, distance,
  TERRAIN, R_BOULE, R_COCHONNET, LANCEUR, V_MAX,
  type Corps, type ResultatMene,
} from "../../features/cabine/petanque";

// La Pétanque — vue de dessus, lancer au glissé (plus le geste est fort, plus
// la boule part loin). Boules métalliques, gravier, sons, poussière, tremblement
// à l'impact, mesure en fin de mène et la fameuse Fanny à 13-0. Bien de comptoir.

const COULEURS = ["#F2C14E", "#E14B3A", "#5BAA5B", "#4E86C7", "#EC9A4B", "#B07CC6"];
const GRAVIER = "#b39a6b";

interface Joueur { nom: string; couleur: string }
interface Traine { x: number; y: number; vie: number; couleur: string }
interface Particule { x: number; y: number; vx: number; vy: number; vie: number; max: number }
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
  fanny: string | null;
  corps: Corps[]; // [0] = cochonnet
}

// ── Aides couleur (dégradés métalliques) ──
function melange(hex: string, cible: number, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const m = (c: number) => Math.round(c + (cible - c) * amt);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
const eclaircir = (h: string, a: number) => melange(h, 255, a);
const assombrir = (h: string, a: number) => melange(h, 0, a);
const auHasard = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function Petanque({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<"reglages" | "jeu" | "fin">("reglages");
  const [annonce, setAnnonce] = useState<string>("");

  const [joueurs, setJoueurs] = useState<Joueur[]>([
    { nom: "Joueur 1", couleur: COULEURS[0] },
    { nom: "Joueur 2", couleur: COULEURS[1] },
  ]);
  const [boulesParJoueur, setBoulesParJoueur] = useState(3);
  const [pointsPourGagner, setPointsPourGagner] = useState(13);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const G = useRef<EtatJeu | null>(null);
  const animRef = useRef<number | null>(null);
  const drag = useRef({ actif: false, x0: 0, y0: 0, x: 0, y: 0 });
  const graviers = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const trainee = useRef<Traine[]>([]);
  const particules = useRef<Particule[]>([]);
  const shake = useRef(0);
  const chocMax = useRef(0);
  const derniereBoule = useRef<Corps | null>(null);
  const annonceTimer = useRef<number | undefined>(undefined);
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  // Gravier (semis fixe généré une fois).
  if (graviers.current.length === 0) {
    const g: { x: number; y: number; r: number; a: number }[] = [];
    for (let i = 0; i < 140; i++) {
      g.push({ x: Math.random() * TERRAIN.w, y: Math.random() * TERRAIN.h, r: 0.3 + Math.random() * 0.7, a: 0.04 + Math.random() * 0.1 });
    }
    graviers.current = g;
  }

  // ── Réglages ──
  const ajouterJoueur = () => setJoueurs((j) => (j.length >= 6 ? j : [...j, { nom: `Joueur ${j.length + 1}`, couleur: COULEURS[j.length % COULEURS.length] }]));
  const retirerJoueur = (i: number) => setJoueurs((j) => (j.length <= 2 ? j : j.filter((_, k) => k !== i)));
  const renommer = (i: number, nom: string) => setJoueurs((j) => j.map((p, k) => (k === i ? { ...p, nom: nom.slice(0, 14) } : p)));

  // ── Effets ──
  function poussiere(x: number, y: number, force: number) {
    const n = 3 + Math.floor(force * 9);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.2 + Math.random() * 1.1) * (0.5 + force);
      const max = 16 + Math.random() * 14;
      particules.current.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: max, max });
    }
  }
  function majEffets() {
    trainee.current = trainee.current.filter((t) => (t.vie -= 0.09) > 0);
    particules.current = particules.current.filter((p) => {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.88; p.vy *= 0.88; p.vie -= 1;
      return p.vie > 0;
    });
    if (shake.current > 0.15) shake.current *= 0.84; else shake.current = 0;
  }

  // ── Cycle de jeu ──
  function placerCochonnet(): Corps {
    return { x: 28 + Math.random() * (TERRAIN.w - 56), y: 20 + Math.random() * 34, vx: 0, vy: 0, r: R_COCHONNET, type: "cochonnet", joueur: -1 };
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
    trainee.current = []; particules.current = [];
    rerender();
    dessiner();
  }
  function commencer() {
    G.current = {
      joueurs, boulesParJoueur, pointsPourGagner,
      scores: joueurs.map(() => 0), boulesRestantes: joueurs.map(() => boulesParJoueur),
      lanceur: 0, etat: "vise", mene: 0, resultat: null, vainqueur: null, fanny: null, corps: [],
    };
    setPhase("jeu");
    nouvelleMene(0);
  }
  function lancer(vx: number, vy: number) {
    const g = G.current;
    if (!g || g.etat !== "vise") return;
    const b: Corps = { x: LANCEUR.x, y: LANCEUR.y, vx, vy, r: R_BOULE, type: "boule", joueur: g.lanceur };
    g.corps.push(b);
    derniereBoule.current = b;
    g.boulesRestantes[g.lanceur] -= 1;
    g.etat = "lance";
    chocMax.current = 0;
    vibrer(16); sonLancer();
    rerender();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    boucle();
  }
  function annoncer(msg: string) {
    setAnnonce(msg);
    parlerTavernier(msg, 0.5, 1);
    if (annonceTimer.current) window.clearTimeout(annonceTimer.current);
    annonceTimer.current = window.setTimeout(() => setAnnonce(""), 1700);
  }
  function estLePoint(b: Corps): boolean {
    const g = G.current;
    if (!g) return false;
    const dB = distance(b, g.corps[0]);
    return g.corps.every((c) => c.type !== "boule" || c === b || distance(c, g.corps[0]) >= dB - 0.01);
  }
  function boucle() {
    const g = G.current;
    if (!g) { animRef.current = null; return; }
    let physBouge = false;
    if (g.etat === "lance") {
      const r = pasSimulation(g.corps);
      physBouge = r.bouge;
      for (const c of r.chocs) {
        if (c.force > 0.06) { sonChoc(c.force); poussiere(c.x, c.y, c.force); shake.current = Math.max(shake.current, c.force * 5.5); chocMax.current = Math.max(chocMax.current, c.force); if (c.force > 0.25) vibrer(20); }
      }
      for (const co of g.corps) {
        if (Math.hypot(co.vx, co.vy) > 0.5) trainee.current.push({ x: co.x, y: co.y, vie: 1, couleur: co.type === "cochonnet" ? "#C8683C" : (g.joueurs[co.joueur]?.couleur || "#ccc") });
      }
      if (trainee.current.length > 90) trainee.current.splice(0, trainee.current.length - 90);
      if (!physBouge) finDuLancer();
    }
    majEffets();
    dessiner();
    const effets = particules.current.length > 0 || trainee.current.length > 0 || shake.current > 0.15;
    if (physBouge || g.etat === "lance" || effets) animRef.current = requestAnimationFrame(boucle);
    else animRef.current = null;
  }
  function finDuLancer() {
    const g = G.current;
    if (!g) return;
    const jete = derniereBoule.current;
    if (jete) poussiere(jete.x, jete.y, 0.4);
    // Callout façon tavernier
    if (chocMax.current > 0.32) annoncer(auHasard(["Carreau !", "Ça déménage !", "Boum, dégagé !", "Beau tir !"]));
    else if (jete && estLePoint(jete)) annoncer(auHasard(["Le point !", "Collé au bouchon !", "Joli point !", "Pointu !"]));
    else if (Math.random() < 0.4) annoncer(auHasard(["Petit bras…", "Tu pointes ou tu tires ?", "À refaire !", "Bof, bof."]));

    const total = g.boulesRestantes.reduce((s, n) => s + n, 0);
    if (total === 0) { finMene(); return; }
    g.lanceur = prochainLanceur(g.corps, g.corps[0], g.boulesRestantes);
    g.etat = "vise";
    rerender();
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
      // Fanny : un perdant à zéro pointé.
      const perdantFanny = g.scores.findIndex((s, i) => i !== meneur && s === 0);
      g.fanny = perdantFanny >= 0 ? g.joueurs[perdantFanny].nom : null;
      setPhase("fin");
      setTimeout(() => parlerTavernier(g.fanny ? `Fanny pour ${g.fanny} !` : `Victoire de ${g.joueurs[meneur].nom} !`, 0.5, 0.95), 250);
    }
    rerender();
  }
  const meneSuivante = () => {
    const g = G.current;
    if (!g) return;
    nouvelleMene(g.resultat && g.resultat.gagnant >= 0 ? g.resultat.gagnant : 0);
  };

  // ── Rendu ──
  function boule(ctx: CanvasRenderingContext2D, cx: number, cy: number, rp: number, couleur: string, grooves: boolean) {
    ctx.beginPath();
    ctx.ellipse(cx + rp * 0.16, cy + rp * 0.26, rp * 0.98, rp * 0.66, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fill();
    const grad = ctx.createRadialGradient(cx - rp * 0.35, cy - rp * 0.4, rp * 0.1, cx, cy, rp);
    grad.addColorStop(0, eclaircir(couleur, 0.55));
    grad.addColorStop(0.55, couleur);
    grad.addColorStop(1, assombrir(couleur, 0.45));
    ctx.beginPath(); ctx.arc(cx, cy, rp, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
    if (grooves) {
      ctx.strokeStyle = "rgba(0,0,0,0.16)";
      ctx.lineWidth = Math.max(0.8, rp * 0.045);
      for (const rr of [0.42, 0.62, 0.82]) { ctx.beginPath(); ctx.arc(cx, cy, rp * rr, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.beginPath(); ctx.arc(cx - rp * 0.32, cy - rp * 0.36, rp * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, rp, 0, Math.PI * 2); ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.stroke();
  }

  function dessiner() {
    const g = G.current;
    const cv = canvasRef.current;
    if (!g || !cv) return;
    const cssW = cv.clientWidth, cssH = cv.clientHeight;
    if (!cssW || !cssH) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) { cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr); }
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const ox = shake.current ? (Math.random() - 0.5) * shake.current : 0;
    const oy = shake.current ? (Math.random() - 0.5) * shake.current : 0;
    ctx.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr);
    const s = cssW / TERRAIN.w;

    // Terrain gravier
    ctx.fillStyle = GRAVIER;
    ctx.fillRect(-4, -4, cssW + 8, cssH + 8);
    for (const gr of graviers.current) {
      ctx.beginPath(); ctx.arc(gr.x * s, gr.y * s, gr.r * s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(60,44,20,${gr.a})`; ctx.fill();
    }
    // Cadre bois
    ctx.strokeStyle = "#5a3d22"; ctx.lineWidth = 7; ctx.strokeRect(3.5, 3.5, cssW - 7, cssH - 7);
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1.5; ctx.strokeRect(6.5, 6.5, cssW - 13, cssH - 13);
    // Ligne de lancer (cordeau)
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(8, (LANCEUR.y - R_BOULE - 2) * s); ctx.lineTo(cssW - 8, (LANCEUR.y - R_BOULE - 2) * s); ctx.stroke();
    ctx.setLineDash([]);

    // Traînée
    for (const t of trainee.current) {
      ctx.beginPath(); ctx.arc(t.x * s, t.y * s, R_BOULE * 0.5 * s * t.vie, 0, Math.PI * 2);
      ctx.fillStyle = melange(t.couleur, 255, 0.2); ctx.globalAlpha = t.vie * 0.4; ctx.fill(); ctx.globalAlpha = 1;
    }

    // Mesure en fin de mène
    if (g.etat === "mene-finie") {
      const coch = g.corps[0];
      const proches = g.corps.filter((c) => c.type === "boule").sort((a, b) => distance(a, coch) - distance(b, coch)).slice(0, 2);
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
      proches.forEach((b, i) => {
        ctx.strokeStyle = i === 0 ? "#fff" : "rgba(255,255,255,0.5)";
        ctx.beginPath(); ctx.moveTo(coch.x * s, coch.y * s); ctx.lineTo(b.x * s, b.y * s); ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Cochonnet + boules
    const coch = g.corps[0];
    boule(ctx, coch.x * s, coch.y * s, coch.r * s, "#C8683C", false);
    for (const c of g.corps) {
      if (c.type !== "boule") continue;
      boule(ctx, c.x * s, c.y * s, c.r * s, g.joueurs[c.joueur]?.couleur || "#ccc", true);
    }

    // Poussière
    for (const p of particules.current) {
      ctx.beginPath(); ctx.arc(p.x * s, p.y * s, (1 + (1 - p.vie / p.max) * 2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(120,95,55,${(p.vie / p.max) * 0.5})`; ctx.fill();
    }

    // Boule fantôme + viseur
    if (g.etat === "vise") {
      const couleur = g.joueurs[g.lanceur]?.couleur || "#fff";
      boule(ctx, LANCEUR.x * s, LANCEUR.y * s, R_BOULE * s, couleur, true);
      if (drag.current.actif) {
        const dx = drag.current.x - drag.current.x0, dy = drag.current.y - drag.current.y0;
        const len = Math.hypot(dx, dy);
        if (len > 4) {
          const maxDrag = cssH * 0.5;
          const p = Math.min(len, maxDrag) / maxDrag;
          const ux = dx / len, uy = dy / len;
          const lx = LANCEUR.x * s, ly = LANCEUR.y * s;
          const teinte = p > 0.8 ? "#E14B3A" : p > 0.5 ? "#EC9A4B" : "#5BAA5B";
          // ligne pointillée directionnelle
          ctx.setLineDash([5, 5]); ctx.strokeStyle = teinte; ctx.lineWidth = 3;
          const fl = p * cssH * 0.45;
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + ux * fl, ly + uy * fl); ctx.stroke();
          ctx.setLineDash([]);
          // pointe
          const ex = lx + ux * fl, ey = ly + uy * fl, ang = Math.atan2(uy, ux);
          ctx.beginPath(); ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 11 * Math.cos(ang - 0.4), ey - 11 * Math.sin(ang - 0.4));
          ctx.lineTo(ex - 11 * Math.cos(ang + 0.4), ey - 11 * Math.sin(ang + 0.4));
          ctx.closePath(); ctx.fillStyle = teinte; ctx.fill();
          // % puissance
          ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "center";
          ctx.fillText(`${Math.round(p * 100)} %`, lx, ly + R_BOULE * s + 16);
        }
      }
    }
  }

  // ── Entrée ──
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
    drag.current.x = x; drag.current.y = y;
    dessiner();
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current.actif) return;
    drag.current.actif = false;
    const { x, y } = ptr(e);
    const dx = x - drag.current.x0, dy = y - drag.current.y0, len = Math.hypot(dx, dy);
    const cv = canvasRef.current;
    const cssH = cv ? cv.clientHeight : 300;
    if (len < 6) { dessiner(); return; }
    const p = Math.min(len, cssH * 0.5) / (cssH * 0.5);
    const mag = p * V_MAX;
    lancer((dx / len) * mag, (dy / len) * mag);
  };

  useEffect(() => {
    if (phase === "reglages") return;
    const id = requestAnimationFrame(() => dessiner());
    const onResize = () => dessiner();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (annonceTimer.current) window.clearTimeout(annonceTimer.current);
  }, []);

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
            Glisse le doigt vers la cible : <strong style={{ color: COL.creme }}>plus le geste est long/fort, plus la boule part loin</strong>. Pointe pour approcher, tire pour chasser. Chacun son tour. 🍹
          </p>
          <h3 style={{ margin: "0 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.05rem", color: COL.or }}>Les joueurs (2 à 6)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {joueurs.map((j, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 12, padding: "8px 12px" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: j.couleur, flexShrink: 0, border: "2px solid rgba(255,255,255,0.5)" }} aria-hidden="true" />
                <input value={j.nom} onChange={(e) => renommer(i, e.target.value)} maxLength={14}
                  style={{ flex: 1, minWidth: 0, minHeight: 40, padding: "8px 10px", fontSize: "0.95rem", background: "#14110F", border: `1px solid ${COL.bleu1}`, borderRadius: 8, color: COL.creme }} />
                {joueurs.length > 2 && <button onClick={() => retirerJoueur(i)} aria-label={`Retirer ${j.nom}`} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "rgba(243,232,207,0.1)", color: COL.texte2, fontWeight: 800 }}>×</button>}
              </div>
            ))}
          </div>
          {joueurs.length < 6 && <button onClick={ajouterJoueur} className="pmu-arcade pmu-arcade--ardoise" style={{ marginTop: 10, minHeight: 44, padding: "0 16px" }}>+ Ajouter un joueur</button>}
          <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: "0.8rem", fontWeight: 700, color: COL.texte2, marginBottom: 6 }}>Boules / joueur</div>{stepper(boulesParJoueur, setBoulesParJoueur, 1, 6)}</div>
            <div><div style={{ fontSize: "0.8rem", fontWeight: 700, color: COL.texte2, marginBottom: 6 }}>Points pour gagner</div>{stepper(pointsPourGagner, setPointsPourGagner, 3, 21)}</div>
          </div>
          <button onClick={commencer} className="pmu-arcade" style={{ width: "100%", marginTop: 24, minHeight: 64, fontSize: "1.1rem" }}>🎯 Lancer la partie</button>
          <div style={{ height: 16 }} />
        </section>
      </>
    );
  }

  const g = G.current;
  if (!g) return null;
  const boulesIcones = (n: number, couleur: string) => (
    <span style={{ display: "inline-flex", gap: 3, verticalAlign: "middle" }}>
      {Array.from({ length: n }).map((_, k) => <span key={k} style={{ width: 10, height: 10, borderRadius: "50%", background: couleur, border: "1px solid rgba(0,0,0,0.35)" }} />)}
    </span>
  );

  return (
    <>
      <Entete titre="La Pétanque" onRetour={onRetour} />
      <section style={{ margin: "10px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COL.texte2 }}>Mène {g.mene}</span>
          <span style={{ flex: 1, textAlign: "center", minHeight: 24 }}>
            {phase === "jeu" && g.etat === "vise" && (
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.1rem", color: g.joueurs[g.lanceur]?.couleur }}>
                🎯 {g.joueurs[g.lanceur]?.nom} {boulesIcones(g.boulesRestantes[g.lanceur], g.joueurs[g.lanceur]?.couleur)}
              </span>
            )}
            {phase === "jeu" && g.etat === "lance" && <span style={{ color: COL.texte2, fontWeight: 700 }}>La boule roule…</span>}
            {phase === "jeu" && g.etat === "mene-finie" && g.resultat && (
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.1rem", color: COL.or }}>
                {g.resultat.gagnant >= 0 ? `Mène pour ${g.joueurs[g.resultat.gagnant].nom} : +${g.resultat.points} !` : "Mène nulle"}
              </span>
            )}
          </span>
          <span style={{ width: 40 }} />
        </div>

        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
            style={{ width: "100%", aspectRatio: `${TERRAIN.w} / ${TERRAIN.h}`, display: "block", borderRadius: 14, touchAction: "none", background: GRAVIER, boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }} />
          {annonce && (
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(20,17,15,0.9)", color: COL.or, border: `2px solid ${COL.or}`, borderRadius: 999, padding: "6px 18px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", whiteSpace: "nowrap", pointerEvents: "none" }}>
              {annonce}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
          {g.joueurs.map((j, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: i === g.lanceur && g.etat === "vise" ? "rgba(233,196,106,0.16)" : COL.panneau, border: `1px solid ${i === g.lanceur && g.etat === "vise" ? COL.or : COL.bleu1}`, borderRadius: 999, padding: "4px 12px", fontSize: "0.82rem", fontWeight: 800, color: COL.creme }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: j.couleur }} aria-hidden="true" />{j.nom}<span style={{ color: COL.or }}>{g.scores[i]}</span>
            </span>
          ))}
        </div>

        {phase === "jeu" && g.etat === "mene-finie" && (
          <button onClick={meneSuivante} className="pmu-arcade" style={{ width: "100%", marginTop: 14, minHeight: 56 }}>Mène suivante →</button>
        )}

        {phase === "fin" && g.vainqueur !== null && (
          <div style={{ marginTop: 14, background: g.fanny ? "#341F1B" : COL.panneau, border: `2px solid ${g.fanny ? COL.rougeNeon : COL.or}`, borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "2.6rem" }} aria-hidden="true">{g.fanny ? "😘" : "🏆"}</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.4rem", color: g.fanny ? COL.rougeNeon : COL.or }}>
              {g.joueurs[g.vainqueur].nom} remporte la partie !
            </div>
            {g.fanny && (
              <p style={{ margin: "8px 0 0", color: COL.creme, fontWeight: 700, lineHeight: 1.45 }}>
                Fanny ! <strong style={{ color: COL.rougeNeon }}>{g.fanny}</strong> finit à zéro pointé… tradition oblige, il doit embrasser Fanny. 😳
              </p>
            )}
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
