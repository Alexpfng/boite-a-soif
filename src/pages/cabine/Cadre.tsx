import { COL } from '../../ui/theme';

/** En-tête commun des numéros de La Cabine : bouton retour + titre enseigne. */
export function Entete({ titre, onRetour }: { titre: string; onRetour: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 16px 0' }}>
      <button
        onClick={onRetour}
        aria-label="Retour"
        style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${COL.bleu1}`, background: COL.panneau, color: COL.or, fontSize: '1.2rem', fontWeight: 800 }}
      >
        ‹
      </button>
      <h2 className="pmu-titre" style={{ fontSize: '1.25rem' }}>{titre}</h2>
    </div>
  );
}
