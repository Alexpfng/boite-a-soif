import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { lireXP, niveauDepuisXP, TITRES, XP_PAR_NIVEAU } from '../../features/cabine/progression';

// ── Le Niveau de Pilier ─────────────────────────────────────────────────────
// Affiche le niveau, la barre de progression, et le palmarès des grades.
export function NiveauPilier({ onRetour }: { onRetour: () => void }) {
  const xp = lireXP();
  const n = niveauDepuisXP(xp);

  return (
    <>
      <Entete titre="Niveau de Pilier" onRetour={onRetour} />
      <section style={{ margin: '16px 16px 0', textAlign: 'center' }}>
        <div className="pmu-ardoise">
          <div style={{ fontSize: '3rem', lineHeight: 1 }} aria-hidden="true">{n.emoji}</div>
          <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>Niveau {n.niveau}</div>
          <div className="craie" style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.6rem', marginTop: 2 }}>{n.titre}</div>

          <div style={{ background: 'rgba(243,232,207,0.12)', borderRadius: 999, height: 14, marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${n.pct}%`, height: '100%', background: COL.or, transition: 'width 0.4s ease' }} />
          </div>
          <div className="craie-2" style={{ fontSize: '0.8rem', marginTop: 6 }}>{n.xpDansNiveau} / {XP_PAR_NIVEAU} XP — plus que {XP_PAR_NIVEAU - n.xpDansNiveau} pour le grade suivant</div>
        </div>

        <p style={{ color: COL.texte2, fontSize: '0.86rem', lineHeight: 1.5, margin: '14px 2px 0' }}>
          Tu gagnes de l’XP à chaque numéro lancé dans la Cabine. Joue, reviens, et grimpe les grades du comptoir.
        </p>

        <div style={{ marginTop: 18, textAlign: 'left' }}>
          <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '0 2px 10px' }}>Les grades</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TITRES.map((t, i) => {
              const atteint = n.niveau >= i + 1;
              const actuel = n.niveau === i + 1;
              return (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: actuel ? COL.orangeClair : COL.panneau, border: `1px solid ${actuel ? COL.or : COL.bleu1}`, borderRadius: 10, padding: '8px 12px', opacity: atteint ? 1 : 0.5 }}>
                  <span style={{ width: 26, textAlign: 'center', fontWeight: 800, color: COL.texte2 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 700, color: COL.creme }}>{t}</span>
                  <span aria-hidden="true">{atteint ? '✅' : '🔒'}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
