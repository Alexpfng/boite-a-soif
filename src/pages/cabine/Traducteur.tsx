import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Traducteur Régional (version musclée) ────────────────────────────────
// Passe ta phrase à la moulinette d'un accent du terroir : dictionnaire de mots,
// transformations de sons, interjection en tête et chute typique en fin.
// Parodie d'accent 100 % affectueuse — on aime trop nos régions pour s'en moquer.

interface Region {
  cle: string;
  nom: string;
  emoji: string;
  mots: [string, string][]; // remplacements mot-à-mot (limites de mot, insensible casse)
  sons: [RegExp, string][]; // transformations de sons
  prefixe: string[]; // interjection éventuelle en tête ('' = aucune)
  fin: string[]; // chute en fin de phrase
  finQuestion: string[]; // chute si c'est une question
}

const REGIONS: Region[] = [
  {
    cle: 'marseillais', nom: 'Marseillais', emoji: '☀️',
    mots: [
      ['oui', 'oui bé'], ['non', 'que dalle'], ['voiture', 'caisse'], ['travail', 'boulot'],
      ['fatigué', 'escagassé'], ['fatiguée', 'escagassée'], ['ami', 'collègue'], ['amis', 'collègues'],
      ['enfant', 'minot'], ['enfants', 'minots'], ['fou', 'fada'], ['bête', 'couillon'],
      ['bêtise', 'couillonnade'], ['génial', 'dégun pareil'], ['beaucoup', 'un cagnard de'],
      ['très', 'vé très'], ['rien', 'que dalle'], ['nul', 'à la ramasse'],
    ],
    sons: [],
    prefixe: ['', 'Bé', 'Hé', 'Vé', 'Oh'],
    fin: [', peuchère.', ', bonne mère !', ', con !', ', hé bé.'],
    finQuestion: [', con ?', ', hé bé ?', ', ou quoi ?'],
  },
  {
    cle: 'chti', nom: 'Ch’ti', emoji: '⛏️',
    mots: [
      ['c’est', 'ch’est'], ["c'est", "ch'est"], ['moi', 'mi'], ['toi', 'ti'], ['lui', 'li'],
      ['ici', 'ichi'], ['petit', 'tiot'], ['petite', 'tiote'], ['garçon', 'biloute'],
      ['content', 'binaise'], ['bien', 'fin bien'], ['beaucoup', 'plein'], ['fête', 'ducasse'],
      ['serpillière', 'wassingue'], ['oui', 'oui hein'], ['chéri', 'min tiot'],
    ],
    sons: [[/\bça\b/gi, 'cha'], [/\bce\b/gi, 'che']],
    prefixe: ['', 'Hein', 'Biloute', 'Eh ben'],
    fin: [', hein biloute !', ', min tiot.', ', à l’ducasse !'],
    finQuestion: [', hein ?', ', dis ti ?'],
  },
  {
    cle: 'belge', nom: 'Belge', emoji: '🍟',
    mots: [
      ['soixante-dix', 'septante'], ['quatre-vingt-dix', 'nonante'], ['serpillière', 'loque'],
      ['torchon', 'loque à reloqueter'], ['sac', 'sachet'], ['copain', 'poteu'],
      ['déjeuner', 'déjeuner (le p’tit)'], ['génial', 'super peï'], ['oui', 'non peut-être'],
      ['beaucoup', 'un fameux paquet'], ['bien', 'fameux'], ['voiture', 'auto'],
    ],
    sons: [],
    prefixe: ['', 'Allez', 'Dis', 'Hé'],
    fin: [', une fois.', ', non peut-être !', ', allez.'],
    finQuestion: [', sais-tu ?', ', non peut-être ?'],
  },
  {
    cle: 'toulousain', nom: 'Toulousain', emoji: '🏉',
    mots: [
      ['oui', 'oc'], ['petit', 'pitchoun'], ['petite', 'pitchoune'], ['fatigué', 'cané'],
      ['fatiguée', 'canée'], ['idiot', 'cascamèl'], ['beaucoup', 'un molon de'],
      ['colle', 'pègue'], ['pain au chocolat', 'chocolatine'], ['sac', 'poche'],
      ['regarde', 'vise un peu'], ['génial', 'que bèl'], ['très', 'de chez très'], ['bazar', 'cabourne'],
    ],
    sons: [],
    prefixe: ['', 'Boudu', 'Té', 'Adieu'],
    fin: [', boudu !', ', cong.', ', té.', ', boudu cong !'],
    finQuestion: [', qu’es aquò ?', ', cong ?'],
  },
  {
    cle: 'breton', nom: 'Breton', emoji: '🦀',
    mots: [
      ['oui', 'ya'], ['non', 'nann'], ['santé', 'yec’hed mat'], ['bon', 'mat'],
      ['beaucoup', 'un paquet de'], ['crêpe', 'crampouezh'], ['ami', 'mignon'], ['amis', 'mignoned'],
      ['génial', 'du-mat'], ['bizarre', 'drol'], ['pluie', 'crachin'], ['cidre', 'chistr'],
    ],
    sons: [],
    prefixe: ['', 'Dame', 'Hañ', 'Allez'],
    fin: [', dame !', ', hañ.', ', yec’hed mat !'],
    finQuestion: [', hañ ?', ', dame ?'],
  },
];

