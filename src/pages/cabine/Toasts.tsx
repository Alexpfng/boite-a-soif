import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// La grande réserve de portés de santé du comptoir.
const TOASTS: string[] = [
  'À ceux qu’on aime, à ceux qui nous aiment, et que les autres aillent au diable !',
  'Tchin ! Et que ça brille !',
  'À la nôtre, à la vôtre, et surtout à la prochaine !',
  'Lève ton verre, baisse ton froc… non, lève juste ton verre.',
  'À nos amis présents, à nos amis absents, et tant pis pour les radins !',
  'Santé, prospérité, et un foie en acier trempé !',
  'À la tienne, Étienne ! À la tienne, mon vieux !',
  'Buvons un coup, buvons-en deux, à la santé des amoureux !',
  'À l’amitié, à la soif, et à celui qui régale la prochaine tournée !',
  'Cul sec ou demi-tour, le verre n’attend pas, mes amours !',
  'À la santé du patron, et qu’il en oublie l’addition !',
  'Trinquons haut, trinquons fort, et que le tonneau ne meure jamais !',
  'À nos vieux jours, qu’ils soient nombreux et bien arrosés !',
  'Que nos verres soient pleins, nos cœurs aussi, et nos soucis tout petits !',
  'À la pluie, au beau temps, mais surtout à l’apéro maintenant !',
  'Levons nos verres au comptoir, ce phare dans la nuit des soiffards !',
  'À la première, à la dernière, et à toutes celles qu’on confond entre les deux !',
  'Santé, bonheur, et un zinc toujours ouvert !',
  'À la joie, à la fête, et au lendemain qui n’a qu’à bien se tenir !',
  'Trinquons, mes braves, car demain on remet ça !',
];

const tirerToast = () => TOASTS[Math.floor(Math.random() * TOASTS.length)];

export function Toasts({ onRetour }: { onRetour: () => void }) {
  const [toast, setToast] = useState<string>(() => tirerToast());

  function nouveau() {
    const t = tirerToast();
    setToast(t);
    parlerTavernier(t);
  }

  return (
    <>
      <Entete titre="La Machine à Toasts" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          Un porté de santé prêt à déclamer, le verre bien haut. Le tavernier te le souffle à l’oreille.
        </p>

        <div className="pmu-ardoise" style={{ textAlign: 'center' }}>
          <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Le toast du moment
          </div>
          <p className="craie" style={{ margin: '14px 0 4px', fontFamily: FRAUNCES, fontSize: '1.5rem', lineHeight: 1.35 }}>
            « {toast} »
          </p>
        </div>

        <button onClick={nouveau} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 70, fontSize: '1.05rem' }}>
          🥂 Nouveau toast
        </button>

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          À déclamer fort, le verre levé. Avec modération, ça va de soi.
        </p>
      </section>
    </>
  );
}
