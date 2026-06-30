import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// Le lexique du comptoir : argot de bar, expliqué façon dictionnaire de zinc.
const MOTS: { mot: string; def: string }[] = [
  { mot: 'Se piquer le nez', def: 'Boire plus que de raison. Très répandu sur le zinc.' },
  { mot: 'Avoir un coup dans l’aile', def: 'Être éméché, voler en crabe vers la sortie.' },
  { mot: 'La tournée du patron', def: 'Verre offert par la maison. Espèce rare, presque mythologique.' },
  { mot: 'Lever le coude', def: 'Boire avec application et régularité.' },
  { mot: 'Avoir la gueule de bois', def: 'Le lendemain qui cogne. Réveil de marbre, tête de plomb.' },
  { mot: 'Prendre une caisse', def: 'Boire jusqu’à la cargaison complète. Le déchargement est rude.' },
  { mot: 'Le petit blanc', def: 'Le verre du matin qui prétend ouvrir l’appétit. Il ferme surtout la nuit.' },
  { mot: 'Picoler', def: 'Boire de l’alcool, sans chichi et de bon cœur.' },
  { mot: 'Être rond comme une queue de pelle', def: 'Complètement ivre. La pelle, elle, tient mieux debout.' },
  { mot: 'Le coup de l’étrier', def: 'Le dernier verre avant de partir. Souvent suivi d’un deuxième dernier.' },
  { mot: 'Avoir une mine d’enterrement', def: 'La tête du lendemain de fête. On compatit, mollement.' },
  { mot: 'Siroter', def: 'Boire lentement, par petites gorgées. La grande classe du comptoir.' },
  { mot: 'Le rade', def: 'Le bistrot du coin, le repaire, la deuxième maison.' },
  { mot: 'Tenir le mur', def: 'S’appuyer au mur pour ne pas tanguer. Mission noble.' },
  { mot: 'Cuver', def: 'Dormir pour digérer son ivresse. Sport olympique du dimanche matin.' },
  { mot: 'Avoir le gosier en pente', def: 'Avoir une soif perpétuelle, toujours prêt à trinquer.' },
  { mot: 'Le zinc', def: 'Le comptoir, là où tout se joue et tout se raconte.' },
  { mot: 'Se rincer la dalle', def: 'Étancher une grande soif. Geste de premiers secours.' },
  { mot: 'Un canon', def: 'Un verre de vin, à descendre au bar, debout et fier.' },
  { mot: 'Avoir un verre dans le nez', def: 'Être légèrement gris, l’œil qui frise.' },
];

// Hash simple et déterministe d’une chaîne → entier positif.
function hacher(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const indexDuJour = () => hacher(new Date().toISOString().slice(0, 10)) % MOTS.length;

export function MotDuJour({ onRetour }: { onRetour: () => void }) {
  const [index, setIndex] = useState<number>(() => indexDuJour());
  const courant = MOTS[index];

  function encore() {
    const i = Math.floor(Math.random() * MOTS.length);
    setIndex(i);
    parlerTavernier(MOTS[i].mot);
  }

  return (
    <>
      <Entete titre="Le Mot du Jour du Comptoir" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          L’argot de comptoir, expliqué façon dictionnaire de zinc. Un mot par jour, gravé à la craie.
        </p>

        <div className="pmu-ardoise">
          <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Le mot du jour
          </div>
          <p className="craie-accent" style={{ margin: '12px 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem', lineHeight: 1.2 }}>
            {courant.mot}
          </p>
          <p className="craie" style={{ margin: '10px 0 0', fontSize: '1rem', lineHeight: 1.5 }}>
            {courant.def}
          </p>
        </div>

        <button onClick={encore} className="pmu-arcade pmu-arcade--or" style={{ width: '100%', marginTop: 18, minHeight: 64, fontSize: '1.05rem' }}>
          📖 Encore un
        </button>

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          À ressortir au bon moment pour briller au comptoir. L’abus de vocabulaire, lui, n’a jamais fait de mal.
        </p>
      </section>
    </>
  );
}
