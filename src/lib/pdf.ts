// Exports PDF imprimables des outils (jspdf, génération 100 % locale)

import { jsPDF } from 'jspdf';
import CONTENT from '../content';
import type { OutilFiche } from '../content/types';
import { lireStockage } from './storage';

const BLEU9 = '#0E3A4D';
const BLEU7 = '#15576F';
const ORANGE = '#E0662A';
const VERT = '#2E8540';
const ROUGE = '#C0392B';
const TEXTE = '#1C2B33';

function entete(doc: jsPDF, titre: string, sous: string) {
  doc.setFillColor(BLEU7);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(titre, 14, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(sous, 14, 25);
}

function pied(doc: jsPDF) {
  doc.setTextColor('#4A5A63');
  doc.setFontSize(9);
  doc.text("A'PHAS'AIDE — l'application des aidants de personnes aphasiques", 14, 290);
}

function pdfOuiNon(doc: jsPDF) {
  entete(doc, 'Planche OUI / NON', 'Pointez la réponse avec le doigt.');
  // Deux moitiés pleine page
  doc.setFillColor(VERT);
  doc.roundedRect(14, 50, 88, 200, 8, 8, 'F');
  doc.setFillColor(ROUGE);
  doc.roundedRect(108, 50, 88, 200, 8, 8, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(48);
  doc.text('OUI', 58, 155, { align: 'center' });
  doc.text('NON', 152, 155, { align: 'center' });
  doc.setFontSize(60);
  doc.text('✓', 58, 110, { align: 'center' });
  doc.text('✗', 152, 110, { align: 'center' });
  pied(doc);
}

function pdfEchelle(doc: jsPDF) {
  entete(doc, 'Échelle de bien-être', 'Pointez le visage qui correspond à votre ressenti.');
  CONTENT.echelle.forEach((e, i) => {
    const y = 60 + i * 44;
    doc.setFillColor(e.couleur);
    doc.circle(34, y, 14, 'F');
    // Yeux
    doc.setFillColor('#FFFFFF');
    doc.circle(29, y - 4, 2, 'F');
    doc.circle(39, y - 4, 2, 'F');
    doc.setTextColor(TEXTE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(e.label, 58, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#4A5A63');
    doc.text(`« ${e.dire} »`, 58, y + 10);
  });
  pied(doc);
}

function pdfCorps(doc: jsPDF) {
  entete(doc, 'Schéma du corps', 'Pointez la zone du corps où vous avez mal.');
  const sx = 0.42, ox = 63, oy = 48;
  CONTENT.corpsZones.forEach((z) => {
    doc.setFillColor('#D8E6EC');
    doc.setDrawColor(BLEU7);
    if (z.shape === 'circle') {
      doc.circle(ox + z.attrs.cx * sx, oy + z.attrs.cy * sx, z.attrs.r * sx, 'FD');
    } else if (z.shape === 'ellipse') {
      doc.ellipse(ox + z.attrs.cx * sx, oy + z.attrs.cy * sx, z.attrs.rx * sx, z.attrs.ry * sx, 'FD');
    } else {
      doc.roundedRect(ox + z.attrs.x * sx, oy + z.attrs.y * sx, z.attrs.width * sx, z.attrs.height * sx, 2, 2, 'FD');
    }
  });
  // Légende
  doc.setTextColor(TEXTE);
  doc.setFontSize(10);
  let y = 60;
  CONTENT.corpsZones.slice(0, 17).forEach((z) => {
    doc.text(`• ${z.face.charAt(0).toUpperCase() + z.face.slice(1)}`, 150, y);
    y += 7;
  });
  pied(doc);
}

function pdfTla(doc: jsPDF) {
  entete(doc, 'Tableau de Langage Assisté', 'Le repas — pointez les cases pour communiquer.');
  CONTENT.tla.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 14 + col * 94, y = 48 + row * 72;
    doc.setDrawColor('#DCEEF4');
    doc.setLineWidth(1.2);
    doc.roundedRect(x, y, 88, 64, 6, 6, 'D');
    doc.setTextColor(BLEU9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const lignes = doc.splitTextToSize(c.mot, 78);
    doc.text(lignes, x + 44, y + 36, { align: 'center' });
  });
  pied(doc);
}

function pdfCarte(doc: jsPDF, infos: { nom: string; prenom: string; confiance: string; tel: string }) {
  entete(doc, 'Carte « Je suis aphasique »', 'À découper au format carte bancaire (85,6 × 54 mm).');
  // Carte format CB ×1.6 pour lisibilité à la découpe
  const x = 35, y = 60, w = 140, h = 88;
  doc.setDrawColor(BLEU7);
  doc.setLineWidth(1.4);
  doc.roundedRect(x, y, w, h, 5, 5, 'D');
  doc.setTextColor(BLEU9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JE SUIS APHASIQUE', x + w / 2, y + 13, { align: 'center' });
  doc.setFillColor(ORANGE);
  doc.rect(x + w / 2 - 12, y + 17, 24, 1.6, 'F');
  doc.setFontSize(10);
  doc.text("J'ai des difficultés de langage.", x + w / 2, y + 27, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(TEXTE);
  doc.text("L'aphasie peut affecter ma capacité à : parler,", x + 8, y + 36);
  doc.text("comprendre, lire, écrire. Cela n'affecte ni mon", x + 8, y + 42);
  doc.text('intelligence, ni mon audition.', x + 8, y + 48);
  doc.text('Parlez lentement et utilisez des phrases courtes.', x + 8, y + 54);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BLEU7);
  doc.text('Merci de votre patience.', x + w / 2, y + 62, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#4A5A63');
  doc.setFontSize(8.5);
  doc.text(`Nom : ${infos.nom || '____________'}    Prénom : ${infos.prenom || '____________'}`, x + 8, y + 72);
  doc.text(`Personne de confiance : ${infos.confiance || '____________'}`, x + 8, y + 78);
  doc.text(`Téléphone : ${infos.tel || '____________'}`, x + 8, y + 84);
  // Repères de découpe
  doc.setDrawColor('#9FB3BC');
  doc.setLineDashPattern([2, 2], 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(x - 3, y - 3, w + 6, h + 6, 6, 6, 'D');
  doc.setLineDashPattern([], 0);
  pied(doc);
}

function pdfArbre(doc: jsPDF, arbre: { prenom: string; lien: string; niveau: number }[]) {
  entete(doc, 'Arbre généalogique', 'Ma famille — support de discussion.');
  const NIV = ['Grands-parents', 'Parents, fratrie — et moi', 'Enfants et petits-enfants'];
  let y = 50;
  NIV.forEach((label, n) => {
    doc.setTextColor('#4A5A63');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label.toUpperCase(), 14, y);
    y += 8;
    const items = arbre.filter((p) => p.niveau === n);
    if (!items.length) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#9FB3BC');
      doc.text('—', 18, y);
      y += 12;
    } else {
      let x = 18;
      items.forEach((p) => {
        if (x > 160) { x = 18; y += 32; }
        doc.setFillColor(p.prenom === 'Moi' ? BLEU7 : '#DCEEF4');
        doc.circle(x + 9, y + 6, 9, 'F');
        doc.setTextColor(p.prenom === 'Moi' ? '#FFFFFF' : BLEU9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text((p.prenom || '?')[0].toUpperCase(), x + 9, y + 8, { align: 'center' });
        doc.setTextColor(TEXTE);
        doc.setFontSize(9);
        doc.text(p.prenom, x + 9, y + 20, { align: 'center' });
        doc.setTextColor('#4A5A63');
        doc.setFontSize(7.5);
        if (p.lien) doc.text(p.lien, x + 9, y + 25, { align: 'center' });
        x += 38;
      });
      y += 36;
    }
  });
  pied(doc);
}

export function exporterOutilPdf(outil: OutilFiche): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  switch (outil.slug) {
    case 'oui-non': pdfOuiNon(doc); break;
    case 'echelle': pdfEchelle(doc); break;
    case 'schema-corps': pdfCorps(doc); break;
    case 'tla': pdfTla(doc); break;
    case 'carte': {
      const infos = { nom: '', prenom: '', confiance: '', tel: '', ...lireStockage<Record<string, string>>('carte', {}) };
      pdfCarte(doc, infos);
      break;
    }
    case 'arbre': {
      const arbre = lireStockage<{ prenom: string; lien: string; niveau: number }[]>('arbre', [{ prenom: 'Moi', lien: '', niveau: 1 }]);
      pdfArbre(doc, arbre);
      break;
    }
    case 'phrases': {
      const phrases = lireStockage<{ texte: string }[]>('phrases', []);
      entete(doc, 'Mes phrases', 'Pointez la phrase que vous voulez dire.');
      let y = 52;
      phrases.forEach((p) => {
        if (y > 265) return;
        doc.setDrawColor('#DCEEF4');
        doc.setLineWidth(1);
        doc.roundedRect(14, y, 182, 22, 5, 5, 'D');
        doc.setTextColor(BLEU9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(p.texte, 24, y + 14);
        y += 28;
      });
      pied(doc);
      break;
    }
    default: {
      entete(doc, outil.titre, outil.sous);
      doc.setTextColor(TEXTE);
      doc.setFontSize(12);
      doc.text(doc.splitTextToSize(outil.desc, 180), 14, 50);
      pied(doc);
    }
  }

  doc.save(`aphasaide-${outil.slug}.pdf`);
}
