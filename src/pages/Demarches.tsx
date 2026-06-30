import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useToast } from '../components/ui/Toast';
import { lireStockage, ecrireStockage } from '../lib/storage';
import { COL, FRAUNCES, CARD_SHADOW_SM } from '../ui/theme';

// Checklist guidée des démarches administratives après une aphasie.
// L'état coché est enregistré dans l'espace personnel (synchronisé).
// Contenu informatif général : à adapter à chaque situation (aValider).

interface Demarche {
  id: string;
  titre: string;
  detail: string;
  aupres: string; // auprès de qui / où
}

const DEMARCHES: Demarche[] = [
  {
    id: 'ald',
    titre: 'Demander l’ALD (Affection Longue Durée)',
    detail: 'Prise en charge à 100 % des soins liés à l’AVC / l’aphasie. C’est le médecin traitant qui fait la demande.',
    aupres: 'Médecin traitant → Assurance Maladie',
  },
  {
    id: 'ordonnance-ortho',
    titre: 'Obtenir la prescription d’orthophonie',
    detail: 'La rééducation orthophonique est prescrite par un médecin, puis remboursée. Demandez une « rééducation du langage ».',
    aupres: 'Médecin traitant ou neurologue',
  },
  {
    id: 'mdph',
    titre: 'Déposer un dossier MDPH',
    detail: 'Ouvre des droits selon la situation : carte mobilité inclusion, PCH (aide humaine ou technique), RQTH si reprise du travail.',
    aupres: 'MDPH de votre département',
  },
  {
    id: 'cmi',
    titre: 'Demander la Carte Mobilité Inclusion (CMI)',
    detail: 'Priorité dans les files d’attente, places assises, stationnement selon la mention. Se demande via le dossier MDPH (ou l’APA après 60 ans).',
    aupres: 'MDPH ou conseil départemental',
  },
  {
    id: 'apa',
    titre: 'Demander l’APA (si 60 ans ou plus)',
    detail: 'Allocation Personnalisée d’Autonomie : finance de l’aide à domicile, de l’accueil de jour, du matériel.',
    aupres: 'Conseil départemental / mairie (CCAS)',
  },
  {
    id: 'mutuelle',
    titre: 'Prévenir mutuelle et assurances',
    detail: 'Certains contrats (prévoyance, assurance emprunteur) couvrent l’invalidité. Vérifiez aussi les contrats de la personne aidée.',
    aupres: 'Mutuelle, banque, assureur',
  },
  {
    id: 'tutelle',
    titre: 'Protéger juridiquement si nécessaire',
    detail: 'Si votre proche ne peut plus gérer seul ses affaires : habilitation familiale, curatelle ou tutelle, selon les besoins.',
    aupres: 'Juge des contentieux de la protection (tribunal)',
  },
  {
    id: 'association',
    titre: 'Contacter une association de patients',
    detail: 'Groupes de parole, conseils pratiques, entraide entre familles. Voir la page « Associations » de l’application.',
    aupres: 'Voir Aides et contacts → Associations',
  },
  {
    id: 'repit',
    titre: 'Se renseigner sur le droit au répit',
    detail: 'Accueil de jour, hébergement temporaire, relais à domicile : des solutions existent pour souffler. L’APA peut les financer en partie.',
    aupres: 'Conseil départemental, plateformes de répit',
  },
];

const CLE = 'demarches';

export default function Demarches() {
  const [faites, setFaites] = useState<string[]>(() => lireStockage<string[]>(CLE, []));
  const { annoncer } = useToast();

  function basculer(id: string) {
    const suivant = faites.includes(id) ? faites.filter((x) => x !== id) : [...faites, id];
    setFaites(suivant);
    ecrireStockage(CLE, suivant);
    if (!faites.includes(id)) annoncer('Démarche cochée. Bravo !');
  }

  const nb = DEMARCHES.filter((d) => faites.includes(d.id)).length;
  const pct = Math.round((nb / DEMARCHES.length) * 100);

  return (
    <AppShell>
      <Hero color={COL.bleu7}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
          Aides et contacts
        </p>
        <h1 style={{ margin: '6px 0 0 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.25 }}>
          Mes démarches, étape par étape
        </h1>
      </Hero>

      <div style={{ padding: '6px 22px 0 22px', maxWidth: '70ch' }}>
        <p style={{ margin: '18px 0 0 0' }}>
          Les démarches utiles après une aphasie, rassemblées en une liste à cocher.
          Avancez à votre rythme : votre progression est enregistrée.
        </p>

        {/* Barre de progression */}
        <div style={{ margin: '18px 0 0 0' }} aria-label={`Progression : ${nb} démarches sur ${DEMARCHES.length}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 2px 6px 2px' }}>
            <span style={{ fontSize: '0.89rem', fontWeight: 700, color: COL.bleu9 }}>{nb} / {DEMARCHES.length} faites</span>
            <span style={{ fontSize: '0.89rem', fontWeight: 600, color: COL.texte2 }}>{pct} %</span>
          </div>
          <div style={{ height: 12, background: COL.bleu1, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: COL.vert, borderRadius: 999, transition: 'width .3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 0 0 0' }}>
          {DEMARCHES.map((d) => {
            const faite = faites.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => basculer(d.id)}
                aria-pressed={faite}
                data-card="true"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, textAlign: 'left',
                  background: '#fff', border: `2px solid ${faite ? COL.vert : COL.bleu1}`,
                  borderRadius: 18, boxShadow: CARD_SHADOW_SM, padding: '16px 16px',
                  opacity: faite ? 0.82 : 1, color: COL.texte, width: '100%',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: 10, marginTop: 2,
                    background: faite ? COL.vert : '#fff', border: `2.5px solid ${faite ? COL.vert : COL.gris}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 18,
                  }}
                >
                  {faite ? '✓' : ''}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: COL.bleu9, textDecoration: faite ? 'line-through' : 'none' }}>
                    {d.titre}
                  </span>
                  <span style={{ display: 'block', margin: '4px 0 0 0', fontSize: '0.89rem', color: COL.texte2, lineHeight: 1.45 }}>
                    {d.detail}
                  </span>
                  <span style={{ display: 'block', margin: '6px 0 0 0', fontSize: '0.8rem', fontWeight: 600, color: COL.bleu7 }}>
                    → {d.aupres}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ margin: '20px 0 0 0', background: COL.orangeClair, borderRadius: 16, padding: '14px 16px', fontSize: '0.89rem', color: COL.texte }}>
          Ces informations sont générales : les droits dépendent de chaque situation.
          L&apos;assistante sociale de l&apos;hôpital ou du secteur peut vous accompagner gratuitement dans ces démarches.
        </div>
      </div>
    </AppShell>
  );
}
