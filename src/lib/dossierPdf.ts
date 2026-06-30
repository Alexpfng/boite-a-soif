// Export PDF du « dossier » à apporter en consultation : rendez-vous à venir,
// notes du carnet de liaison et historique de bien-être. Génération locale.

import { jsPDF } from 'jspdf';
import { lireStockage } from './storage';
import CONTENT from '../content';

const BLEU9 = '#0E3A4D';
const BLEU7 = '#15576F';
const TEXTE = '#1C2B33';
const GRIS = '#4A5A63';

interface Rdv { type: string; date: string; heure: string; notes?: string }
interface Note { texte: string; date: string }
interface Ressenti { date: string; heure: string; id: number }

function fmtDate(iso: string): string {
  try {
    return new Date(iso + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function exporterDossierPdf(): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 0;

  const nouvellePageSiBesoin = (hauteur: number) => {
    if (y + hauteur > 282) {
      doc.addPage();
      y = 20;
    }
  };

  const titreSection = (txt: string) => {
    nouvellePageSiBesoin(18);
    doc.setTextColor(BLEU7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(txt, 14, y);
    doc.setDrawColor('#E0662A');
    doc.setLineWidth(0.8);
    doc.line(14, y + 2, 60, y + 2);
    y += 10;
  };

  const ligne = (txt: string, retrait = 14, gras = false) => {
    const lignes = doc.splitTextToSize(txt, 182 - (retrait - 14));
    nouvellePageSiBesoin(lignes.length * 5.4 + 2);
    doc.setTextColor(TEXTE);
    doc.setFont('helvetica', gras ? 'bold' : 'normal');
    doc.setFontSize(11);
    doc.text(lignes, retrait, y);
    y += lignes.length * 5.4 + 2;
  };

  // En-tête
  doc.setFillColor(BLEU9);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('A’PHAS’AIDE — Dossier de suivi', 14, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 18);
  y = 34;

  // 1. Rendez-vous à venir
  const aujourd = new Date().toISOString().slice(0, 10);
  const rdvs = lireStockage<Rdv[]>('rendezvous', []).filter((r) => r.date >= aujourd);
  titreSection('Prochains rendez-vous');
  if (rdvs.length === 0) ligne('Aucun rendez-vous à venir.');
  rdvs.forEach((r) => {
    ligne(`• ${r.type} — ${fmtDate(r.date)}${r.heure ? ', ' + r.heure.replace(':', ' h ') : ''}`, 14, true);
    if (r.notes) ligne(r.notes, 20);
  });
  y += 4;

  // 2. Carnet de liaison
  const notes = lireStockage<Note[]>('carnet', []);
  titreSection('Carnet de liaison (à transmettre)');
  if (notes.length === 0) ligne('Aucune note.');
  [...notes].reverse().forEach((n) => {
    ligne(`• ${n.texte}`, 14);
    ligne(fmtDate(n.date), 20);
  });
  y += 4;

  // 3. Historique de bien-être
  const journal = lireStockage<Ressenti[]>('bienetre', []);
  titreSection('Historique de bien-être');
  if (journal.length === 0) {
    ligne('Aucun ressenti enregistré.');
  } else {
    [...journal].reverse().slice(0, 30).forEach((e) => {
      const cran = CONTENT.echelle.find((c) => c.id === e.id);
      ligne(`• ${fmtDate(e.date)}, ${e.heure.replace(':', ' h ')} — ${cran?.label ?? ''}`, 14);
    });
  }

  // Pied
  doc.setTextColor(GRIS);
  doc.setFontSize(9);
  doc.text('Document généré par A’PHAS’AIDE pour faciliter le suivi. Ne remplace pas un avis médical.', 14, 290);

  doc.save('aphasaide-dossier.pdf');
}
