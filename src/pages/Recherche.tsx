import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES, SEC, CARD_SHADOW_SM, type SectionKey } from '../ui/theme';
import CONTENT from '../content';
import type { Fiche } from '../content/types';

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

interface FicheIdx extends Fiche {
  section: SectionKey;
  texte: string;
}

function ficheText(f: Fiche & { desc?: string; mode?: string; sous?: string }): string {
  let t = `${f.titre}. ${f.accroche || ''} ${f.desc || ''} ${f.mode || ''} ${f.sous || ''}`;
  (f.blocs || []).forEach((b) => {
    if ('x' in b && b.x) t += ' ' + b.x;
    if ('label' in b && b.label) t += ' ' + b.label;
    if ('items' in b && b.items) t += ' ' + b.items.join(' ');
  });
  return t;
}

function indexer(): FicheIdx[] {
  const outilsFiches: FicheIdx[] = CONTENT.outils.map((o) => ({
    id: o.id, slug: o.slug, titre: o.titre, accroche: o.sous,
    section: 'outils' as const,
    texte: `${o.titre}. ${o.sous} ${o.desc} ${o.mode}`,
  }));
  return [
    ...CONTENT.conseils.map((f) => ({ ...f, section: 'conseils' as const, texte: ficheText(f) })),
    ...outilsFiches,
    ...CONTENT.comprendre.map((f) => ({ ...f, section: 'comprendre' as const, texte: ficheText(f) })),
    ...CONTENT.aides.map((f) => ({ ...f, section: 'aides' as const, texte: ficheText(f) })),
  ];
}

const INDEX = indexer();

function pathFor(f: FicheIdx): string {
  if (f.section === 'outils') return `/outils/${f.slug}`;
  if (f.special === 'definitions') return '/comprendre/definitions';
  if (f.special === 'stereotypes') return '/comprendre/stereotypes';
  return `/${f.section}/${f.slug}`;
}

interface Resultat {
  titre: string;
  secLabel: string;
  color: string;
  extrait: string;
  path: string;
  state?: unknown;
}

export default function Recherche() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const nq = norm(q);
  const results: Resultat[] = [];
  if (nq.length >= 2) {
    INDEX.forEach((f) => {
      const ni = norm(f.texte).indexOf(nq);
      if (ni >= 0 || norm(f.titre).includes(nq)) {
        const start = Math.max(0, ni - 30);
        results.push({
          titre: f.titre,
          secLabel: SEC[f.section].label,
          color: SEC[f.section].color,
          extrait: ni >= 0 ? '…' + f.texte.slice(start, start + 90).trim() + '…' : f.accroche || '',
          path: pathFor(f),
        });
      }
    });
    CONTENT.definitions.forEach((d) => {
      if (norm(`${d.terme} ${d.def}`).includes(nq)) {
        results.push({
          titre: d.terme,
          secLabel: 'Définition',
          color: COL.bleu9,
          extrait: d.def,
          path: '/comprendre/definitions',
          state: { ouvrir: d.terme },
        });
      }
    });
  }
  const affiches = results.slice(0, 12);
  const vide = affiches.length === 0;

  const secBtn = (bg: string, c: string): React.CSSProperties => ({
    border: 'none', borderRadius: 16, background: bg, color: c,
    padding: 14, fontWeight: 600, fontSize: '0.89rem', minHeight: 56,
  });

  return (
    <AppShell>
      <div style={{ padding: '18px 16px 0 16px' }}>
        <h1 style={{ margin: '0 0 12px 4px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', color: COL.bleu9 }}>
          Recherche
        </h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Ex. douleur, carte, orthophoniste…"
          aria-label="Rechercher dans l'application"
          style={{
            width: '100%', border: `2px solid ${COL.bleu7}`, borderRadius: 16,
            padding: '14px 18px', fontSize: '1rem', background: '#fff', color: COL.texte,
            minHeight: 60, outlineColor: COL.bleu5,
          }}
        />

        {vide && (
          <div style={{ margin: '24px 0 0 0' }}>
            <p style={{ margin: '0 0 12px 4px', color: COL.texte2, fontSize: '0.95rem' }}>
              {nq.length >= 2 ? 'Aucun résultat. Explorez les sections :' : 'Que cherchez-vous ? Vous pouvez aussi explorer les sections :'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => navigate('/conseils')} style={secBtn(COL.orangeClair, COL.orangeFonce)}>Conseils</button>
              <button onClick={() => navigate('/outils')} style={secBtn(COL.bleu1, COL.bleu5)}>Outils</button>
              <button onClick={() => navigate('/comprendre')} style={secBtn(COL.bleu1, COL.bleu9)}>Mieux comprendre</button>
              <button onClick={() => navigate('/aides')} style={secBtn(COL.bleu1, COL.bleu7)}>Aides et contacts</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '18px 0 0 0' }}>
          {affiches.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate(r.path, r.state ? { state: r.state } : undefined)}
              data-card="true"
              style={{
                display: 'flex', width: '100%', alignItems: 'flex-start', gap: 12,
                border: 'none', background: '#fff', borderRadius: 16,
                boxShadow: CARD_SHADOW_SM, padding: '14px 18px', textAlign: 'left', minHeight: 64,
              }}
            >
              <span style={{ width: 10, height: 40, borderRadius: 5, background: r.color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: r.color }}>
                  {r.secLabel}
                </span>
                <span style={{ display: 'block', fontWeight: 600, color: COL.bleu9, marginTop: 2 }}>{r.titre}</span>
                <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 2, lineHeight: 1.45 }}>
                  {r.extrait}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
