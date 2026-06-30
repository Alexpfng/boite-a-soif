import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prononcer } from '../tts/useSpeech';
import { vibrer } from './OutilCadre';
import { IconePouce } from '../../ui/icons';
import { COL, FRAUNCES } from '../../ui/theme';

export default function PlancheOuiNon() {
  const navigate = useNavigate();
  const [sel, setSel] = useState<'oui' | 'non' | null>(null);
  const timerRef = useRef<number>();

  function pick(val: 'oui' | 'non') {
    setSel(val);
    vibrer();
    prononcer(val === 'oui' ? 'Oui' : 'Non', 0.95);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSel(null), 1000);
  }

  const scale = (v: 'oui' | 'non') => (sel === v ? '1.06' : sel ? '0.96' : '1');

  return (
    <div
      role="region"
      aria-label="Planche OUI NON"
      style={{
        position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, zIndex: 50,
        display: 'flex', flexDirection: 'column', background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <button
          onClick={() => { window.speechSynthesis?.cancel(); navigate(-1); }}
          style={{
            border: 'none', borderRadius: 999, background: 'rgba(28,43,51,0.55)',
            color: '#fff', padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          ‹ Quitter
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <button
          onClick={() => pick('oui')}
          aria-label="Répondre OUI"
          style={{
            flex: 1, border: 'none', background: COL.vert, color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            transition: 'transform 180ms ease', transform: `scale(${scale('oui')})`, transformOrigin: 'center',
          }}
        >
          <IconePouce />
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.6rem', letterSpacing: '0.04em' }}>OUI</span>
        </button>
        <button
          onClick={() => pick('non')}
          aria-label="Répondre NON"
          style={{
            flex: 1, border: 'none', background: COL.rouge, color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            transition: 'transform 180ms ease', transform: `scale(${scale('non')})`, transformOrigin: 'center',
          }}
        >
          <IconePouce rotate />
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.6rem', letterSpacing: '0.04em' }}>NON</span>
        </button>
      </div>
    </div>
  );
}
