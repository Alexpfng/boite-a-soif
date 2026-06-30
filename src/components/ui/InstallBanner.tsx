import { useEffect, useState } from 'react';
import { lireStockage, ecrireStockage } from '../../lib/storage';
import { Symbole } from '../../ui/icons';
import { COL, CARD_SHADOW } from '../../ui/theme';

// Invitation à installer l'application sur l'écran d'accueil.
// Android/Chrome : invite native via beforeinstallprompt.
// iOS/Safari : pas d'API — on guide pas à pas.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function estInstallee(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function estIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function InstallBanner() {
  const [fermee, setFermee] = useState(() => lireStockage<boolean>('install-fermee', false));
  const [promptEvt, setPromptEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [guideIos, setGuideIos] = useState(false);

  useEffect(() => {
    function onPrompt(e: Event) {
      e.preventDefault();
      setPromptEvt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (fermee || estInstallee()) return null;
  // Sans invite native et hors iOS, rien de fiable à proposer
  if (!promptEvt && !estIos()) return null;

  function fermer() {
    setFermee(true);
    ecrireStockage('install-fermee', true);
  }

  async function installer() {
    if (promptEvt) {
      await promptEvt.prompt();
      const choix = await promptEvt.userChoice;
      if (choix.outcome === 'accepted') fermer();
    } else {
      setGuideIos(true);
    }
  }

  return (
    <section aria-label="Installer l'application" style={{ margin: '18px 16px 0 16px' }}>
      <div
        data-card="true"
        style={{
          background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW,
          padding: '16px 20px', border: `2px solid ${COL.bleu1}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 48, height: 48, borderRadius: 14, background: COL.bleu7,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <Symbole size={28} color="#FFFFFF" />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, color: COL.bleu9, fontSize: '0.95rem' }}>
              Installer l&apos;application sur votre téléphone
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: COL.texte2 }}>
              Elle fonctionnera ensuite même sans Internet.
            </p>
          </div>
        </div>

        {!guideIos ? (
          <div style={{ display: 'flex', gap: 10, margin: '14px 0 0 0' }}>
            <button
              onClick={installer}
              style={{
                flex: 1.4, border: 'none', borderRadius: 14, background: COL.bleu7, color: '#fff',
                padding: 12, fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
              }}
            >
              Installer
            </button>
            <button
              onClick={fermer}
              style={{
                flex: 1, border: `2px solid ${COL.bleu1}`, borderRadius: 14, background: '#fff',
                color: COL.texte2, padding: 12, fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
              }}
            >
              Plus tard
            </button>
          </div>
        ) : (
          <div style={{ margin: '14px 0 0 0' }}>
            <ol style={{ margin: 0, padding: '0 0 0 22px', fontSize: '0.89rem', color: COL.texte, lineHeight: 1.6 }}>
              <li>
                Appuyez sur le bouton <strong>Partager</strong>
                {' '}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={COL.bleu7} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', verticalAlign: '-3px' }}>
                  <path d="M12 3 V14" /><path d="M8 7 L12 3 L16 7" /><rect x="5" y="10" width="14" height="11" rx="2" />
                </svg>
                {' '}
                en bas de l&apos;écran.
              </li>
              <li>Faites défiler et choisissez <strong>« Sur l&apos;écran d&apos;accueil »</strong>.</li>
              <li>Appuyez sur <strong>Ajouter</strong>.</li>
            </ol>
            <button
              onClick={fermer}
              style={{
                margin: '12px 0 0 0', width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
                background: '#fff', color: COL.texte2, padding: 12,
                fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
              }}
            >
              J&apos;ai compris
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
