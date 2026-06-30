import { useState } from 'react';
import { prononcer } from '../tts/useSpeech';
import { OutilCadre, vibrer } from './OutilCadre';
import { COL, FRAUNCES } from '../../ui/theme';
import CONTENT from '../../content';

export default function TableauLangageAssiste() {
  const [sel, setSel] = useState<number | null>(null);

  function pick(i: number, dire: string) {
    setSel(i);
    vibrer();
    prononcer(dire, 0.95);
  }

  return (
    <OutilCadre
      label="Tableau de Langage Assisté"
      action={
        <span style={{ fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1rem', color: COL.bleu9 }}>Le repas</span>
      }
    >
      <div
        style={{
          flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr',
          gap: 12, padding: '8px 16px 12px 16px', minHeight: 0,
        }}
      >
        {CONTENT.tla.map((c, i) => {
          const actif = sel === i;
          return (
            <button
              key={i}
              onClick={() => pick(i, c.dire)}
              aria-label={c.dire}
              aria-pressed={actif}
              style={{
                border: actif ? `3px solid ${COL.orange}` : `3px solid ${COL.bleu1}`,
                borderRadius: 22,
                background: actif ? COL.orangeClair : '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: 10,
                transition: 'transform 160ms ease',
                transform: actif ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '3rem', lineHeight: 1 }} aria-hidden="true">{c.emoji}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: COL.texte, textAlign: 'center', lineHeight: 1.3 }}>
                {c.mot}
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ margin: '0 22px 16px 22px', textAlign: 'center', fontSize: '0.84rem', color: COL.texte2 }}>
        Un exemple pour le repas, adaptable à d&apos;autres situations du quotidien.
      </p>
    </OutilCadre>
  );
}
