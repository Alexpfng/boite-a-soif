import { useEffect, useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES, CARD_SHADOW } from '../ui/theme';
import { IconeHautParleur } from '../ui/icons';
import { usePeseAlco } from '../features/pesealco/usePeseAlco';
import { PRESETS, formaterDuree, LIMITE_LEGALE, type Sexe } from '../features/pesealco/widmark';
import { parlerTavernier, capsule } from '../features/audio/sons';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

const SEXES: { cle: Sexe; label: string }[] = [
  { cle: 'homme', label: 'Homme' },
  { cle: 'femme', label: 'Femme' },
  { cle: 'autre', label: 'Autre' },
];

export default function PeseAlco() {
  const {
    profil, setProfil,
    consos, ajouter, annulerDerniere, viderSession, retirer,
    bac, etat, msRetourZero, msSousLimite, sousLimite, totalGrammes,
  } = usePeseAlco();

  const [modalDanger, setModalDanger] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const etatPrec = useRef(etat.cle);

  // Pop la modale d'alerte au moment où l'on bascule en zone danger.
  useEffect(() => {
    if (etat.cle === 'danger' && etatPrec.current !== 'danger') setModalDanger(true);
    etatPrec.current = etat.cle;
  }, [etat.cle]);

  const montrerNudge = (m: string) => {
    setNudge(m);
    window.setTimeout(() => setNudge((cur) => (cur === m ? null : cur)), 3200);
  };

  return (
    <AppShell>
      {/* Styles scopés : sliders « tirette de bière » + pulsation danger */}
      <style>{`
        .pa-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 10px; border-radius: 999px; background: ${COL.bleu1}; outline-offset: 4px; }
        .pa-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 34px; height: 34px; border-radius: 12px; background: ${COL.or}; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,.45); cursor: pointer; }
        .pa-slider::-moz-range-thumb { width: 34px; height: 34px; border-radius: 12px; background: ${COL.or}; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,.45); cursor: pointer; }
        @keyframes paPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); } 50% { box-shadow: 0 0 0 6px rgba(192,57,43,.28); } }
        .pa-danger { animation: paPulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .pa-danger { animation: none; } }
      `}</style>

      {/* ── Bandeau taux en direct (couleur pilotée par l'état) ── */}
      <section
        data-tone="bleu"
        className={etat.cle === 'danger' ? 'pa-danger' : undefined}
        style={{ background: etat.fond, color: etat.texteSur, padding: '26px 22px 28px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: etat.accent, display: 'inline-block' }} />
          En direct
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
          <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4.2rem', lineHeight: 1, color: etat.accent }}>
            {fmtBac(bac)}
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>g/L</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <span style={{ fontSize: '2rem' }} aria-hidden="true">{etat.emoji}</span>
          <div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.35rem' }}>{etat.titre}</div>
            <div style={{ fontSize: '0.92rem', opacity: 0.9, lineHeight: 1.4 }}>{etat.sousTitre}</div>
          </div>
        </div>

        {/* Repères : retour à zéro + statut limite légale */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
          <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: 16, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: COL.texte2 }}>Retour à zéro</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.15rem', color: COL.texte }}>
              {bac <= 0 ? 'à sec 💧' : `dans ${formaterDuree(msRetourZero)}`}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: 16, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: COL.texte2 }}>Limite légale</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.15rem', color: COL.texte }}>
              {sousLimite ? `sous ${fmtBac(LIMITE_LEGALE)} ✓` : `dépassée · ${formaterDuree(msSousLimite)}`}
            </div>
          </div>
        </div>

        <button
          onClick={() => parlerTavernier(etat.annonce)}
          style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: etat.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '11px 16px', fontWeight: 700, fontSize: '0.92rem', minHeight: 48 }}
        >
          <IconeHautParleur size={20} color="#fff" />
          Le tavernier annonce la couleur
        </button>
      </section>

      {/* ── Nudge éphémère ── */}
      {nudge && (
        <div role="status" style={{ margin: '14px 16px 0', background: COL.panneau, color: COL.texte, border: `1px solid ${COL.or}`, borderRadius: 14, padding: '12px 16px', fontWeight: 600, fontSize: '0.92rem' }}>
          {nudge}
        </div>
      )}

      {/* ── Alerte permanente en zone chaude/danger ── */}
      {etat.cle !== 'sobre' && (
        <section style={{ margin: '16px 16px 0' }}>
          <div style={{ background: COL.panneau, border: `2px solid ${etat.accent}`, borderRadius: 18, padding: '14px 16px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: etat.accent, fontSize: '0.96rem' }}>
              {etat.cle === 'danger' ? '🚨 Là, c’est chaud. On se pose.' : '⚠️ Ça monte. On lève le pied.'}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: COL.texte2, lineHeight: 1.5 }}>
              Un verre d’eau, un coup de fil à un taxi, et surtout : pas le volant.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={() => montrerNudge('💧 Bien joué. L’eau, c’est la meilleure tournée de la soirée.')}
                style={{ flex: 1, minWidth: 130, minHeight: 52, border: `2px solid ${COL.or}`, background: '#14110F', color: COL.texte, borderRadius: 14, fontWeight: 700, fontSize: '0.9rem' }}>
                💧 Verre d’eau
              </button>
              <a href="tel:" onClick={(e) => { e.preventDefault(); montrerNudge('🚕 On rentre bien. Pense au taxi, au G7, ou à un pote sobre.'); }}
                style={{ flex: 1, minWidth: 130, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: COL.or, color: '#2A1F10', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                🚕 Appeler un taxi
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Logger : les classiques du comptoir ── */}
      <section style={{ margin: '22px 16px 0' }}>
        <h2 className="pmu-titre" style={{ margin: '0 0 12px 2px', fontSize: '1.25rem' }}>
          Ajoute ta tournée
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {PRESETS.map((p) => (
            <button
              key={p.type}
              onClick={() => { ajouter(p); capsule(); }}
              data-card="true"
              style={{
                minHeight: 104, border: `2px solid ${COL.bleu1}`, background: COL.panneau, borderRadius: 20,
                padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',
                color: COL.texte, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">{p.emoji}</span>
              <span>
                <span style={{ display: 'block', fontWeight: 700, fontSize: '1rem' }}>{p.label}</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: COL.texte2 }}>{p.volumeCl} cl · {p.degre}°</span>
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: COL.texte2, flex: 1, minWidth: 160 }}>
            <strong style={{ color: COL.texte }}>{consos.length}</strong> conso{consos.length > 1 ? 's' : ''} · {Math.round(totalGrammes)} g d’alcool
          </span>
          <button onClick={annulerDerniere} disabled={consos.length === 0}
            style={{ minHeight: 44, padding: '0 14px', borderRadius: 12, border: `2px solid ${COL.bleu1}`, background: COL.panneau, color: consos.length ? COL.texte : COL.gris, fontWeight: 700, fontSize: '0.85rem' }}>
            ↶ Annuler la dernière
          </button>
          <button onClick={viderSession} disabled={consos.length === 0}
            style={{ minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: consos.length ? COL.rouge : COL.gris, fontWeight: 700, fontSize: '0.85rem' }}>
            Vider l’ardoise
          </button>
        </div>

        {/* Mini-ardoise de la session */}
        {consos.length > 0 && (
          <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...consos].sort((a, b) => b.ts - a.ts).map((c) => (
              <li key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '10px 14px', boxShadow: CARD_SHADOW }}>
                <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{c.emoji}</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.92rem', color: COL.texte }}>{c.label}</span>
                <span style={{ fontSize: '0.82rem', color: COL.texte2 }}>
                  {new Date(c.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button onClick={() => retirer(c.id)} aria-label={`Retirer ${c.label}`}
                  style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: COL.sable, color: COL.rouge, fontWeight: 700, fontSize: '1.1rem' }}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Fiche perso (character sheet) ── */}
      <section style={{ margin: '26px 16px 0' }}>
        <h2 className="pmu-titre" style={{ margin: '0 0 12px 2px', fontSize: '1.25rem' }}>
          Ta fiche de pilier
        </h2>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 20, boxShadow: CARD_SHADOW, padding: 18 }}>
          {/* Sexe : sélecteur segmenté */}
          <div role="group" aria-label="Sexe biologique" style={{ display: 'flex', gap: 8, background: '#14110F', padding: 5, borderRadius: 14 }}>
            {SEXES.map((s) => {
              const actif = profil.sexe === s.cle;
              return (
                <button key={s.cle} onClick={() => setProfil({ sexe: s.cle })} aria-pressed={actif}
                  style={{ flex: 1, minHeight: 48, borderRadius: 11, border: 'none', fontWeight: 700, fontSize: '0.9rem', background: actif ? COL.or : 'transparent', color: actif ? '#2A1F10' : COL.texte2 }}>
                  {s.label}
                </button>
              );
            })}
          </div>

          <Curseur label="Poids" unite="kg" min={40} max={160} valeur={profil.poids} onChange={(v) => setProfil({ poids: v })} />
          <Curseur label="Taille" unite="cm" min={140} max={210} valeur={profil.taille} onChange={(v) => setProfil({ taille: v })} />
          <Curseur label="Âge" unite="ans" min={18} max={99} valeur={profil.age} onChange={(v) => setProfil({ age: v })} />
        </div>
      </section>

      {/* ── Avertissement légal (toujours visible) ── */}
      <section style={{ margin: '24px 16px 0' }}>
        <div style={{ background: COL.orangeClair, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '0.84rem', color: COL.texte2, lineHeight: 1.55 }}>
            <strong style={{ color: COL.or }}>⚠️ Estimation indicative, pour rigoler.</strong> Ce calcul (formule de Widmark)
            ne remplace <strong>jamais</strong> un éthylotest certifié. L’abus d’alcool est dangereux pour la santé.
            Ne prends <strong>jamais</strong> la route en te fiant à ce chiffre.
          </p>
        </div>
      </section>

      <footer style={{ margin: '24px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(14,58,77,0.1)' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2 }}>
          À consommer avec modération. Le perdant paie quand même sa tournée.
        </p>
      </footer>

      {/* ── Modale d'alerte (passage en zone danger) ── */}
      {modalDanger && (
        <div role="dialog" aria-modal="true" aria-label="Alerte alcoolémie"
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}
          onClick={() => setModalDanger(false)}>
          <div onClick={(e) => e.stopPropagation()} className="pa-danger"
            style={{ background: COL.panneau, borderRadius: 22, maxWidth: 380, width: '100%', padding: 24, border: `3px solid ${COL.rouge}` }}>
            <div style={{ fontSize: '2.4rem', textAlign: 'center' }} aria-hidden="true">🚨🥴</div>
            <h2 style={{ margin: '8px 0 0', textAlign: 'center', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.rouge }}>
              Danger : zone patois
            </h2>
            <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '0.98rem', color: COL.texte, lineHeight: 1.5 }}>
              Risque élevé d’envoyer un <strong>SMS à ton ex</strong>. Pose le téléphone,
              bois un grand verre d’eau — et surtout, <strong>ne prends pas la route</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <button onClick={() => { setModalDanger(false); montrerNudge('💧 Sage décision. Santé… à l’eau !'); }}
                style={{ minHeight: 56, border: 'none', borderRadius: 14, background: COL.or, color: '#2A1F10', fontWeight: 700, fontSize: '1rem' }}>
                💧 Je commande un verre d’eau
              </button>
              <button onClick={() => setModalDanger(false)}
                style={{ minHeight: 48, border: `2px solid ${COL.bleu1}`, borderRadius: 14, background: '#14110F', color: COL.texte2, fontWeight: 700, fontSize: '0.9rem' }}>
                J’ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

// Curseur « tirette de bière » avec valeur affichée.
function Curseur({ label, unite, min, max, valeur, onChange }: {
  label: string; unite: string; min: number; max: number; valeur: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <label style={{ fontWeight: 700, fontSize: '0.95rem', color: COL.texte }}>{label}</label>
        <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.15rem', color: COL.or }}>
          {valeur} <span style={{ fontSize: '0.85rem', color: COL.texte2, fontFamily: 'inherit' }}>{unite}</span>
        </span>
      </div>
      <input className="pa-slider" type="range" min={min} max={max} value={valeur}
        onChange={(e) => onChange(Number(e.target.value))} aria-label={`${label} en ${unite}`} />
    </div>
  );
}
