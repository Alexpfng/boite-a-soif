import { useEffect, useState } from 'react';
import { decoderCarte, type CartePartagee } from '../lib/carteLien';
import { Symbole, Wordmark } from '../ui/icons';
import { COL, FRAUNCES } from '../ui/theme';
import CONTENT from '../content';

// Page PUBLIQUE (sans connexion) affichée quand on scanne le QR code de la
// carte « Je suis aphasique ». Les données sont dans le fragment de l'URL.

export default function CartePublique() {
  const [carte, setCarte] = useState<CartePartagee | null>(null);

  useEffect(() => {
    setCarte(decoderCarte(window.location.hash.slice(1)));
  }, []);

  const aff = (v: string) => v.trim() || '—';

  return (
    <main style={{ minHeight: '100vh', background: COL.sable, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 18 }}>
          <Symbole size={28} color={COL.bleu9} />
          <Wordmark taille="topbar" color={COL.bleu9} />
        </div>

        <div data-card="true" style={{ background: '#fff', border: `3px solid ${COL.bleu7}`, borderRadius: 20, padding: '24px 22px' }}>
          <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.67rem', color: COL.bleu9, textAlign: 'center', letterSpacing: '0.02em' }}>
            JE SUIS APHASIQUE
          </h1>
          <div style={{ width: 64, height: 4, background: COL.orange, borderRadius: 2, margin: '10px auto 0 auto' }} />
          <ul style={{ margin: '16px 0 0 0', padding: '0 0 0 18px', fontSize: '0.98rem', lineHeight: 1.55, color: COL.texte }}>
            {CONTENT.carteTexte.lignes.map((l) => <li key={l} style={{ margin: '6px 0' }}>{l}</li>)}
          </ul>

          {carte ? (
            <div style={{ margin: '18px 0 0 0', background: COL.bleu1, borderRadius: 14, padding: '14px 16px', fontSize: '0.95rem', color: COL.texte }}>
              <p style={{ margin: 0 }}><strong>Nom :</strong> {aff(`${carte.prenom} ${carte.nom}`)}</p>
              <p style={{ margin: '6px 0 0 0' }}><strong>Personne de confiance :</strong> {aff(carte.confiance)}</p>
              <p style={{ margin: '6px 0 0 0' }}>
                <strong>Téléphone :</strong>{' '}
                {carte.tel.trim() ? <a href={`tel:${carte.tel.replace(/\s/g, '')}`} style={{ color: COL.bleu7, fontWeight: 700 }}>{carte.tel}</a> : '—'}
              </p>
            </div>
          ) : (
            <p style={{ margin: '18px 0 0 0', fontSize: '0.9rem', color: COL.texte2, textAlign: 'center' }}>
              Carte non renseignée ou lien incomplet.
            </p>
          )}
        </div>

        <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: '0.84rem', color: COL.texte2 }}>
          Merci de votre patience et de votre bienveillance.
        </p>
      </div>
    </main>
  );
}
