// ──────────────────────────────────────────────────────────────────────────
// Le Tableau des Champions — classement local des potes par taux d'alcool,
// en direct, façon high-score de borne d'arcade (panneau ardoise + craie).
//
// ⚠️ 100 % simulé et purement ludique : les taux des potes viennent de fausses
// consos (cf. mock.ts), seul « Toi » reflète le vrai Pèse-Alco. À consommer
// avec modération, et jamais au volant.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { calculerBAC, etatBac } from '../features/pesealco/widmark';
import { usePeseAlco } from '../features/pesealco/usePeseAlco';
import { tchin, bip, vibrer } from '../features/audio/sons';
import { genererPotes, type Pote } from '../features/champions/mock';

// Couleur de section (charte) pour ce module.
const BLEU_SECTION = COL.bleu7;

// Formate un taux à la française : « 0,92 ».
const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

// Fenêtre « montée rapide » : ≥ 2 consos sur les 20 dernières minutes → 🚀.
const FENETRE_FUSEE_MS = 20 * 60_000;

// Une ligne du classement, prête à l'affichage.
interface LigneClassement {
  id: string;
  pseudo: string;
  bac: number;
  estCapitaine: boolean;
  estFusee: boolean;
  estToi: boolean;
}

/** Un pote est une « Fusée » s'il a enchaîné ≥ 2 consos en 20 min. */
function estFusee(pote: Pote, maintenant: number): boolean {
  const recentes = pote.consos.filter((c) => maintenant - c.ts <= FENETRE_FUSEE_MS);
  return recentes.length >= 2;
}

