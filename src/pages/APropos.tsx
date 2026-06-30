import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useAuth } from '../features/auth/AuthContext';
import { COL, FRAUNCES } from '../ui/theme';

export default function APropos() {
  const { user, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  async function deconnexion() {
    await seDeconnecter();
    navigate('/', { replace: true });
  }

  return (
    <AppShell>
      <Hero color={COL.bleu7}>
        <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>À propos</h1>
      </Hero>

      <article style={{ padding: '6px 22px 0 22px', maxWidth: '70ch' }}>
        {user && (
          <section aria-label="Mon compte" style={{ margin: '18px 0 0 0', background: '#fff', border: `2px solid ${COL.bleu1}`, borderRadius: 16, padding: '16px 18px' }}>
            <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: COL.bleu7 }}>
              Mon compte
            </h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: COL.texte2 }}>
              Connecté en tant que <strong style={{ color: COL.texte }}>{user.email}</strong>
            </p>
            <button
              onClick={deconnexion}
              style={{
                margin: '14px 0 2px 0', minHeight: 52, padding: '12px 20px', border: `2px solid ${COL.rouge}`,
                background: '#fff', color: COL.rouge, borderRadius: 14, fontWeight: 700, fontSize: '0.98rem',
              }}
            >
              Se déconnecter
            </button>
          </section>
        )}

        <p style={{ margin: '18px 0 0 0' }}>
          A&apos;PHAS&apos;AIDE est née du mémoire d&apos;orthophonie de <strong>Clara Reolon</strong> (Université
          Clermont Auvergne, 2025), construit à partir des besoins exprimés par 46 aidants de personnes aphasiques.
        </p>
        <p style={{ margin: '14px 0 0 0' }}>
          Son objectif : réduire le « handicap de communication partagé » entre l&apos;aidant et son proche aphasique,
          en centralisant conseils pratiques, outils de communication, informations vulgarisées et ressources
          administratives.
        </p>
        <div style={{ margin: '18px 0 0 0', background: COL.orangeClair, borderRadius: 16, padding: '16px 18px', fontSize: '0.95rem' }}>
          Cette application est un complément informatif. Elle ne remplace pas une prise en soins orthophonique.
        </div>
        <h2 style={{ margin: '24px 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: COL.bleu7 }}>
          Vie privée
        </h2>
        <p style={{ margin: '10px 0 0 0' }}>
          Votre espace est protégé par un compte personnel. Vos favoris, rendez-vous et notes sont
          rattachés à votre compte et ne sont visibles que de vous, après connexion. Nous ne partageons
          aucune de vos données et n&apos;utilisons ni publicité ni traceur.
        </p>
        <h2 style={{ margin: '24px 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: COL.bleu7 }}>
          Crédits
        </h2>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem', color: COL.texte2 }}>
          Conception et contenus : Clara Reolon, orthophoniste. Les contenus complétés au-delà du mémoire sont
          signalés « À valider par Clara ».
        </p>
      </article>
    </AppShell>
  );
}
