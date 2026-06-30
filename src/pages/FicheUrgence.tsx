import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useToast } from '../components/ui/Toast';
import { lireStockage, ecrireStockage } from '../lib/storage';
import { jsPDF } from 'jspdf';
import { COL, FRAUNCES, CARD_SHADOW } from '../ui/theme';

// Fiche médicale d'urgence : les informations essentielles à montrer aux
// secours, à un médecin ou à un passant. Affichage plein écran très lisible
// + export PDF format poche.

interface FicheMedicale {
  prenom: string;
  nom: string;
  naissance: string;     // texte libre (ex. 12/03/1952)
  contact1: string;      // « Marie (fille) — 06 12 34 56 78 »
  contact2: string;
  medecin: string;       // « Dr Dupont — 04 73 00 00 00 »
  medicaments: string;
  allergies: string;
  notes: string;
}

const DEFAUT: FicheMedicale = {
  prenom: '', nom: '', naissance: '', contact1: '', contact2: '',
  medecin: '', medicaments: '', allergies: '', notes: '',
};

const CHAMPS: { cle: keyof FicheMedicale; label: string; placeholder: string; long?: boolean }[] = [
  { cle: 'prenom', label: 'Prénom', placeholder: 'Prénom de la personne aphasique' },
  { cle: 'nom', label: 'Nom', placeholder: 'Nom de famille' },
  { cle: 'naissance', label: 'Date de naissance', placeholder: 'Ex. 12/03/1952' },
  { cle: 'contact1', label: 'Contact d’urgence n°1', placeholder: 'Ex. Marie (fille) — 06 12 34 56 78' },
  { cle: 'contact2', label: 'Contact d’urgence n°2', placeholder: 'Ex. Paul (fils) — 06 98 76 54 32' },
  { cle: 'medecin', label: 'Médecin traitant', placeholder: 'Ex. Dr Dupont — 04 73 00 00 00' },
  { cle: 'medicaments', label: 'Médicaments en cours', placeholder: 'Ex. anticoagulant (Eliquis), antihypertenseur…', long: true },
  { cle: 'allergies', label: 'Allergies connues', placeholder: 'Ex. pénicilline. Laissez vide si aucune.', long: true },
  { cle: 'notes', label: 'Autres informations importantes', placeholder: 'Ex. porteur d’un pacemaker, diabétique…', long: true },
];

