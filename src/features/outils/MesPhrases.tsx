import { useState } from 'react';
import { prononcer } from '../tts/useSpeech';
import { OutilCadre, vibrer } from './OutilCadre';
import { lireStockage, ecrireStockage } from '../../lib/storage';
import { useToast } from '../../components/ui/Toast';
import { COL } from '../../ui/theme';

// Planche de phrases personnalisées : l'aidant compose la liste,
// la personne aphasique touche une phrase et le téléphone la prononce.

interface Phrase {
  id: number;
  texte: string;
}

const DEFAUTS: Phrase[] = [
  { id: 1, texte: "J'ai soif" },
  { id: 2, texte: "J'ai faim" },
  { id: 3, texte: 'Je suis fatigué(e)' },
  { id: 4, texte: "J'ai besoin d'aide" },
  { id: 5, texte: 'Je veux me reposer' },
  { id: 6, texte: 'Appelle quelqu’un, s’il te plaît' },
];

export default function MesPhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>(() => lireStockage<Phrase[]>('phrases', DEFAUTS));
  const [sel, setSel] = useState<number | null>(null);
  const [edition, setEdition] = useState(false);
  const [nouvelle, setNouvelle] = useState('');
  const { annoncer } = useToast();

  function sauver(suivant: Phrase[]) {
    setPhrases(suivant);
    ecrireStockage('phrases', suivant);
  }

  function dire(p: Phrase) {
    if (edition) return;
    setSel(p.id);
    vibrer();
    prononcer(p.texte, 0.95);
  }

  function ajouter() {
    const texte = nouvelle.trim();
    if (!texte) {
      annoncer('Écrivez une phrase');
      return;
    }
    sauver([...phrases, { id: Date.now(), texte }]);
    setNouvelle('');
    annoncer('Phrase ajoutée');
  }

  function retirer(id: number) {
    sauver(phrases.filter((p) => p.id !== id));
    annoncer('Phrase retirée');
  }

  return (
    <OutilCadre
      label="Mes phrases"
      action={
        <button
          onClick={() => setEdition(!edition)}
          aria-pressed={edition}
          style={{
            border: `2px solid ${COL.bleu7}`, borderRadius: 999,
            background: edition ? COL.bleu7 : '#fff',
            color: edition ? '#fff' : COL.bleu7,
            padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          {edition ? 'Terminé' : 'Modifier'}
        </button>
      }
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 12px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phrases.length === 0 && (
            <p style={{ margin: '24px 8px', textAlign: 'center', fontSize: '0.95rem', color: COL.texte2 }}>
              Aucune phrase. Appuyez sur « Modifier » pour en ajouter.
            </p>
          )}
          {phrases.map((p) => {
            const actif = sel === p.id;
            return (
              <div key={p.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => dire(p)}
                  aria-label={edition ? p.texte : `Prononcer : ${p.texte}`}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: 14,
                    border: actif ? `3px solid ${COL.orange}` : `3px solid ${COL.bleu1}`,
                    borderRadius: 22,
                    background: actif ? COL.orangeClair : '#fff',
                    padding: '18px 20px', textAlign: 'left', minHeight: 76,
                    transition: 'transform 160ms ease',
                    transform: actif ? 'scale(1.02)' : 'scale(1)',
                    opacity: edition ? 0.75 : 1,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={COL.bleu5} strokeWidth="2" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M4 10 H8 L13 5 V19 L8 14 H4 Z" />
                    <path d="M16.5 9 C18.5 10.5 18.5 13.5 16.5 15" />
                  </svg>
                  <span style={{ flex: 1, fontSize: '1.22rem', fontWeight: 600, color: COL.texte, lineHeight: 1.35 }}>
                    {p.texte}
                  </span>
                </button>
                {edition && (
                  <button
                    onClick={() => retirer(p.id)}
                    aria-label={`Retirer la phrase : ${p.texte}`}
                    style={{
                      position: 'absolute', top: -8, right: -2, width: 30, height: 30,
                      borderRadius: '50%', border: 'none', background: COL.rouge, color: '#fff',
                      fontSize: 14, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(14,58,77,0.25)',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {edition && (
          <div style={{ display: 'flex', gap: 10, margin: '16px 0 4px 0' }}>
            <input
              value={nouvelle}
              onChange={(e) => setNouvelle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ajouter()}
              placeholder="Nouvelle phrase…"
              aria-label="Nouvelle phrase"
              style={{
                flex: 1, border: `2px solid ${COL.bleu1}`, borderRadius: 14,
                padding: '11px 14px', fontSize: '1rem', minHeight: 52,
                background: '#fff', color: COL.texte,
              }}
            />
            <button
              onClick={ajouter}
              style={{
                border: 'none', borderRadius: 14, background: COL.bleu7, color: '#fff',
                padding: '0 22px', fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
              }}
            >
              Ajouter
            </button>
          </div>
        )}
      </div>

      <p style={{ margin: '0 22px 16px 22px', textAlign: 'center', fontSize: '0.84rem', color: COL.texte2 }}>
        {edition
          ? 'Ajoutez les phrases que votre proche utilise le plus souvent.'
          : 'Touchez une phrase : elle est prononcée à voix haute.'}
      </p>
    </OutilCadre>
  );
}
