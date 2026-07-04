// ──────────────────────────────────────────────────────────────────────────
// « Partager ma soirée » : génère une image satirique (canvas, format story
// 1080×1350) dans la DA enseigne de bar — BAC géant, état d'ivresse, niveau
// de pilier — puis la partage via la feuille de partage native (WhatsApp &
// co). Repli : téléchargement direct. Aucun asset : tout est dessiné.
// L'avertissement sérieux (éthylotest, volant) fait PARTIE de l'image.
// ──────────────────────────────────────────────────────────────────────────

export interface DonneesSoiree {
  pseudo: string;
  bac: number;
  titreEtat: string;
  emoji: string;
  nbConsos: number;
  titreNiveau: string;
}

const L = 1080;
const H = 1350;
const ARDOISE = '#1B1917';
const OR = '#E9C46A';
const ROUGE = '#E14B3A';
const CREME = '#F3E8CF';
const TEXTE2 = 'rgba(243,232,207,0.72)';
const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

// Bande de nappe vichy (damier rouge/crème), signature de la DA.
function vichy(ctx: CanvasRenderingContext2D, y: number, hauteur: number) {
  const c = 30;
  for (let j = 0; j * c < hauteur; j++) {
    for (let i = 0; i * c < L; i++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? ROUGE : CREME;
      ctx.fillRect(i * c, y + j * c, c, c);
    }
  }
}

function dessiner(d: DonneesSoiree): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = L;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas indisponible');

  ctx.fillStyle = ARDOISE;
  ctx.fillRect(0, 0, L, H);
  vichy(ctx, 0, 60);
  vichy(ctx, H - 60, 60);
  ctx.textAlign = 'center';

  // Enseigne
  ctx.fillStyle = OR;
  ctx.font = `800 72px ${SERIF}`;
  ctx.fillText("LA BOÎT'À SOIF", L / 2, 175);
  ctx.fillStyle = TEXTE2;
  ctx.font = `800 30px ${SANS}`;
  ctx.fillText("L'APPLI DES PILIERS DE BAR", L / 2, 225);

  // Filet or
  ctx.strokeStyle = OR;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(140, 265);
  ctx.lineTo(L - 140, 265);
  ctx.stroke();

  // L'état de la bête
  ctx.font = '150px serif';
  ctx.fillText(d.emoji, L / 2, 445);

  const bacTxt = d.bac.toFixed(2).replace('.', ',');
  ctx.fillStyle = OR;
  ctx.font = `700 230px ${SERIF}`;
  ctx.fillText(bacTxt, L / 2, 700);
  ctx.fillStyle = CREME;
  ctx.font = `800 46px ${SANS}`;
  ctx.fillText('g/L au compteur', L / 2, 765);

  ctx.fillStyle = ROUGE;
  ctx.font = `700 62px ${SERIF}`;
  ctx.fillText(d.titreEtat.toUpperCase(), L / 2, 880);

  ctx.fillStyle = CREME;
  ctx.font = `700 40px ${SANS}`;
  ctx.fillText(`${d.nbConsos} conso${d.nbConsos > 1 ? 's' : ''} ce soir · ${d.titreNiveau}`, L / 2, 960);
  ctx.fillStyle = TEXTE2;
  ctx.font = `600 34px ${SANS}`;
  ctx.fillText(`Signé : ${d.pseudo}`, L / 2, 1020);

  // Avertissement sérieux — non négociable, il voyage avec l'image.
  ctx.fillStyle = TEXTE2;
  ctx.font = `600 30px ${SANS}`;
  ctx.fillText('Estimation ludique — ne remplace pas un éthylotest.', L / 2, 1170);
  ctx.fillStyle = CREME;
  ctx.font = `800 32px ${SANS}`;
  ctx.fillText("L'abus d'alcool est dangereux. Jamais au volant. 🚕", L / 2, 1225);

  return canvas;
}

/** Génère et partage l'image. Renvoie ce qui s'est réellement passé. */
export async function partagerImageSoiree(d: DonneesSoiree): Promise<'partage' | 'telecharge' | 'echec'> {
  try {
    const canvas = dessiner(d);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return 'echec';
    const fichier = new File([blob], 'ma-soiree-boite-a-soif.png', { type: 'image/png' });

    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [fichier] })) {
      try {
        await navigator.share({ files: [fichier], title: "La Boît'à Soif", text: 'Ma soirée à la Boît’à Soif 🍻' });
        return 'partage';
      } catch {
        return 'partage'; // partage annulé par l'utilisateur : ne rien re-proposer
      }
    }

    // Repli (desktop, vieux navigateurs) : téléchargement direct.
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fichier.name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return 'telecharge';
  } catch {
    return 'echec';
  }
}
