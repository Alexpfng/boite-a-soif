import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useFavoris } from '../features/favoris/useFavorites';
import { useToast } from '../components/ui/Toast';
import { useSpeech } from '../features/tts/useSpeech';
import { lireJournal, effacerJournal, type EntreeBienEtre } from '../features/bienetre/journal';
import { CourbeHistorique } from '../components/ui/CourbeHistorique';
import { COEUR_PATH, IconeHautParleur } from '../ui/icons';
import { COL, FRAUNCES, CARD_SHADOW_SM } from '../ui/theme';
import { exporterOutilPdf } from '../lib/pdf';
import CONTENT from '../content';

// Historique des ressentis enregistrés via l'échelle — utile à montrer aux soignants
function HistoriqueBienEtre() {
  const [journal, setJournal] = useState<EntreeBienEtre[]>(lireJournal);
  const { annoncer } = useToast();

  if (journal.length === 0) return null;
  const recents = [...journal].reverse().slice(0, 7);

  return (
    <section aria-label="Derniers ressentis" style={{ margin: '26px 0 0 0' }}>
      <h2 style={{ margin: '0 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: COL.bleu5 }}>
        Derniers ressentis
      </h2>
      <p style={{ margin: '0 0 12px 0', fontSize: '0.84rem', color: COL.texte2 }}>
        Enregistrés automatiquement à chaque utilisation. Pensez à les montrer à l&apos;orthophoniste ou au médecin.
      </p>
      {journal.length >= 2 && (
        <div data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, padding: '14px 16px 8px 16px', margin: '0 0 12px 0' }}>
          <p style={{ margin: '0 0 6px 2px', fontSize: '0.78rem', fontWeight: 600, color: COL.texte2 }}>
            Évolution ({Math.min(journal.length, 30)} derniers ressentis)
          </p>
          <CourbeHistorique
            ariaLabel="Courbe d'évolution du bien-être"
            points={journal.map((e) => ({
              date: e.date,
              valeur: e.id,
              couleur: CONTENT.echelle.find((c) => c.id === e.id)?.couleur,
            }))}
          />
        </div>
      )}
      <div data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, padding: '8px 18px' }}>
        {recents.map((e, i) => {
          const cran = CONTENT.echelle.find((c) => c.id === e.id);
          if (!cran) return null;
          const dateStr = new Date(`${e.date}T${e.heure}`).toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'short',
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: i < recents.length - 1 ? `1px solid ${COL.bleu1}` : 'none',
              }}
            >
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: cran.couleur, flexShrink: 0 }} aria-hidden="true" />
              <span style={{ flex: 1, fontWeight: 600, color: COL.texte, fontSize: '0.95rem' }}>{cran.label}</span>
              <span style={{ fontSize: '0.78rem', color: COL.texte2 }}>{dateStr}, {e.heure.replace(':', ' h ')}</span>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => { effacerJournal(); setJournal([]); annoncer('Historique effacé'); }}
        style={{
          margin: '10px 0 0 0', border: 'none', background: 'transparent',
          color: COL.texte2, fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline',
          padding: '6px 2px',
        }}
      >
        Effacer l&apos;historique
      </button>
    </section>
  );
}

export default function OutilDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { estFavori, basculer } = useFavoris();
  const { annoncer } = useToast();
  const { etat, lire, stop } = useSpeech();

  const outil = CONTENT.outils.find((o) => o.slug === slug) ?? CONTENT.outils[0];
  const fav = estFavori(outil.id);
  const speaking = etat === 'lecture';

  function toggleFav() {
    basculer(outil.id, 'outils');
    annoncer(fav ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }

  function telechargerPdf() {
    exporterOutilPdf(outil);
    annoncer('PDF téléchargé');
  }

  return (
    <AppShell>
      <Hero color={COL.bleu5}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          Outils — {outil.sous}
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.25 }}>
          {outil.titre}
        </h1>
        <div style={{ display: 'flex', gap: 10, margin: '16px 0 0 0' }}>
          <button
            onClick={() => (speaking ? stop() : lire([`${outil.titre}. ${outil.desc} Comment l’utiliser ? ${outil.mode}`]))}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 999,
              background: '#fff', color: COL.bleu9, padding: '10px 18px',
              fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
            }}
          >
            <IconeHautParleur />
            {speaking ? 'Arrêter' : 'Écouter'}
          </button>
          <button
            onClick={toggleFav}
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={fav}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 999, background: '#fff', width: 48, minHeight: 48,
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d={COEUR_PATH} fill={fav ? COL.orange : 'none'} stroke={COL.orange} strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </Hero>

      <article style={{ padding: '6px 22px 0 22px', maxWidth: '70ch' }}>
        <p style={{ margin: '18px 0 0 0' }}>{outil.desc}</p>
        <h2 style={{ margin: '24px 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: COL.bleu5 }}>
          Comment l&apos;utiliser ?
        </h2>
        <p style={{ margin: '10px 0 0 0' }}>{outil.mode}</p>
        <button
          onClick={() => navigate(`/outils/${outil.slug}/outil`)}
          data-tone="orange"
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '26px 0 0 0', border: 'none', borderRadius: 20,
            background: COL.orange, color: '#fff', padding: 18,
            fontSize: '1rem', fontWeight: 600, minHeight: 64,
          }}
        >
          Ouvrir l&apos;outil en plein écran
        </button>
        <button
          onClick={telechargerPdf}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '12px 0 0 0', border: `2px solid ${COL.bleu7}`, borderRadius: 20,
            background: '#fff', color: COL.bleu7, padding: 15,
            fontSize: '0.95rem', fontWeight: 600, minHeight: 56,
          }}
        >
          Télécharger en PDF (version imprimable)
        </button>

        {outil.slug === 'echelle' && <HistoriqueBienEtre />}
      </article>
    </AppShell>
  );
}
