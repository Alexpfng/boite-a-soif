import { useState } from 'react';
import QRCode from 'qrcode';
import { OutilCadre } from './OutilCadre';
import { lireStockage, ecrireStockage } from '../../lib/storage';
import { encoderCarte } from '../../lib/carteLien';
import { useToast } from '../../components/ui/Toast';
import { exporterOutilPdf } from '../../lib/pdf';
import { COL, FRAUNCES, CARD_SHADOW } from '../../ui/theme';
import CONTENT from '../../content';

interface CarteInfos {
  nom: string;
  prenom: string;
  confiance: string;
  tel: string;
}

const DEFAUT: CarteInfos = { nom: '', prenom: '', confiance: '', tel: '' };

const inputStyle: React.CSSProperties = {
  width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
  padding: '11px 14px', fontSize: '1rem', margin: '0 0 10px 0',
  minHeight: 52, background: '#fff', color: COL.texte,
};

export default function CarteAphasique() {
  const [carte, setCarte] = useState<CarteInfos>(() => ({ ...DEFAUT, ...lireStockage<Partial<CarteInfos>>('carte', {}) }));
  const [qr, setQr] = useState<string | null>(null);
  const { annoncer } = useToast();

  async function montrerQr() {
    try {
      const url = `${window.location.origin}/c#${encoderCarte(carte)}`;
      setQr(await QRCode.toDataURL(url, { width: 480, margin: 2, color: { dark: '#0E3A4D', light: '#FFFFFF' } }));
    } catch {
      annoncer('Impossible de générer le QR code');
    }
  }

  function set(k: keyof CarteInfos) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const suivant = { ...carte, [k]: e.target.value };
      setCarte(suivant);
      ecrireStockage('carte', suivant);
    };
  }

  const aff = (v: string) => v || '________';
  const outil = CONTENT.outils.find((o) => o.slug === 'carte')!;

  return (
    <OutilCadre
      label="Carte aphasique"
      action={
        <button
          onClick={() => { exporterOutilPdf(outil); annoncer('PDF téléchargé'); }}
          style={{
            border: `2px solid ${COL.bleu7}`, borderRadius: 999, background: '#fff',
            color: COL.bleu7, padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          Imprimer / PDF
        </button>
      }
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px 16px' }}>
        {/* La carte */}
        <div data-card="true" style={{ background: '#fff', border: `3px solid ${COL.bleu7}`, borderRadius: 20, padding: '24px 22px' }}>
          <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.67rem', color: COL.bleu9, textAlign: 'center', letterSpacing: '0.02em' }}>
            JE SUIS APHASIQUE
          </h1>
          <div style={{ width: 64, height: 4, background: COL.orange, borderRadius: 2, margin: '10px auto 0 auto' }} />
          <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontWeight: 600 }}>J&apos;ai des difficultés de langage.</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.95rem' }}>
            L&apos;aphasie peut affecter ma capacité à : <strong>parler, comprendre, lire, écrire</strong>.
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
            Cela n&apos;affecte <strong>ni mon intelligence, ni mon audition</strong>.
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>Parlez lentement et utilisez des phrases courtes.</p>
          <p style={{ margin: '14px 0 0 0', textAlign: 'center', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu7 }}>
            Merci de votre patience.
          </p>
          <div style={{ margin: '18px 0 0 0', borderTop: `2px dashed ${COL.bleu1}`, padding: '14px 0 0 0', fontSize: '0.84rem', color: COL.texte2, lineHeight: 1.9 }}>
            Nom : <strong style={{ color: COL.texte }}>{aff(carte.nom)}</strong>
            <br />
            Prénom : <strong style={{ color: COL.texte }}>{aff(carte.prenom)}</strong>
            <br />
            Personne de confiance : <strong style={{ color: COL.texte }}>{aff(carte.confiance)}</strong>
            <br />
            Téléphone : <strong style={{ color: COL.texte }}>{aff(carte.tel)}</strong>
          </div>
        </div>

        {/* Personnalisation */}
        <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 20, margin: '16px 0 0 0' }}>
          <h2 style={{ margin: '0 0 12px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
            Personnaliser la carte
          </h2>
          <input value={carte.nom} onChange={set('nom')} placeholder="Nom" aria-label="Nom" style={inputStyle} />
          <input value={carte.prenom} onChange={set('prenom')} placeholder="Prénom" aria-label="Prénom" style={inputStyle} />
          <input value={carte.confiance} onChange={set('confiance')} placeholder="Personne de confiance" aria-label="Personne de confiance" style={inputStyle} />
          <input value={carte.tel} onChange={set('tel')} placeholder="Téléphone de la personne de confiance" aria-label="Téléphone" style={{ ...inputStyle, margin: 0 }} />
        </div>

        {/* Partage par QR code */}
        <button
          onClick={montrerQr}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '16px 0 0 0', border: `2px solid ${COL.bleu7}`, borderRadius: 20,
            background: '#fff', color: COL.bleu7, padding: 15,
            fontSize: '0.95rem', fontWeight: 600, minHeight: 56,
          }}
        >
          Partager par QR code
        </button>
        <p style={{ margin: '8px 4px 0 4px', fontSize: '0.78rem', color: COL.texte2 }}>
          Votre interlocuteur scanne le QR code avec son téléphone et lit la carte directement, sans rien installer.
        </p>
      </div>

      {/* Plein écran QR */}
      {qr && (
        <div
          role="dialog"
          aria-label="QR code de la carte"
          onClick={() => setQr(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(14,58,77,0.92)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24,
          }}
        >
          <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.11rem', textAlign: 'center' }}>
            Faites scanner ce code
          </p>
          <img src={qr} alt="QR code vers la carte « Je suis aphasique »" style={{ width: 'min(78vw, 360px)', borderRadius: 18, background: '#fff' }} />
          <button
            onClick={() => setQr(null)}
            style={{
              border: '2px solid rgba(255,255,255,0.7)', borderRadius: 16, background: 'transparent',
              color: '#fff', padding: '12px 28px', fontSize: '1rem', fontWeight: 700, minHeight: 52,
            }}
          >
            Fermer
          </button>
        </div>
      )}
    </OutilCadre>
  );
}
