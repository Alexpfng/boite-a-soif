import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useFavoris } from '../features/favoris/useFavorites';
import { useToast } from '../components/ui/Toast';
import { ChevronDroit, COEUR_PATH } from '../ui/icons';
import { COL, FRAUNCES, SEC, CARD_SHADOW, type SectionKey } from '../ui/theme';
import CONTENT from '../content';

const INTROS: Record<SectionKey, string> = {
  conseils: CONTENT.conseilsIntro,
  outils: 'Des outils à utiliser à deux, dans l’instant. Chaque outil existe aussi en version imprimable.',
  comprendre: 'L’aphasie expliquée simplement : définitions, fonctionnement, rééducation et idées reçues.',
  aides: 'Droits, aides financières, associations et contacts utiles pour vous et votre proche.',
};

interface ItemFiche {
  id: string;
  slug: string;
  titre: string;
  accroche: string;
  special?: string;
}

function listOf(sec: SectionKey): ItemFiche[] {
  if (sec === 'conseils') return CONTENT.conseils;
  if (sec === 'outils') return CONTENT.outils.map((o) => ({ id: o.id, slug: o.slug, titre: o.titre, accroche: o.sous }));
  if (sec === 'comprendre') return CONTENT.comprendre;
  return CONTENT.aides;
}

export function pathFor(sec: SectionKey, f: ItemFiche): string {
  if (sec === 'outils') return `/outils/${f.slug}`;
  if (f.special === 'definitions') return '/comprendre/definitions';
  if (f.special === 'stereotypes') return '/comprendre/stereotypes';
  return `/${sec}/${f.slug}`;
}

export default function SectionPage({ section }: { section: SectionKey }) {
  const navigate = useNavigate();
  const { estFavori, basculer } = useFavoris();
  const { annoncer } = useToast();
  const meta = SEC[section];
  const items = listOf(section);

  function toggleFav(f: ItemFiche) {
    const etait = estFavori(f.id);
    basculer(f.id, section);
    annoncer(etait ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }

  return (
    <AppShell>
      <Hero color={meta.color} padding="24px 22px 26px 22px">
        <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.67rem', lineHeight: 1.2 }}>
          {meta.label}
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.89rem', lineHeight: 1.55, opacity: 0.94 }}>
          {INTROS[section]}
        </p>
      </Hero>

      {/* Témoignage (section Outils uniquement) */}
      {section === 'outils' && (
        <section aria-label="Témoignage" style={{ margin: '18px 16px 0 16px' }}>
          <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 52, height: 52, borderRadius: '50%', background: COL.bleu1, color: COL.bleu7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.22rem',
                }}
                aria-hidden="true"
              >
                Y
              </span>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: COL.bleu9 }}>
                  Yolande — aidante depuis 20 ans
                </h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: COL.texte2 }}>
                  Elle raconte son quotidien depuis l&apos;AVC de son mari. ≈ 10 min
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 0 0' }}>
              <button
                onClick={() => annoncer('Témoignage audio bientôt disponible')}
                aria-label="Écouter le témoignage — bientôt disponible"
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', background: COL.bleu5,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5,
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M8 5 L19 12 L8 19 Z" />
                </svg>
              </button>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: COL.bleu1 }} />
              <span style={{ fontSize: '0.78rem', color: COL.texte2, whiteSpace: 'nowrap' }}>Bientôt disponible</span>
            </div>
          </div>
        </section>
      )}

      {/* Liste des fiches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '18px 16px 0 16px' }}>
        {items.map((f) => {
          const fav = estFavori(f.id);
          return (
            <div
              key={f.id}
              data-card="true"
              style={{ position: 'relative', background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => navigate(pathFor(section, f))}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 14,
                  background: 'transparent', border: 'none',
                  padding: '18px 0 18px 20px', textAlign: 'left', color: COL.texte, minHeight: 76,
                }}
              >
                <span style={{ width: 12, height: 44, borderRadius: 6, background: meta.color, flexShrink: 0 }} aria-hidden="true" />
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '1rem', color: COL.bleu9, lineHeight: 1.35 }}>
                    {f.titre}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 3, lineHeight: 1.45 }}>
                    {f.accroche}
                  </span>
                </span>
                <ChevronDroit />
              </button>
              <button
                onClick={() => toggleFav(f)}
                aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                aria-pressed={fav}
                style={{ width: 54, alignSelf: 'stretch', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
                  <path d={COEUR_PATH} fill={fav ? COL.orange : 'none'} stroke={COL.orange} strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
