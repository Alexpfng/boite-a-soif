import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useToast } from '../components/ui/Toast';
import { lireStockage, ecrireStockage } from '../lib/storage';
import { CourbeHistorique } from '../components/ui/CourbeHistorique';
import { COL, FRAUNCES, CARD_SHADOW, CARD_SHADOW_SM } from '../ui/theme';

// Journal de l'aidant : « Et vous, comment allez-vous ? »
// Un check-in simple pour suivre sa propre forme et repérer l'épuisement.
// Si plusieurs ressentis bas se suivent, un encart oriente vers du soutien.

interface EntreeAidant {
  date: string;   // YYYY-MM-DD
  valeur: number; // 1 (épuisé·e) → 5 (en forme)
  note?: string;
}

const NIVEAUX: { valeur: number; label: string; couleur: string }[] = [
  { valeur: 5, label: 'En forme', couleur: '#2E8540' },
  { valeur: 4, label: 'Ça va', couleur: '#7BAE3E' },
  { valeur: 3, label: 'Moyen', couleur: '#E0A52A' },
  { valeur: 2, label: 'Fatigué·e', couleur: '#E0662A' },
  { valeur: 1, label: 'Épuisé·e', couleur: '#C0392B' },
];

const CLE = 'journal-aidant';
const MAX = 90;

export default function JournalAidant() {
  const [journal, setJournal] = useState<EntreeAidant[]>(() => lireStockage<EntreeAidant[]>(CLE, []));
  const [note, setNote] = useState('');
  const [sel, setSel] = useState<number | null>(null);
  const { annoncer } = useToast();
  const navigate = useNavigate();

  const aujourd = new Date().toISOString().slice(0, 10);
  const dejaFait = journal.some((e) => e.date === aujourd);

  function enregistrer() {
    if (sel === null) {
      annoncer('Choisissez d’abord comment vous allez');
      return;
    }
    const entree: EntreeAidant = { date: aujourd, valeur: sel, note: note.trim() || undefined };
    // Une entrée par jour : remplace celle du jour si elle existe
    const suivant = [...journal.filter((e) => e.date !== aujourd), entree]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-MAX);
    setJournal(suivant);
    ecrireStockage(CLE, suivant);
    setSel(null);
    setNote('');
    annoncer('Merci. Prenez soin de vous aussi.');
  }

  // Signal d'alerte : 3 derniers ressentis ≤ 2 (fatigué/épuisé)
  const derniers = journal.slice(-3);
  const alerte = derniers.length === 3 && derniers.every((e) => e.valeur <= 2);

  const recentes = [...journal].reverse().slice(0, 7);

  return (
    <AppShell>
      <Hero color={COL.bleu5}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          Pour vous, l&apos;aidant
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.25 }}>
          Et vous, comment allez-vous ?
        </h1>
      </Hero>

      <div style={{ padding: '6px 22px 0 22px', maxWidth: '70ch' }}>
        <p style={{ margin: '18px 0 0 0' }}>
          Accompagner demande beaucoup d&apos;énergie. Prendre 10 secondes pour noter votre forme
          aide à repérer l&apos;épuisement avant qu&apos;il ne s&apos;installe.
        </p>

        {alerte && (
          <div role="status" style={{ margin: '18px 0 0 0', background: '#FBEAE7', border: `2px solid #F2C7BF`, borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: COL.rouge }}>Vos derniers ressentis sont bas.</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: COL.texte }}>
              Vous comptez aussi. Parlez-en à votre médecin, et pensez aux solutions de répit et aux
              associations qui soutiennent les aidants.
            </p>
            <button
              onClick={() => navigate('/aides')}
              style={{
                margin: '12px 0 0 0', border: 'none', borderRadius: 12, background: COL.bleu7,
                color: '#fff', padding: '10px 18px', fontWeight: 600, fontSize: '0.92rem', minHeight: 48,
              }}
            >
              Voir les aides et contacts
            </button>
          </div>
        )}

        {/* Check-in du jour */}
        <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 20, margin: '20px 0 0 0' }}>
          <h2 style={{ margin: '0 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
            Aujourd&apos;hui, je me sens…
          </h2>
          {dejaFait && (
            <p style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: COL.texte2 }}>
              Déjà noté aujourd&apos;hui — vous pouvez corriger si besoin.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0 0 0' }}>
            {NIVEAUX.map((n) => {
              const actif = sel === n.valeur;
              return (
                <button
                  key={n.valeur}
                  onClick={() => setSel(n.valeur)}
                  aria-pressed={actif}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    border: actif ? `3px solid ${n.couleur}` : `3px solid ${COL.bleu1}`,
                    borderRadius: 16, background: '#fff', padding: '12px 16px',
                    fontSize: '1.05rem', fontWeight: 600, color: COL.texte, minHeight: 60,
                    transform: actif ? 'scale(1.02)' : 'scale(1)', transition: 'transform .12s ease',
                  }}
                >
                  <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: n.couleur, flexShrink: 0 }} />
                  {n.label}
                </button>
              );
            })}
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Une note pour vous (facultatif)"
            aria-label="Note facultative"
            style={{
              width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
              padding: '11px 14px', fontSize: '1rem', margin: '12px 0 0 0',
              minHeight: 52, background: '#fff', color: COL.texte,
            }}
          />
          <button
            onClick={enregistrer}
            style={{
              display: 'block', width: '100%', margin: '14px 0 0 0',
              border: 'none', borderRadius: 14, background: COL.bleu7, color: '#fff',
              padding: 14, fontSize: '1rem', fontWeight: 700, minHeight: 56,
            }}
          >
            Enregistrer
          </button>
        </div>

        {/* Évolution */}
        {journal.length >= 2 && (
          <section aria-label="Évolution" style={{ margin: '24px 0 0 0' }}>
            <h2 style={{ margin: '0 0 10px 2px', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
              Votre forme, ces derniers temps
            </h2>
            <div data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, padding: '14px 16px 8px 16px' }}>
              <CourbeHistorique
                ariaLabel="Courbe d'évolution de votre forme"
                points={journal.map((e) => ({
                  date: e.date,
                  valeur: e.valeur,
                  couleur: NIVEAUX.find((n) => n.valeur === e.valeur)?.couleur,
                }))}
              />
            </div>
          </section>
        )}

        {/* Dernières entrées */}
        {recentes.length > 0 && (
          <section aria-label="Dernières entrées" style={{ margin: '20px 0 0 0' }}>
            <div data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, padding: '8px 18px' }}>
              {recentes.map((e, i) => {
                const niveau = NIVEAUX.find((n) => n.valeur === e.valeur);
                return (
                  <div key={e.date} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < recentes.length - 1 ? `1px solid ${COL.bleu1}` : 'none' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: niveau?.couleur, flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: COL.texte, fontSize: '0.95rem' }}>
                        {niveau?.label}
                        <span style={{ fontWeight: 400, color: COL.texte2, fontSize: '0.8rem' }}>
                          {' '}— {new Date(e.date + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                      </p>
                      {e.note && <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: COL.texte2 }}>{e.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <p style={{ margin: '20px 0 0 0', fontSize: '0.84rem', color: COL.texte2 }}>
          Ce journal est pour vous : il n&apos;est visible que depuis votre compte.
        </p>
      </div>
    </AppShell>
  );
}
