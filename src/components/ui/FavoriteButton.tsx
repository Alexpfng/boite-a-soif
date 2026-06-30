import { Heart } from 'lucide-react';
import { useFavoris } from '../../features/favoris/useFavorites';
import { useToast } from './Toast';

interface Props {
  id: string;
  section: string;
  titre?: string;
  className?: string;
}

export function FavoriteButton({ id, section, titre, className = '' }: Props) {
  const { estFavori, basculer } = useFavoris();
  const { annoncer } = useToast();
  const actif = estFavori(id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    basculer(id, section);
    annoncer(actif ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }

  return (
    <button
      onClick={handleClick}
      aria-label={actif ? `Retirer "${titre}" des favoris` : `Ajouter "${titre}" aux favoris`}
      aria-pressed={actif}
      className={[
        'flex items-center justify-center rounded-full transition-all',
        actif
          ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
          : 'text-texte-2 bg-bleu-100 hover:bg-bleu-200',
        className,
      ].join(' ')}
    >
      <Heart
        size={22}
        strokeWidth={actif ? 0 : 2}
        fill={actif ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
}