function exporterFichePdf(f: FicheMedicale) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFillColor('#C0392B');
  doc.rect(0, 0, 210, 26, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('FICHE MÉDICALE D’URGENCE — PERSONNE APHASIQUE', 105, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('L’aphasie affecte le langage, pas l’intelligence ni l’audition.', 105, 20, { align: 'center' });

  let y = 40;
  const ligne = (label: string, valeur: string) => {
    if (!valeur.trim()) return;
    doc.setTextColor('#15576F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(label.toUpperCase(), 14, y);
    doc.setTextColor('#1C2B33');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    const lignes = doc.splitTextToSize(valeur, 180);
    doc.text(lignes, 14, y + 6);
    y += 10 + lignes.length * 6;
  };

  ligne('Nom', `${f.prenom} ${f.nom}`.trim());
  ligne('Date de naissance', f.naissance);
  ligne('Contact d’urgence n°1', f.contact1);
  ligne('Contact d’urgence n°2', f.contact2);
  ligne('Médecin traitant', f.medecin);
  ligne('Médicaments en cours', f.medicaments);
  ligne('Allergies', f.allergies);
  ligne('Autres informations', f.notes);

  doc.setTextColor('#4A5A63');
  doc.setFontSize(9);
  doc.text('Générée par A’PHAS’AIDE — à plier et garder dans le portefeuille.', 14, 285);
  doc.save('aphasaide-fiche-urgence.pdf');
}

// ── Mode « à montrer » plein écran ──────────────────────────────────────────
function ModeMontrer({ fiche, onFermer }: { fiche: FicheMedicale; onFermer: () => void }) {
  const bloc = (label: string, valeur: string, accent?: boolean) =>
    valeur.trim() ? (
      <div style={{ background: accent ? '#FBEAE7' : '#fff', borderRadius: 14, padding: '12px 16px' }}>
        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent ? COL.rouge : COL.bleu7 }}>{label}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '1.11rem', fontWeight: 600, color: COL.texte, lineHeight: 1.35 }}>{valeur}</p>
      </div>
    ) : null;

  return (
    <div
      role="dialog"
      aria-label="Fiche médicale d'urgence"
      style={{
        position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, zIndex: 60, background: COL.rouge,
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ padding: '18px 18px 12px 18px', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.67rem' }}>JE SUIS APHASIQUE</h1>
        <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', opacity: 0.95 }}>
          J’ai des difficultés pour parler. Mon intelligence et mon audition vont bien.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bloc('Je m’appelle', `${fiche.prenom} ${fiche.nom}`.trim())}
        {bloc('Date de naissance', fiche.naissance)}
        {bloc('Appeler en priorité', fiche.contact1, true)}
        {bloc('Autre contact', fiche.contact2, true)}
        {bloc('Médecin traitant', fiche.medecin)}
        {bloc('Médicaments en cours', fiche.medicaments)}
        {bloc('Allergies', fiche.allergies, true)}
        {bloc('À savoir', fiche.notes)}
        <div style={{ display: 'flex', gap: 8, margin: '4px 0 0 0' }}>
          <a href="tel:15" style={{ flex: 1, textAlign: 'center', background: '#fff', color: COL.rouge, borderRadius: 14, padding: '14px 8px', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem' }}>
            ☎ 15 — SAMU
          </a>
          <a href="tel:114" style={{ flex: 1, textAlign: 'center', background: '#fff', color: COL.rouge, borderRadius: 14, padding: '14px 8px', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem' }}>
            ✉ 114 — par SMS
          </a>
        </div>
      </div>
      <div style={{ padding: '0 14px 18px 14px' }}>
        <button
          onClick={onFermer}
          style={{
            width: '100%', border: '2px solid rgba(255,255,255,0.7)', borderRadius: 16,
            background: 'transparent', color: '#fff', padding: 14, fontSize: '1rem', fontWeight: 700, minHeight: 56,
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

export default function FicheUrgence() {
  const [fiche, setFiche] = useState<FicheMedicale>(() => ({ ...DEFAUT, ...lireStockage<Partial<FicheMedicale>>('fiche-medicale', {}) }));
  const [montrer, setMontrer] = useState(false);
  const { annoncer } = useToast();

  const renseignee = Object.values(fiche).some((v) => v.trim() !== '');

  function set(cle: keyof FicheMedicale) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const suivant = { ...fiche, [cle]: e.target.value };
      setFiche(suivant);
      ecrireStockage('fiche-medicale', suivant);
    };
  }

  const champStyle: React.CSSProperties = {
    width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
    padding: '11px 14px', fontSize: '1rem', background: '#fff', color: COL.texte, minHeight: 52,
  };

  return (
    <AppShell>
      {montrer && <ModeMontrer fiche={fiche} onFermer={() => setMontrer(false)} />}
      <Hero color={COL.rouge}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          En cas d&apos;urgence
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.25 }}>
          Fiche médicale d&apos;urgence
        </h1>
      </Hero>

      <div style={{ padding: '6px 22px 0 22px', maxWidth: '70ch' }}>
        <p style={{ margin: '18px 0 0 0' }}>
          Renseignez une fois les informations essentielles. En situation d&apos;urgence, montrez la fiche
          en plein écran aux secours, à un médecin ou à un passant.
        </p>

        <button
          onClick={() => (renseignee ? setMontrer(true) : annoncer('Remplissez d’abord la fiche ci-dessous'))}
          data-tone="orange"
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '20px 0 0 0', border: 'none', borderRadius: 20,
            background: COL.rouge, color: '#fff', padding: 18,
            fontSize: '1.11rem', fontWeight: 700, minHeight: 68,
          }}
        >
          Montrer la fiche en plein écran
        </button>
        <button
          onClick={() => { exporterFichePdf(fiche); annoncer('PDF téléchargé'); }}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '12px 0 0 0', border: `2px solid ${COL.bleu7}`, borderRadius: 20,
            background: '#fff', color: COL.bleu7, padding: 15,
            fontSize: '0.95rem', fontWeight: 600, minHeight: 56,
          }}
        >
          Télécharger en PDF (à garder sur soi)
        </button>

        <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 20, margin: '24px 0 0 0' }}>
          <h2 style={{ margin: '0 0 14px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
            Les informations de la fiche
          </h2>
          {CHAMPS.map(({ cle, label, placeholder, long }) => (
            <div key={cle} style={{ margin: '0 0 14px 0' }}>
              <label htmlFor={`fm-${cle}`} style={{ display: 'block', margin: '0 0 5px 2px', fontWeight: 600, fontSize: '0.89rem', color: COL.bleu9 }}>
                {label}
              </label>
              {long ? (
                <textarea id={`fm-${cle}`} value={fiche[cle]} onChange={set(cle)} placeholder={placeholder} rows={2}
                  style={{ ...champStyle, resize: 'none', lineHeight: 1.4 }} />
              ) : (
                <input id={`fm-${cle}`} value={fiche[cle]} onChange={set(cle)} placeholder={placeholder} style={champStyle} />
              )}
            </div>
          ))}
          <p style={{ margin: 0, fontSize: '0.8rem', color: COL.texte2 }}>
            Enregistrement automatique. Ces informations restent dans votre espace personnel.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