export default function Champions() {
  // Vrai taux du joueur (« Toi »), branché sur le Pèse-Alco.
  const { bac: bacToi } = usePeseAlco();

  // Les potes sont générés UNE seule fois ; seuls les BAC se recalculent au tick.
  const [potes] = useState<Pote[]>(() => genererPotes(Date.now()));

  // Horloge « live » : rafraîchie toutes les 15 s pour l'effet borne d'arcade.
  const [maintenant, setMaintenant] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setMaintenant(Date.now()), 15_000);
    const onVisible = () => { if (!document.hidden) setMaintenant(Date.now()); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  // Message éphémère (trinquer / verre d'eau) qui s'efface après ~3 s.
  const [nudge, setNudge] = useState<string | null>(null);
  const montrerNudge = (m: string) => {
    setNudge(m);
    window.setTimeout(() => setNudge((cur) => (cur === m ? null : cur)), 3000);
  };

  // Classement complet : potes + « Toi », recalculé à chaque tick puis trié.
  const classement = useMemo<LigneClassement[]>(() => {
    const lignesPotes: LigneClassement[] = potes.map((p) => ({
      id: p.id,
      pseudo: p.pseudo,
      bac: calculerBAC(p.consos, p.profil, maintenant),
      estCapitaine: Boolean(p.estCapitaine),
      estFusee: estFusee(p, maintenant),
      estToi: false,
    }));
    const ligneToi: LigneClassement = {
      id: 'toi',
      pseudo: 'Toi',
      bac: bacToi,
      estCapitaine: bacToi <= 0,
      estFusee: false,
      estToi: true,
    };
    return [...lignesPotes, ligneToi].sort((a, b) => b.bac - a.bac);
  }, [potes, maintenant, bacToi]);

  // Actions « à distance » sur un pote (pas dispo pour la ligne « Toi »).
  const trinquer = (pseudo: string) => {
    vibrer([60, 40, 60]);
    tchin();
    montrerNudge(`Tchin avec ${pseudo} ! 🍻`);
  };
  const verreEau = (pseudo: string) => {
    vibrer(400);
    bip();
    montrerNudge(`Tournée d'eau pour ${pseudo}. Bien vu, le Sam.`);
  };

  return (
    <AppShell>
      {/* ── Bandeau d'en-tête (panneau sombre bleu7) ── */}
      <section
        data-tone="bleu"
        style={{ background: BLEU_SECTION, color: COL.creme, padding: '26px 22px 28px', position: 'relative', overflow: 'hidden', borderBottom: `2px solid ${COL.or}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: COL.texte2 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: COL.orangeAccent, display: 'inline-block' }} />
          En direct
        </div>

        <h1 className="pmu-titre" style={{ fontSize: '2.1rem', marginTop: 10 }}>
          LE TABLEAU DES <span className="accent">CHAMPIONS</span>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.96rem', color: COL.texte2, lineHeight: 1.45 }}>
          Le classement de la bande, en direct.
        </p>
      </section>

      {/* ── Nudge éphémère (trinquer / verre d'eau) ── */}
      {nudge && (
        <div role="status" style={{ margin: '14px 16px 0', background: COL.panneau, color: COL.creme, border: `1px solid ${COL.or}`, borderRadius: 14, padding: '12px 16px', fontWeight: 600, fontSize: '0.92rem' }}>
          {nudge}
        </div>
      )}

      {/* ── Le grand panneau ardoise : high-score façon arcade ── */}
      <section style={{ margin: '20px 16px 0' }}>
        <div className="pmu-ardoise">
          <h2 className="craie" style={{ margin: '0 0 14px', fontFamily: FRAUNCES, fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
            🏆 Hall of Fame 🏆
          </h2>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {classement.map((l, i) => {
              const etat = etatBac(l.bac);
              const rang = i + 1;

              // Pastille de statut : capitaine 😇 > fusée 🚀 > emoji de l'état.
              let pastilleEmoji = etat.emoji;
              let pastilleTexte = '';
              if (l.estCapitaine && l.bac <= 0) {
                pastilleEmoji = '😇';
                pastilleTexte = 'SAM';
              } else if (l.estFusee) {
                pastilleEmoji = '🚀';
                pastilleTexte = 'FUSÉE';
              }

              return (
                <li
                  key={l.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 12,
                    // On met « Toi » en valeur ; halo doré pour le Sam.
                    background: l.estToi
                      ? COL.orangeClair
                      : l.estCapitaine && l.bac <= 0
                        ? 'rgba(233,196,106,0.12)'
                        : 'rgba(243,232,207,0.05)',
                    border: l.estToi
                      ? `2px solid ${COL.or}`
                      : l.estCapitaine && l.bac <= 0
                        ? '2px solid rgba(233,196,106,0.55)'
                        : '1px solid rgba(243,232,207,0.12)',
                    boxShadow: l.estCapitaine && l.bac <= 0 ? '0 0 16px rgba(233,196,106,0.35)' : 'none',
                  }}
                >
                  {/* Rang : #1, #2… en craie-accent, gros, façon score */}
                  <span
                    className="craie-accent"
                    style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.35rem', minWidth: 42, letterSpacing: '0.02em' }}
                    aria-hidden="true"
                  >
                    #{rang}
                  </span>

                  {/* Pseudo + éventuel badge de statut */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="craie" style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.pseudo}{l.estToi ? ' ⭐' : ''}
                    </div>
                    {pastilleTexte && (
                      <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                        {pastilleEmoji} {pastilleTexte}
                      </div>
                    )}
                  </div>

                  {/* Taux g/L, coloré selon l'état (vert / orange / rouge) */}
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: FRAUNCES, fontWeight: 800, fontSize: '1.5rem', lineHeight: 1, color: etat.accent }}>
                      {fmtBac(l.bac)}
                    </span>
                    <span className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 700 }}>g/L</span>
                  </div>

                  {/* Pastille emoji de statut, bien visible à droite */}
                  <span style={{ fontSize: '1.5rem', minWidth: 30, textAlign: 'center' }} aria-hidden="true">
                    {pastilleEmoji}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Actions sur les potes (hors « Toi ») ── */}
      <section style={{ margin: '22px 16px 0' }}>
        <h2 style={{ margin: '0 0 12px 2px', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.15rem', color: COL.or }}>
          Anime la tablée
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {classement.filter((l) => !l.estToi).map((l) => (
            <li key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '12px 14px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <span style={{ flex: 1, minWidth: 110, fontWeight: 800, fontSize: '0.95rem', color: COL.texte, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {l.pseudo}
              </span>
              <button
                className="pmu-arcade"
                onClick={() => trinquer(l.pseudo)}
                style={{ minHeight: 48, padding: '0 14px', fontSize: '0.88rem' }}
              >
                🍻 Trinquer
              </button>
              <button
                className="pmu-arcade pmu-arcade--ardoise"
                onClick={() => verreEau(l.pseudo)}
                style={{ minHeight: 48, padding: '0 14px', fontSize: '0.88rem' }}
              >
                💧 Verre d'eau
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Encart « démo » ── */}
      <section style={{ margin: '22px 16px 0' }}>
        <div style={{ background: COL.orangeClair, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '12px 16px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: COL.texte2, lineHeight: 1.5 }}>
            🎮 Classement local et simulé entre potes (démo). Seul ton taux à toi
            est réel : il vient du Pèse-Alco.
          </p>
        </div>
      </section>

      {/* ── Avertissement modération (toujours visible) ── */}
      <section style={{ margin: '24px 16px 0' }}>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '0.84rem', color: COL.texte2, lineHeight: 1.55 }}>
            <strong style={{ color: COL.or }}>⚠️ Pour rigoler entre potes.</strong> L'abus
            d'alcool est dangereux pour la santé. Ce classement n'est pas une
            compétition : le vrai champion, c'est le Sam. Ne prends <strong>jamais</strong> la route après avoir bu.
          </p>
        </div>
      </section>

      <footer style={{ margin: '24px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(243,232,207,0.14)' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2 }}>
          À consommer avec modération. Le perdant paie quand même sa tournée.
        </p>
      </footer>
    </AppShell>
  );
}
