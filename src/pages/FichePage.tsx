import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useFavoris } from '../features/favoris/useFavorites';
import { useToast } from '../components/ui/Toast';
import { useSpeech } from '../features/tts/useSpeech';
import { ChevronDroit, COEUR_PATH, IconeHautParleur, IconeTelephone, IconeLienExterne } from '../ui/icons';
import { COL, FRAUNCES, SEC, type SectionKey } from '../ui/theme';
import CONTENT from '../content';
import type { Bloc, Fiche } from '../content/types';

function ficheText(f: Fiche): string {
  let t = `${f.titre}. ${f.accroche || ''}`;
  (f.blocs || []).forEach((b) => {
    if ('x' in b && b.x) t += ' ' + b.x;
    if ('label' in b && b.label) t += ' ' + b.label;
    if ('items' in b && b.items) t += ' ' + b.items.join(' ');
  });
  return t;
}

function BadgeAValider() {
  return (
    <span
      style={{
        display: 'inline-block', margin: '6px 0 0 0',
        background: COL.orangeClair, color: COL.orangeFonce,
        borderRadius: 999, padding: '1px 10px', fontSize: '0.72rem', fontWeight: 600,
      }}
    >
      À valider par Clara
    </span>
  );
}

function BlocView({ b, secColor }: { b: Bloc; secColor: string }) {
  const navigate = useNavigate();

  return (
    <div>
      {b.t === 'h2' && (
        <h2 style={{ margin: '26px 0 4px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.17rem', color: secColor, lineHeight: 1.3 }}>
          {b.x}
        </h2>
      )}
      {b.t === 'p' && <p style={{ margin: '12px 0 0 0' }}>{b.x}</p>}
      {b.t === 'list' && (
        <ul style={{ margin: '10px 0 0 0' }}>
          {b.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      )}
      {b.t === 'enc' && (
        <div style={{ margin: '16px 0 0 0', background: COL.orangeClair, borderRadius: 16, padding: '16px 18px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {b.x}
        </div>
      )}
      {b.t === 'urgence' && (
        <a
          href={`tel:${b.num}`}
          data-tone="orange"
          style={{ display: 'block', margin: '16px 0 0 0', background: COL.orange, color: '#fff', borderRadius: 20, padding: '18px 20px', textDecoration: 'none' }}
        >
          <span style={{ display: 'block', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>{b.num}</span>
          <span style={{ display: 'block', fontSize: '0.89rem', marginTop: 4, lineHeight: 1.5 }}>{b.x}</span>
        </a>
      )}
      {b.t === 'tel' && (
        <a
          href={`tel:${b.num}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, margin: '12px 0 0 0',
            background: '#fff', border: `2px solid ${COL.bleu1}`, borderRadius: 16,
            padding: '13px 16px', textDecoration: 'none', color: COL.texte, minHeight: 64,
          }}
        >
          <IconeTelephone />
          <span>
            <span style={{ display: 'block', fontWeight: 600, color: COL.bleu7 }}>{b.label}</span>
            <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2 }}>{b.x}</span>
          </span>
        </a>
      )}
      {b.t === 'web' && (
        <a
          href={b.url}
          target="_blank"
          rel="noopener"
          style={{
            display: 'flex', alignItems: 'center', gap: 14, margin: '12px 0 0 0',
            background: '#fff', border: `2px solid ${COL.bleu1}`, borderRadius: 16,
            padding: '13px 16px', textDecoration: 'none', color: COL.texte, minHeight: 64,
          }}
        >
          <IconeLienExterne />
          <span>
            <span style={{ display: 'block', fontWeight: 600, color: COL.bleu7, textDecoration: 'underline' }}>{b.label}</span>
            <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2 }}>{b.x}</span>
          </span>
        </a>
      )}
      {b.t === 'lien' && (
        <button
          onClick={() => navigate(`/outils/${b.outil}/outil`)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 0 0',
            border: 'none', borderRadius: 999, background: COL.bleu5, color: '#fff',
            padding: '12px 20px', fontSize: '0.89rem', fontWeight: 600, minHeight: 48,
          }}
        >
          {b.x}
          <ChevronDroit size={18} color="currentColor" />
        </button>
      )}
      {'aValider' in b && b.aValider && <BadgeAValider />}
    </div>
  );
}

export default function FichePage({ section }: { section: SectionKey }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { estFavori, basculer } = useFavoris();
  const { annoncer } = useToast();
  const { etat, lire, stop } = useSpeech();
  const meta = SEC[section];

  const list: Fiche[] =
    section === 'conseils' ? CONTENT.conseils : section === 'comprendre' ? CONTENT.comprendre : CONTENT.aides;
  const i = list.findIndex((f) => f.slug === slug);
  const fiche = list[i] ?? list[0];
  const fav = estFavori(fiche.id);
  const speaking = etat === 'lecture';

  function toggleFav() {
    basculer(fiche.id, section);
    annoncer(fav ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }

  function goFiche(f: Fiche) {
    if (f.special === 'definitions') navigate('/comprendre/definitions');
    else if (f.special === 'stereotypes') navigate('/comprendre/stereotypes');
    else navigate(`/${section}/${f.slug}`);
  }

  const hasPrev = i > 0;
  const hasNext = i >= 0 && i < list.length - 1;

  return (
    <AppShell>
      <Hero color={meta.color}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          {meta.label}
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.25 }}>
          {fiche.titre}
        </h1>
        {fiche.aValider && (
          <span
            style={{
              display: 'inline-block', margin: '10px 0 0 0',
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: 999, padding: '2px 12px', fontSize: '0.72rem', fontWeight: 600,
            }}
          >
            Contenu à valider par Clara
          </span>
        )}
        <div style={{ display: 'flex', gap: 10, margin: '16px 0 0 0' }}>
          <button
            onClick={() => (speaking ? stop() : lire([ficheText(fiche)]))}
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
        {(fiche.blocs ?? []).map((b, j) => (
          <BlocView key={j} b={b} secColor={meta.color} />
        ))}

        {(hasPrev || hasNext) && (
          <div style={{ display: 'flex', gap: 10, margin: '34px 0 0 0' }}>
            {hasPrev && (
              <button
                onClick={() => goFiche(list[i - 1])}
                style={{
                  flex: 1, border: `2px solid ${COL.bleu1}`, background: '#fff', borderRadius: 16,
                  padding: '12px 14px', textAlign: 'left', color: COL.bleu7,
                  fontSize: '0.84rem', fontWeight: 600, minHeight: 56,
                }}
              >
                ← {list[i - 1].titre}
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => goFiche(list[i + 1])}
                style={{
                  flex: 1, border: `2px solid ${COL.bleu1}`, background: '#fff', borderRadius: 16,
                  padding: '12px 14px', textAlign: 'right', color: COL.bleu7,
                  fontSize: '0.84rem', fontWeight: 600, minHeight: 56,
                }}
              >
                {list[i + 1].titre} →
              </button>
            )}
          </div>
        )}
      </article>
    </AppShell>
  );
}
