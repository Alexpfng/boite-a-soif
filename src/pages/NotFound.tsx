import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div style={{ textAlign: 'center', padding: '60px 30px 0 30px' }}>
        <p style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3rem', color: COL.bleu1 }} aria-hidden="true">
          404
        </p>
        <h1 style={{ margin: '8px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', color: COL.bleu9 }}>
          Page introuvable
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem', color: COL.texte2 }}>
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <button
          onClick={() => navigate('/app')}
          style={{
            margin: '24px 0 0 0', border: 'none', borderRadius: 20,
            background: COL.bleu7, color: '#fff', padding: '16px 28px',
            fontSize: '1rem', fontWeight: 600, minHeight: 56,
          }}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </AppShell>
  );
}
