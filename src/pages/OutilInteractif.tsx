import { lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const PlancheOuiNon      = lazy(() => import('../features/outils/PlancheOuiNon'));
const EchelleBienEtre    = lazy(() => import('../features/outils/EchelleBienEtre'));
const SchemaCorps        = lazy(() => import('../features/outils/SchemaCorps'));
const TableauLangageAssiste = lazy(() => import('../features/outils/TableauLangageAssiste'));
const CarteAphasique     = lazy(() => import('../features/outils/CarteAphasique'));
const ArbreGenealogique  = lazy(() => import('../features/outils/ArbreGenealogique'));
const MesPhrases         = lazy(() => import('../features/outils/MesPhrases'));
const ParlePourMoi       = lazy(() => import('../features/outils/ParlePourMoi'));

const OUTILS: Record<string, React.ComponentType> = {
  'oui-non':     PlancheOuiNon,
  'echelle':     EchelleBienEtre,
  'schema-corps': SchemaCorps,
  'tla':         TableauLangageAssiste,
  'carte':       CarteAphasique,
  'arbre':       ArbreGenealogique,
  'phrases':     MesPhrases,
  'parle':       ParlePourMoi,
};

function Chargement() {
  return (
    <div className="fixed inset-0 bg-bleu-900 flex items-center justify-center" aria-label="Chargement de l'outil…" role="status">
      <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
    </div>
  );
}

export default function OutilInteractif() {
  const { slug } = useParams<{ slug: string }>();
  const Outil = slug ? OUTILS[slug] : undefined;

  if (!Outil) return <Navigate to="/outils" replace />;

  return (
    <Suspense fallback={<Chargement />}>
      <Outil />
    </Suspense>
  );
}
