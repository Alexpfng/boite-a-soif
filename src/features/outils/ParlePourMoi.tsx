import { useState } from 'react';
import { OutilCadre, vibrer } from './OutilCadre';
import { prononcer } from '../tts/useSpeech';
import { lireStockage, ecrireStockage } from '../../lib/storage';
import { IconeHautParleur } from '../../ui/icons';
import { COL, FRAUNCES, CARD_SHADOW_SM } from '../../ui/theme';

// « Parle pour moi » : on tape une phrase libre, le téléphone la prononce.
// Les dernières phrases dites sont gardées pour être rejouées en un geste.

const CLE = 'parle-recentes';
const MAX_RECENTES = 8;

export default function ParlePourMoi() {
  const [texte, setTexte] = useState('');
  const [recentes, setRecentes] = useState<string[]>(() => lireStockage<string[]>(CLE, []));

  function parler(phrase: string) {
    const t = phrase.trim();
    if (!t) return;
    vibrer();
    prononcer(t, 0.95);
    // Mémorise en tête de liste, sans doublon
    const suivantes = [t, ...recentes.filter((r) => r !== t)].slice(0, MAX_RECENTES);
    setRecentes(suivantes);
    ecrireStockage(CLE, suivantes);
  }

  return (
    <OutilCadre label="Parle pour moi">
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 24px 16px' }}>
        <h1 style={{ margin: '0 0 4px 4px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.33rem', color: COL.bleu9 }}>
          Parle pour moi
        </h1>
        <p style={{ margin: '0 0 14px 4px', fontSize: '0.84rem', color: COL.texte2 }}>
          Écrivez une phrase, le téléphone la prononce à voix haute.
        </p>

        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Ex. Je voudrais un verre d'eau, s'il vous plaît."
          aria-label="Phrase à prononcer"
          rows={3}
          style={{
            width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 16,
            padding: '14px 16px', fontSize: '1.22rem', lineHeight: 1.4,
            background: '#fff', color: COL.texte, resize: 'none',
          }}
        />

        <button
          onClick={() => parler(texte)}
          disabled={!texte.trim()}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 12,
            margin: '12px 0 0 0', border: 'none', borderRadius: 20,
            background: texte.trim() ? COL.orange : COL.gris, color: '#fff',
            padding: 18, fontSize: '1.22rem', fontWeight: 700, minHeight: 72,
          }}
        >
          <IconeHautParleur size={28} />
          Prononcer
        </button>

        {texte.trim() && (
          <button
            onClick={() => setTexte('')}
            style={{
              margin: '10px 0 0 0', border: 'none', background: 'transparent',
              color: COL.texte2, fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', padding: '6px 4px',
            }}
          >
            Effacer le texte
          </button>
        )}

        {recentes.length > 0 && (
          <section aria-label="Phrases récentes" style={{ margin: '24px 0 0 0' }}>
            <h2 style={{ margin: '0 0 8px 4px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: COL.texte2 }}>
              Phrases récentes — touchez pour redire
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentes.map((r) => (
                <button
                  key={r}
                  onClick={() => parler(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    border: 'none', borderRadius: 16, background: '#fff', boxShadow: CARD_SHADOW_SM,
                    padding: '14px 16px', fontSize: '1.05rem', fontWeight: 600, color: COL.texte, minHeight: 56,
                  }}
                >
                  <span style={{ color: COL.bleu5, flexShrink: 0, display: 'flex' }}><IconeHautParleur /></span>
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setRecentes([]); ecrireStockage(CLE, []); }}
              style={{
                margin: '10px 0 0 0', border: 'none', background: 'transparent',
                color: COL.texte2, fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', padding: '6px 4px',
              }}
            >
              Effacer les phrases récentes
            </button>
          </section>
        )}
      </div>
    </OutilCadre>
  );
}
