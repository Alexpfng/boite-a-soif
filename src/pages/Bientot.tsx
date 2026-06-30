import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';

const A_VENIR = [
  { emoji: '📻', nom: 'Le Juke-Box à Conneries', desc: 'Le soundboard des répliques de comptoir, lues par le tavernier.' },
  { emoji: '📋', nom: 'L’Ardoise des Comptes', desc: 'Ton historique de soirées, ton pic de la session et tes badges.' },
  { emoji: '🏆', nom: 'Le Tableau des Champions', desc: 'Le classement des potes en direct, façon borne d’arcade.' },
];

export default function Bientot() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div style={{ padding: '40px 22px 10px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.4rem' }} aria-hidden="true">🚧🍺</div>
        <h1 style={{ margin: '12px 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.8rem', color: COL.bleu9 }}>
          Ça mijote au comptoir
        </h1>
        <p style={{ margin: '12px auto 0', maxWidth: '34ch', color: COL.texte2, fontSize: '1rem', lineHeight: 1.55 }}>
          Cette partie de la Boîte à Soif arrive bientôt. En attendant, le
          <strong> Pèse-Alco</strong> est déjà ouvert : sers-toi !
        </p>
      </div>

      <section style={{ margin: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {A_VENIR.map((f) => (
          <div key={f.nom} style={{ display: 'flex', gap: 14, alignItems: 'center', background: '#fff', border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '16px 18px' }}>
            <span style={{ fontSize: '1.8rem' }} aria-hidden="true">{f.emoji}</span>
            <span>
              <span style={{ display: 'block', fontWeight: 700, color: COL.bleu9 }}>{f.nom}</span>
              <span style={{ display: 'block', fontSize: '0.86rem', color: COL.texte2, marginTop: 2, lineHeight: 1.45 }}>{f.desc}</span>
            </span>
          </div>
        ))}
      </section>

      <div style={{ margin: '26px 16px 0' }}>
        <button onClick={() => navigate('/pese-alco')}
          style={{ width: '100%', minHeight: 60, border: 'none', borderRadius: 16, background: COL.orange, color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>
          Ouvrir le Pèse-Alco
        </button>
      </div>
    </AppShell>
  );
}
