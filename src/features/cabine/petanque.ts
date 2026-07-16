// ──────────────────────────────────────────────────────────────────────────
// La Pétanque — petit moteur physique 2D (vue de dessus). Terrain de gravier,
// boules qui roulent avec frottement, rebonds amortis sur les bords, collisions
// cercle-cercle (pour « tirer » et pousser). 100 % maison, aucune dépendance.
// ──────────────────────────────────────────────────────────────────────────

export interface Corps {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  type: "boule" | "cochonnet";
  joueur: number; // index du joueur (−1 pour le cochonnet)
}

// Unités « terrain » (converties en pixels à l'affichage). Portrait : on lance
// du bas vers le cochonnet placé en haut.
export const TERRAIN = { w: 100, h: 150 };
export const R_BOULE = 3.4;
export const R_COCHONNET = 1.7;
export const LANCEUR = { x: 50, y: 141 };
export const V_MAX = 4.8; // vitesse max au lancer (unités/frame)

const FROTTEMENT = 0.983; // décélération par frame (~60 fps)
const ARRET = 0.045; // seuil sous lequel un corps s'arrête
const AMORTI_MUR = 0.5; // perte de vitesse au rebond sur un bord
const RESTITUTION = 0.85; // élasticité des chocs entre boules

/** Avance la simulation d'un pas. Renvoie true tant qu'au moins un corps bouge. */
export function pasSimulation(corps: Corps[]): boolean {
  let bouge = false;

  // Intégration + frottement + murs.
  for (const c of corps) {
    if (c.vx === 0 && c.vy === 0) continue;
    c.x += c.vx;
    c.y += c.vy;
    c.vx *= FROTTEMENT;
    c.vy *= FROTTEMENT;

    if (c.x < c.r) { c.x = c.r; c.vx = Math.abs(c.vx) * AMORTI_MUR; }
    else if (c.x > TERRAIN.w - c.r) { c.x = TERRAIN.w - c.r; c.vx = -Math.abs(c.vx) * AMORTI_MUR; }
    if (c.y < c.r) { c.y = c.r; c.vy = Math.abs(c.vy) * AMORTI_MUR; }
    else if (c.y > TERRAIN.h - c.r) { c.y = TERRAIN.h - c.r; c.vy = -Math.abs(c.vy) * AMORTI_MUR; }

    if (Math.hypot(c.vx, c.vy) < ARRET) { c.vx = 0; c.vy = 0; }
    else bouge = true;
  }

  // Collisions cercle-cercle (masses égales).
  for (let i = 0; i < corps.length; i++) {
    for (let j = i + 1; j < corps.length; j++) {
      const a = corps[i];
      const b = corps[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const chevauche = a.r + b.r - d;
      if (chevauche <= 0) continue;
      const nx = dx / d;
      const ny = dy / d;
      // On sépare les deux corps.
      a.x -= (nx * chevauche) / 2;
      a.y -= (ny * chevauche) / 2;
      b.x += (nx * chevauche) / 2;
      b.y += (ny * chevauche) / 2;
      // Échange d'impulsion le long de la normale.
      const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn < 0) {
        const imp = (-(1 + RESTITUTION) * vn) / 2;
        a.vx -= imp * nx;
        a.vy -= imp * ny;
        b.vx += imp * nx;
        b.vy += imp * ny;
        bouge = true;
      }
    }
  }

  return bouge;
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Meilleure (plus petite) distance au cochonnet parmi les boules d'un joueur. */
export function meilleureDistanceJoueur(corps: Corps[], cochonnet: Corps, joueur: number): number {
  let best = Infinity;
  for (const c of corps) {
    if (c.type === "boule" && c.joueur === joueur) {
      best = Math.min(best, distance(c, cochonnet));
    }
  }
  return best;
}

export interface ResultatMene {
  gagnant: number; // index du joueur, −1 si personne
  points: number; // points marqués pour cette mène
}

/**
 * Score d'une mène : le joueur dont la boule est la plus proche gagne, et marque
 * autant de points qu'il a de boules plus proches que la meilleure boule adverse.
 */
export function scorerMene(corps: Corps[], cochonnet: Corps, nbJoueurs: number): ResultatMene {
  const meilleures: number[] = [];
  for (let j = 0; j < nbJoueurs; j++) meilleures.push(meilleureDistanceJoueur(corps, cochonnet, j));

  let gagnant = -1;
  let min = Infinity;
  meilleures.forEach((d, j) => {
    if (d < min) { min = d; gagnant = j; }
  });
  if (gagnant === -1 || min === Infinity) return { gagnant: -1, points: 0 };

  // Meilleure distance parmi TOUS les autres joueurs.
  let meilleureAdverse = Infinity;
  meilleures.forEach((d, j) => {
    if (j !== gagnant) meilleureAdverse = Math.min(meilleureAdverse, d);
  });

  let points = 0;
  for (const c of corps) {
    if (c.type === "boule" && c.joueur === gagnant && distance(c, cochonnet) < meilleureAdverse) points++;
  }
  return { gagnant, points: Math.max(1, points) };
}

/**
 * À qui de jouer : le joueur qui « n'a pas le point », c'est-à-dire dont la
 * meilleure boule est la plus éloignée (ou qui n'a pas encore joué), parmi ceux
 * à qui il reste des boules. −1 si tout le monde a joué ses boules.
 */
export function prochainLanceur(
  corps: Corps[],
  cochonnet: Corps,
  boulesRestantes: number[],
): number {
  let choix = -1;
  let pire = -Infinity;
  for (let j = 0; j < boulesRestantes.length; j++) {
    if (boulesRestantes[j] <= 0) continue;
    const d = meilleureDistanceJoueur(corps, cochonnet, j);
    if (d > pire) { pire = d; choix = j; }
  }
  return choix;
}