const pioche = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const minusc = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

function traduire(phrase: string, r: Region): string {
  let p = phrase.trim();
  for (const [src, cib] of r.mots) {
    p = p.replace(new RegExp(`\\b${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), cib);
  }
  for (const [re, rep] of r.sons) p = p.replace(re, rep);

  const interro = /\?\s*$/.test(p);
  p = p.replace(/\s*[.!?]+\s*$/, '');

  const pref = pioche(r.prefixe);
  const corps = pref ? `${cap(pref)}, ${minusc(p)}` : cap(p);
  return corps + pioche(interro ? r.finQuestion : r.fin);
}

export function Traducteur({ onRetour }: { onRetour: () => void }) {
  const [phrase, setPhrase] = useState('');
  const [region, setRegion] = useState<Region>(REGIONS[0]);
  const [resultat, setResultat] = useState<string | null>(null);

  function lancer() {
    const source = phrase.trim();
    if (!source) return;
    const trad = traduire(source, region);
    setResultat(trad);
    parlerTavernier(trad);
  }

  return (
    <>
      <Entete titre="Le Traducteur Régional" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 14px', lineHeight: 1.5 }}>
          Écris ta phrase, choisis ta région, et écoute le comptoir te la rejouer avec l’accent. Pour rire, et avec affection.
        </p>

        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Ex. : « Mon ami, c’est génial, j’ai bu beaucoup ! »"
          rows={3}
          style={{ width: '100%', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.creme, padding: '12px 14px', fontSize: '1rem', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' }}
        />

        {/* Sélecteur de région (grille pour tenir les 5) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
          {REGIONS.map((r) => {
            const actif = r.cle === region.cle;
            return (
              <button key={r.cle} onClick={() => setRegion(r)}
                style={{ minHeight: 52, borderRadius: 12, border: `2px solid ${actif ? COL.or : COL.bleu1}`, background: actif ? COL.or : COL.panneau, color: actif ? '#2A1F10' : COL.texte2, fontWeight: 800, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '1.1rem' }} aria-hidden="true">{r.emoji}</span>
                {r.nom}
              </button>
            );
          })}
        </div>

        <button onClick={lancer} className="pmu-arcade" style={{ width: '100%', marginTop: 14, minHeight: 60 }}>
          🗣️ Traduire
        </button>

        {resultat && (
          <div className="pmu-ardoise" style={{ marginTop: 18 }}>
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Version {region.nom} {region.emoji}
            </div>
            <p className="craie" style={{ margin: '10px 0 0', fontFamily: FRAUNCES, fontSize: '1.3rem', lineHeight: 1.4 }}>
              « {resultat} »
            </p>
          </div>
        )}

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Parodie d’accent, rien de méchant. Astuce : mets des mots comme « oui », « voiture », « ami », « génial », « beaucoup »… pour voir la magie.
        </p>
      </section>
    </>
  );
}
