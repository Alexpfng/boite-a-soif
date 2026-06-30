import { Volume2, Square } from 'lucide-react';
import { useSpeech } from '../../features/tts/useSpeech';

interface Props {
  texte: string;
  className?: string;
  label?: string;
}

export function SpeakButton({ texte, className = '', label }: Props) {
  const { disponible, etat, lire, stop } = useSpeech();

  if (!disponible) return null;

  const enCours = etat === 'lecture';

  function handleClick() {
    if (enCours) {
      stop();
    } else {
      lire([texte]);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={enCours ? 'Arrêter la lecture' : (label ?? 'Lire à voix haute')}
      aria-pressed={enCours}
      className={[
        'flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors',
        enCours
          ? 'bg-bleu-700 text-white'
          : 'bg-bleu-100 text-bleu-700 hover:bg-bleu-200',
        className,
      ].join(' ')}
    >
      {enCours ? (
        <Square size={16} aria-hidden="true" />
      ) : (
        <Volume2 size={16} aria-hidden="true" />
      )}
      {enCours ? 'Arrêter' : 'Écouter'}
    </button>
  );
}
