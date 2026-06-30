import { useState } from 'react';
import { Entete } from './Cadre';
import { COL, FRAUNCES } from '../../ui/theme';
import { parlerTavernier } from '../../features/audio/sons';

// ── Le Traducteur Régional ──────────────────────────────────────────────────
// Passe ta phrase à la moulinette d'un accent du terroir. Parodie bon enfant :
// on s'amuse des tournures régionales, jamais on ne se moque des gens.

type Region = 'marseillais' | 'chti' | 'belge';

const REGIONS: { cle: Region; nom: string }[] = [
  { cle: 'marseillais', nom: 'Marseillais' },
  { cle: 'chti', nom: 'Ch’ti' },
  { cle: 'belge', nom: 'Belge' },
];

// Remplace un mot entier (insensible à la casse) en gardant l'espace alentour.
function remplacerMot(phrase: string, source: string, cible: string): string {
  const motif = new RegExp(`\\b${source}\\b`, 'gi');
  return phrase.replace(motif, cible);
}

// Accent du Sud : on traîne, on appuie, et on finit par une petite ponctuation.
function versMarseillais(phrase: string): string {
  let p = phrase;
  p = remplacerMot(p, 'oui', 'oui bien sûr');
  p = remplacerMot(p, 'beaucoup', 'au moins dix fois');
  p = remplacerMot(p, 'vraiment', 'pour de vrai');
  p = remplacerMot(p, 'voiture', 'caisse');
  // On glisse un « hein » avant le premier point, histoire d'appuyer.
  p = p.replace(/([.!?])/, ', hein$1');
  const fin = p.trim().endsWith('?') ? ', con ?' : ', peuchère.';
  return `${p.trim().replace(/[.!?]+$/, '')}${fin}`;
}

// Accent du Nord : on chante les sons et on termine sur un « biloute » affectueux.
function versChti(phrase: string): string {
  let p = phrase;
  p = remplacerMot(p, 'c’est', 'ch’est');
  p = remplacerMot(p, "c'est", "ch'est");
  p = remplacerMot(p, 'moi', 'mi');
  p = remplacerMot(p, 'toi', 'ti');
  p = remplacerMot(p, 'ici', 'ichi');
  p = p.replace(/ça/gi, 'cha');
  p = p.replace(/[.!?]+$/, '');
  return `${p.trim()}, hein biloute !`;
}

// Accent belge : « une fois », « sais-tu », et le célèbre « septante ».
function versBelge(phrase: string): string {
  let p = phrase;
  p = remplacerMot(p, 'soixante-dix', 'septante');
  p = remplacerMot(p, 'quatre-vingt-dix', 'nonante');
  p = remplacerMot(p, 'serpillière', 'loque à reloqueter');
  p = remplacerMot(p, 'sac', 'sachet');
  p = p.replace(/[.!?]+$/, '');
  const fin = phrase.trim().endsWith('?') ? ', sais-tu ?' : ', une fois.';
  return `${p.trim()}${fin}`;
}

function traduire(phrase: string, region: Region): string {
  switch (region) {
    case 'marseillais':
      return versMarseillais(phrase);
    case 'chti':
      return versChti(phrase);
    case 'belge':
      return versBelge(phrase);
  }
}

export function Traducteur({ onRetour }: { onRetour: () => void }) {
  const [phrase, setPhrase] = useState('');
  const [region, setRegion] = useState<Region>('marseillais');
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
          Écris ta phrase, choisis ta région, et écoute le comptoir te la rejouer
          avec l’accent. C’est pour rire, et avec affection.
        </p>

        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Écris ta phrase ici…"
          rows={3}
          style={{
            width: '100%',
            background: '#14110F',
            border: `2px solid ${COL.bleu1}`,
            borderRadius: 12,
            color: COL.creme,
            padding: '12px 14px',
            fontSize: '1rem',
            lineHeight: 1.5,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />

        {/* Sélecteur segmenté de région : l'actif passe en or. */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {REGIONS.map((r) => {
            const actif = r.cle === region;
            return (
              <button
                key={r.cle}
                onClick={() => setRegion(r.cle)}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 12,
                  border: `2px solid ${actif ? COL.or : COL.bleu1}`,
                  background: actif ? COL.or : COL.panneau,
                  color: actif ? '#2A1F10' : COL.texte2,
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
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
              Version {REGIONS.find((r) => r.cle === region)?.nom}
            </div>
            <p className="craie" style={{ margin: '10px 0 0', fontFamily: FRAUNCES, fontSize: '1.3rem', lineHeight: 1.4 }}>
              « {resultat} »
            </p>
          </div>
        )}

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Parodie d’accent, rien de méchant : on aime trop nos régions pour ça.
        </p>
      </section>
    </>
  );
}
