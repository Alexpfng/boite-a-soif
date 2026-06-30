import { SpeakButton } from '../ui/SpeakButton';
import { FavoriteButton } from '../ui/FavoriteButton';

interface Props {
  titre: string;
  accroche?: string;
  couleur?: string;         // CSS color for accent bar
  ttsTexte?: string;
  favoriId?: string;
  favoriSection?: string;
  className?: string;
}

export function PageHeader({
  titre,
  accroche,
  couleur,
  ttsTexte,
  favoriId,
  favoriSection,
  className = '',
}: Props) {
  return (
    <div className={`pt-6 pb-5 px-5 ${className}`}>
      {couleur && (
        <div
          className="w-10 h-1.5 rounded-full mb-4"
          style={{ background: couleur }}
          aria-hidden="true"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-display font-bold text-bleu-900 leading-tight flex-1">
          {titre}
        </h1>
        {favoriId && favoriSection && (
          <FavoriteButton
            id={favoriId}
            section={favoriSection}
            titre={titre}
            className="w-11 h-11 mt-0.5 flex-shrink-0"
          />
        )}
      </div>

      {accroche && (
        <p className="mt-2 text-base text-texte-2 leading-relaxed">{accroche}</p>
      )}

      {ttsTexte && (
        <div className="mt-4">
          <SpeakButton texte={ttsTexte} label={`Lire "${titre}" à voix haute`} />
        </div>
      )}
    </div>
  );
}
