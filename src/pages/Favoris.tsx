import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useFavoris } from '../features/favoris/useFavorites';
import { useToast } from '../components/ui/Toast';
import { COEUR_PATH } from '../ui/icons';
import { COL, FRAUNCES, SEC, CARD_SHADOW_SM, type SectionKey } from '../ui/theme';
import CONTENT from '../content';

interface FicheRef {
  id: string;
  titre: string;
  path: string;
  section: SectionKey;
}

function toutesLesFiches(): FicheRef[] {
  return [
    ...CONTENT.conseils.map((f) => ({ id: f.id, titre: f.titre, path: `/conseils/${f.slug}`, section: 'conseils' as const })),
    ...CONTENT.outils.map((f) => ({ id: f.id, titre: f.titre, path: `/outils/${f.slug}`, section: 'outils' as const })),
    ...CONTENT.comprendre.map((f) => ({
      id: f.id, titre: f.titre, section: 'comprendre' as const,
      path: f.special ? `/comprendre/${f.special}` : `/comprendre/${f.slug}`,
    })),
    ...CONTENT.aides.map((f) => ({ id: f.id, titre: f.titre, path: `/aides/${f.slug}`, section: 'aides' as const })),
  ];
}

export default function Favoris() {
  const navigate = useNavigate();
  const { favoris, basculer } = useFavoris();
  const { annoncer } = useToast();

  const fiches = toutesLesFiches();
  const groupes = (['conseils', 'outils', 'comprendre', 'aides'] as SectionKey[])
    .map((sec) => ({
      sec,
      items: favoris
        .map((f) => fiches.find((x) => x.id === f.id))
        .filter((x): x is FicheRef => !!x && x.section === sec),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <AppShell>
      <Hero color={COL.orange}>
        <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>Mes favoris</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.89rem', opacity: 0.94 }}>
          Vos contenus mis de côté, toujours à portée de main.
        </p>
      </Hero>

      {favoris.length === 0 && (
        <div style={{ textAlign: 'center', padding: '36px 30px 0 30px', color: COL.texte2 }}>
          <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style={{ margin: '0 auto', display: 'block' }}>
            <path d={COEUR_PATH} fill="none" stroke={COL.gris} strokeWidth="1.6" />
          </svg>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.95rem' }}>
            Aucun favori pour le moment. Appuyez sur le cœur d&apos;une fiche pour la retrouver ici.
          </p>
        </div>
      )}

      <div style={{ padding: '18px 16px 0 16px' }}>
        {groupes.map((g) => (
          <section key={g.sec} style={{ margin: '0 0 20px 0' }}>
            <h2 style={{ margin: '0 0 10px 2px', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.05rem', color: SEC[g.sec].color }}>
              {SEC[g.sec].label}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map((f) => (
                <div key={f.id} data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(f.path)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                      border: 'none', background: 'transparent',
                      padding: '14px 0 14px 18px', textAlign: 'left', color: COL.texte, minHeight: 64,
                    }}
                  >
                    <span style={{ width: 10, height: 36, borderRadius: 5, background: SEC[g.sec].color, flexShrink: 0 }} aria-hidden="true" />
                    <span style={{ flex: 1, fontWeight: 600, color: COL.bleu9, fontSize: '0.95rem' }}>{f.titre}</span>
                  </button>
                  <button
                    onClick={() => { basculer(f.id, g.sec); annoncer('Retiré des favoris'); }}
                    aria-label="Retirer des favoris"
                    style={{ width: 54, alignSelf: 'stretch', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                      <path d={COEUR_PATH} fill={COL.orange} />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
