import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { PHRASES, type Phrase } from '../features/jukebox/phrases';
import { parlerTavernier, tchin, capsule, cacahuete, bip, fanfare } from '../features/audio/sons';

// Paires {fond, texte} pour garantir le contraste sur fond sombre.
// On alterne selon l'index : rouge néon, or, ambre, ardoise.
const PAIRES_ARCADE: { bg: string; fg: string }[] = [
  { bg: COL.rougeNeon, fg: '#fff' },
  { bg: COL.or, fg: '#2A1F10' },
  { bg: COL.ambre, fg: '#2A1F10' },
  { bg: COL.panneau, fg: COL.creme },
];

// La table de mixage : bruitages seuls, sans déclamation.
const BRUITAGES: { id: string; emoji: string; label: string; jouer: () => void }[] = [
  { id: 'tchin', emoji: '🍻', label: 'Tchin', jouer: tchin },
  { id: 'capsule', emoji: '🍾', label: 'Capsule', jouer: capsule },
  { id: 'cacahuete', emoji: '🥜', label: 'Cacahuète', jouer: cacahuete },
  { id: 'bip', emoji: '🔔', label: 'Bip', jouer: () => bip() },
  { id: 'fanfare', emoji: '🎺', label: 'Fanfare', jouer: fanfare },
];

// La synthèse vocale est-elle disponible dans ce navigateur ?
function voixDispo(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// On regroupe les phrases par catégorie, en préservant l'ordre d'apparition.
function grouperParCategorie(phrases: Phrase[]): { categorie: string; items: Phrase[] }[] {
  const groupes: { categorie: string; items: Phrase[] }[] = [];
  for (const p of phrases) {
    let groupe = groupes.find((g) => g.categorie === p.categorie);
    if (!groupe) {
      groupe = { categorie: p.categorie, items: [] };
      groupes.push(groupe);
    }
    groupe.items.push(p);
  }
  return groupes;
}

export default function JukeBox() {
  // Vérifié au montage (les voix peuvent n'arriver qu'après le 1er rendu).
  const [ttsDispo, setTtsDispo] = useState<boolean>(voixDispo());
  // Réplique en cours de déclamation (retour visuel).
  const [enCours, setEnCours] = useState<string | null>(null);

  useEffect(() => {
    setTtsDispo(voixDispo());
  }, []);

  // Index global stable pour faire tourner les couleurs des touches.
  let indexGlobal = -1;
  const groupes = grouperParCategorie(PHRASES);

  // Au clic sur une réplique : le tavernier déclame + un petit « tchin ».
  const declamer = (p: Phrase) => {
    const parle = parlerTavernier(p.texte);
    tchin();
    setEnCours(p.texte);
    window.setTimeout(() => setEnCours((c) => (c === p.texte ? null : c)), parle ? 2800 : 1600);
  };

  return (
    <AppShell>
      {/* ── En-tête : l'enseigne du juke-box ── */}
      <section
        data-tone="ardoise"
        style={{ background: '#14110F', color: COL.creme, padding: '26px 22px 28px', position: 'relative', overflow: 'hidden', borderBottom: `2px solid ${COL.or}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: COL.or }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: COL.or, display: 'inline-block' }} />
          Le comptoir en stéréo
        </div>

        <h1 className="pmu-titre" style={{ fontSize: '2.1rem', marginTop: 12 }}>
          LE JUKE-BOX <span className="accent" style={{ color: COL.rougeNeon }}>À CONNERIES</span>
        </h1>

        <p style={{ margin: '10px 0 0', fontSize: '1rem', color: COL.texte, lineHeight: 1.45 }}>
          Appuie, le tavernier déclame. 🍺
        </p>

        {/* Avertissement si la voix n'est pas dispo : les bruitages, eux, marchent. */}
        {!ttsDispo && (
          <p role="status" style={{ margin: '14px 0 0', background: COL.panneau, border: `1px solid ${COL.bleu1}`, color: COL.texte2, borderRadius: 14, padding: '10px 14px', fontSize: '0.86rem', lineHeight: 1.45 }}>
            🔇 Pas de voix sur ce navigateur : le tavernier reste muet, mais la table de mixage tourne toujours.
          </p>
        )}
      </section>

      {/* ── Retour visuel : le tavernier déclame ── */}
      {enCours && (
        <div role="status" style={{ margin: '14px 16px 0', background: COL.bleu9, color: COL.creme, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.3rem' }} aria-hidden="true">🔊</span>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.35 }}>
            {ttsDispo ? '« ' + enCours + ' »' : 'Voix indisponible — mais le « tchin » a sonné !'}
          </span>
        </div>
      )}

      {/* ── Grille de répliques, groupée par catégorie ── */}
      {groupes.map((groupe) => (
        <section key={groupe.categorie} style={{ margin: '22px 16px 0' }}>
          <h2 className="pmu-titre" style={{ fontSize: '1.05rem', margin: '0 0 12px 2px' }}>
            {groupe.categorie}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {groupe.items.map((p) => {
              indexGlobal += 1;
              const paire = PAIRES_ARCADE[indexGlobal % PAIRES_ARCADE.length];
              return (
                <button
                  key={p.id}
                  className="pmu-arcade"
                  onClick={() => declamer(p)}
                  aria-label={`Déclamer : ${p.texte}`}
                  style={{
                    background: paire.bg,
                    color: paire.fg,
                    minHeight: 96,
                    padding: '12px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '2rem', lineHeight: 1, color: paire.fg }} aria-hidden="true">{p.emoji}</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, lineHeight: 1.25, color: paire.fg }}>{p.texte}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* ── La table de mixage : les bruitages tout seuls ── */}
      <section style={{ margin: '30px 16px 0' }}>
        <h2 className="pmu-titre" style={{ fontSize: '1.05rem', margin: '0 0 4px 2px' }}>
          La table de mixage du comptoir
        </h2>
        <p style={{ margin: '0 0 12px 2px', fontSize: '0.86rem', color: COL.texte2 }}>
          Les bruitages tout secs, pour ponctuer la conversation.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {BRUITAGES.map((b) => (
            <button
              key={b.id}
              className="pmu-arcade pmu-arcade--ambre"
              onClick={b.jouer}
              aria-label={`Jouer le bruitage : ${b.label}`}
              style={{
                flex: '1 1 90px',
                minHeight: 64,
                color: '#2A1F10',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '10px 8px',
              }}
            >
              <span style={{ fontSize: '1.5rem', lineHeight: 1, color: '#2A1F10' }} aria-hidden="true">{b.emoji}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2A1F10' }}>{b.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Footer léger ── */}
      <footer style={{ margin: '28px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(243,232,207,0.14)' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2, fontFamily: FRAUNCES }}>
          À consommer avec modération. Le juke-box, lui, est gratuit — c’est déjà ça de pris.
        </p>
      </footer>
    </AppShell>
  );
}
