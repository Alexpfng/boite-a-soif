import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { InstallBanner } from '../components/ui/InstallBanner';
import { Wordmark, ChevronDroit } from '../ui/icons';
import { COL, FRAUNCES } from '../ui/theme';
import { usePeseAlco } from '../features/pesealco/usePeseAlco';
import { useAuth } from '../features/auth/AuthContext';
import { PHRASES } from '../features/jukebox/phrases';
import { parlerTavernier, tchin, fanfare } from '../features/audio/sons';
import { aperoDuJour, aperoDejaFait, releverApero, XP_APERO } from '../features/cabine/aperoDuJour';
import { listerAmities, accepterDemande, retirerAmitie, abonnerAmities, type LienAmi } from '../features/champions/amis';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

// Icônes des 4 comptoirs (stroke pilotable)
function IcoJauge({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 16 A8 8 0 0 1 20 16" /><line x1="12" y1="16" x2="16" y2="11" /><circle cx="12" cy="16" r="1.4" fill={c} stroke="none" />
    </svg>
  );
}
function IcoHautParleur({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10 H8 L13 5 V19 L8 14 H4 Z" /><path d="M16.5 9 C18.5 10.5 18.5 13.5 16.5 15" /><path d="M19 7 C22 9.5 22 14.5 19 17" />
    </svg>
  );
}
function IcoArdoise({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><line x1="7.5" y1="9" x2="16.5" y2="9" /><line x1="7.5" y1="12.5" x2="16.5" y2="12.5" /><line x1="7.5" y1="16" x2="12.5" y2="16" />
    </svg>
  );
}
function IcoTrophee({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21 H16" /><path d="M12 17 V21" /><path d="M6 4 H18 V8 C18 11.3 15.3 13.5 12 13.5 C8.7 13.5 6 11.3 6 8 Z" /><path d="M18 5 H21 V7.5 C21 9 20 10 18.5 10" /><path d="M6 5 H3 V7.5 C3 9 4 10 5.5 10" />
    </svg>
  );
}

// Une « tuile comptoir » : gros bouton arcade vintage.
function Comptoir({ bg, fg, border, onClick, icon, label }: {
  bg: string; fg: string; border?: string; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button onClick={onClick}
      style={{
        minHeight: 118, borderRadius: 18, background: bg, color: fg,
        border: border ? `2px solid ${border}` : 'none',
        boxShadow: '0 5px 0 rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 8, padding: 16, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem', textAlign: 'left',
        textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1.05,
      }}>
      {icon}
      {label}
    </button>
  );
}

export default function Accueil() {
  const navigate = useNavigate();
  const { bac, etat, consos } = usePeseAlco();
  const { user, seDeconnecter, estInvite } = useAuth();
  const pseudo = ((user?.user_metadata?.pseudo as string) || '').trim() || 'Pilier';

  // « Une vanne, patron ! » : un geste = un gag, sans quitter l'accueil.
  const [vanne, setVanne] = useState<string | null>(null);
  const vanneAuHasard = () => {
    const p = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    parlerTavernier(p.texte);
    tchin();
    setVanne(p.texte);
    window.setTimeout(() => setVanne((v) => (v === p.texte ? null : v)), 3200);
  };

  // Demandes de potes reçues : visibles dès l'accueil, sans aller les chercher.
  const monId = user?.id ?? null;
  const [demandes, setDemandes] = useState<LienAmi[]>([]);
  const chargerDemandes = useCallback(() => {
    if (monId) listerAmities(monId).then((ls) => setDemandes(ls.filter((l) => l.sens === 'recue')));
  }, [monId]);
  useEffect(() => {
    if (!monId) return;
    chargerDemandes();
    return abonnerAmities(chargerDemandes); // arrivée en direct si publié en Realtime
  }, [monId, chargerDemandes]);
  const accepterPote = async (l: LienAmi) => {
    if (await accepterDemande(l.amitieId)) {
      tchin();
      chargerDemandes();
    }
  };
  const refuserPote = async (l: LienAmi) => {
    if (await retirerAmitie(l.amitieId)) chargerDemandes();
  };

  // L'Apéro du jour : défi quotidien, XP à la clé (une fois par jour).
  const apero = aperoDuJour();
  const [aperoFait, setAperoFait] = useState<boolean>(() => aperoDejaFait());
  const releverDefi = () => {
    if (releverApero()) {
      fanfare();
      setAperoFait(true);
    }
  };

  return (
    <AppShell>
      {/* En-tête enseigne */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '24px 22px 22px' }}>
        <div className="gingham" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, opacity: 0.55 }} aria-hidden="true" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={`${import.meta.env.BASE_URL}brand/logo.png`} alt="" width={64} height={64} style={{ borderRadius: 14, display: 'block', boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }} />

          <div>
            <Wordmark taille="hero" color={COL.creme} />
            <p style={{ margin: '6px 0 0', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: COL.or }}>
              L&apos;appli des piliers de bar
            </p>
          </div>
        </div>
        <p style={{ margin: '16px 0 0', fontSize: '1rem', lineHeight: 1.55, color: COL.texte2, maxWidth: '40ch' }}>
          Salut pilier ! On suit la tournée, on garde l&apos;œil sur le compteur, et on rigole — avec modération.
        </p>
      </div>

      <InstallBanner />

      {/* Mon compte — optionnel */}
      <section aria-label="Mon compte" style={{ margin: '16px 16px 0' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 14px' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: COL.or, color: '#2A1F10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }} aria-hidden="true">
              {pseudo.charAt(0).toUpperCase()}
            </span>
            <span style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
              <span style={{ display: 'block', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>{estInvite ? 'En invité 🎭' : 'Connecté'}</span>
              <span style={{ display: 'block', fontWeight: 800, color: COL.creme, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pseudo}</span>
            </span>
            {/* Pour un invité, se déconnecter = perdre le compte anonyme : on
                propose plutôt de le garder (conversion en vrai compte). */}
            {estInvite ? (
              <button onClick={() => navigate('/connexion')}
                style={{ flexShrink: 0, minHeight: 40, padding: '0 14px', borderRadius: 10, border: `2px solid ${COL.or}`, background: 'transparent', color: COL.or, fontWeight: 800, fontSize: '0.85rem' }}>
                Garder mon compte
              </button>
            ) : (
              <button onClick={seDeconnecter}
                style={{ flexShrink: 0, minHeight: 40, padding: '0 14px', borderRadius: 10, border: `2px solid ${COL.bleu1}`, background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem' }}>
                Déconnexion
              </button>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/connexion')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: COL.panneau, border: `2px dashed ${COL.or}`, borderRadius: 14, padding: '14px 16px', color: COL.creme, textAlign: 'left' }}>
            <span style={{ fontSize: '1.6rem' }} aria-hidden="true">👤</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontFamily: FRAUNCES, fontWeight: 700, color: COL.or }}>Crée ton compte de pilier</span>
              <span style={{ display: 'block', fontSize: '0.82rem', color: COL.texte2, marginTop: 2 }}>Optionnel — pour te retrouver et garder tes données d&apos;un appareil à l&apos;autre.</span>
            </span>
            <ChevronDroit color={COL.or} />
          </button>
        )}
      </section>

      {/* Demandes de potes reçues : à accepter direct depuis l'accueil */}
      {demandes.length > 0 && (
        <section aria-label="Demandes de potes" style={{ margin: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {demandes.map((d) => (
            <div key={d.amitieId} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 16, padding: '12px 14px', boxShadow: '0 0 16px rgba(233,196,106,0.18)' }}>
              <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🤝</span>
              <span style={{ flex: 1, minWidth: 140, color: COL.creme, fontSize: '0.92rem', lineHeight: 1.35 }}>
                <strong style={{ color: COL.or }}>{d.pseudo}</strong> veut trinquer avec toi !
              </span>
              <button onClick={() => accepterPote(d)} className="pmu-arcade" style={{ minHeight: 44, padding: '0 16px', fontSize: '0.85rem' }}>
                🍻 Accepter
              </button>
              <button onClick={() => refuserPote(d)}
                style={{ minHeight: 44, padding: '0 12px', borderRadius: 10, border: `2px solid ${COL.bleu1}`, background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem' }}>
                Refuser
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Vedette : Le Pèse-Alco, taux en direct */}
      <section aria-label="Le Pèse-Alco" style={{ margin: '18px 16px 0' }}>
        <button onClick={() => navigate('/pese-alco')}
          style={{ display: 'block', width: '100%', textAlign: 'left', background: etat.fond, border: `2px solid ${etat.accent}`, borderRadius: 20, padding: '18px 20px', color: etat.texteSur }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: etat.accent }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, color: COL.texte2 }}>
              Le Pèse-Alco · en direct
            </span>
            <ChevronDroit color={etat.texteSur} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2.8rem', lineHeight: 1, color: etat.accent }}>{fmtBac(bac)}</span>
            <span style={{ fontWeight: 700 }}>g/L</span>
            <span style={{ marginLeft: 'auto', fontSize: '1.7rem' }} aria-hidden="true">{etat.emoji}</span>
          </div>
          <div style={{ marginTop: 6, fontWeight: 700, fontFamily: FRAUNCES, fontSize: '1.05rem' }}>{etat.titre}</div>
          <div style={{ marginTop: 2, fontSize: '0.85rem', color: COL.texte2 }}>
            {consos.length === 0 ? 'Aucune conso pour l’instant. Appuie pour ouvrir l’ardoise.' : `${consos.length} conso${consos.length > 1 ? 's' : ''} ce soir`}
          </div>
        </button>
      </section>

      {/* Un geste = un gag : le tavernier balance une vanne au hasard */}
      <section aria-label="Une vanne au hasard" style={{ margin: '12px 16px 0' }}>
        <button onClick={vanneAuHasard} className="pmu-arcade"
          style={{ width: '100%', minHeight: 64, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }} aria-hidden="true">🎲</span>
          Une vanne, patron !
        </button>
        {vanne && (
          <div role="status" style={{ marginTop: 10, background: COL.panneau, border: `1px solid ${COL.or}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }} aria-hidden="true">🔊</span>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.35, color: COL.creme }}>« {vanne} »</span>
          </div>
        )}
      </section>

      {/* L'Apéro du jour : le rituel quotidien du comptoir */}
      <section aria-label="L'Apéro du jour" style={{ margin: '12px 16px 0' }}>
        <div className="pmu-ardoise" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{apero.emoji}</span>
            <h2 className="craie" style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1 }}>
              L&apos;Apéro du jour
            </h2>
            <span className="craie-2" style={{ fontSize: '0.7rem', fontWeight: 800 }}>{aperoFait ? '✅ relevé' : `+${XP_APERO} XP`}</span>
          </div>
          <p className="craie" style={{ margin: '10px 0 12px', fontSize: '0.95rem', lineHeight: 1.5 }}>{apero.texte}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => parlerTavernier(apero.texte)}
              className="pmu-arcade pmu-arcade--ardoise" style={{ minHeight: 46, padding: '0 14px', fontSize: '0.86rem' }}>
              🔊 Le tavernier l&apos;annonce
            </button>
            <button onClick={releverDefi} disabled={aperoFait}
              className="pmu-arcade pmu-arcade--or" style={{ minHeight: 46, padding: '0 14px', fontSize: '0.86rem', opacity: aperoFait ? 0.55 : 1 }}>
              {aperoFait ? 'Défi relevé, champion' : '💪 Défi relevé !'}
            </button>
          </div>
        </div>
      </section>

      {/* Les 4 comptoirs */}
      <nav aria-label="Les comptoirs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '18px 16px 0' }}>
        <Comptoir bg={COL.rougeNeon} fg="#fff" onClick={() => navigate('/pese-alco')} icon={<IcoJauge c="#fff" />} label="Le Pèse-Alco" />
        <Comptoir bg={COL.or} fg="#2A1F10" onClick={() => navigate('/juke-box')} icon={<IcoHautParleur c="#2A1F10" />} label="Le Juke-Box à Conneries" />
        <Comptoir bg="#14110F" fg={COL.creme} border={COL.or} onClick={() => navigate('/ardoise')} icon={<IcoArdoise c={COL.or} />} label="L’Ardoise des Comptes" />
        <Comptoir bg={COL.ambre} fg="#2A1F10" onClick={() => navigate('/champions')} icon={<IcoTrophee c="#2A1F10" />} label="Le Tableau des Champions" />
      </nav>

      {/* Mes potes — inviter, accepter, retrouver sa bande (accès direct) */}
      <section style={{ margin: '12px 16px 0' }}>
        <button onClick={() => navigate('/amis')}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '16px 18px', color: COL.creme }}>
          <span style={{ fontSize: '1.9rem' }} aria-hidden="true">👥</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem', color: COL.or }}>Mes potes</span>
              {demandes.length > 0 && (
                <span style={{ background: COL.rougeNeon, color: '#fff', fontSize: '0.66rem', fontWeight: 800, borderRadius: 999, padding: '2px 8px' }}>
                  {demandes.length} demande{demandes.length > 1 ? 's' : ''}
                </span>
              )}
            </span>
            <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 2 }}>
              Envoie ton lien de pote ou fais scanner ton QR : la demande part toute seule.
            </span>
          </span>
          <ChevronDroit color={COL.or} />
        </button>
      </section>

      {/* L'Analyse — bilan WHOOP parodique */}
      <section style={{ margin: '12px 16px 0' }}>
        <button onClick={() => navigate('/analyse')}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 18, padding: '16px 18px', color: COL.creme }}>
          <span style={{ fontSize: '1.9rem' }} aria-hidden="true">📊</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem', color: COL.or }}>L&apos;Analyse</span>
              <span style={{ background: COL.rougeNeon, color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: 999, padding: '2px 8px', letterSpacing: '0.05em' }}>NOUVEAU</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 2 }}>
              Ton bilan de pilier façon coach connecté… totalement à côté de la plaque.
            </span>
          </span>
          <ChevronDroit color={COL.or} />
        </button>
      </section>

      {/* La Cabine — mini-jeux (souffle, équilibre, oracle) */}
      <section style={{ margin: '12px 16px 0' }}>
        <button onClick={() => navigate('/cabine')}
          style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '16px 18px', color: COL.creme }}>
          <span style={{ fontSize: '1.9rem' }} aria-hidden="true">🎤</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.05rem', color: COL.or }}>La Cabine</span>
              <span style={{ background: COL.rougeNeon, color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: 999, padding: '2px 8px', letterSpacing: '0.05em' }}>NOUVEAU</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.84rem', color: COL.texte2, marginTop: 2 }}>
              Éthylotest à souffle, test d&apos;équilibre, et l&apos;oracle du comptoir.
            </span>
          </span>
          <ChevronDroit color={COL.or} />
        </button>
      </section>

      {/* Sécurité / modération */}
      <section style={{ margin: '22px 16px 0' }}>
        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: COL.texte2, lineHeight: 1.55 }}>
            <strong style={{ color: COL.or }}>On rigole, mais on assure.</strong> Les estimations de la Boît&apos;à Soif
            sont indicatives. L’abus d’alcool est dangereux pour la santé. Jamais d’alcool au volant.
          </p>
        </div>
      </section>

      <footer style={{ margin: '28px 22px 0', padding: '16px 0 8px', borderTop: '1px solid rgba(243,232,207,0.14)' }}>
        <p style={{ margin: 0, fontSize: '0.84rem', color: COL.texte2 }}>
          La Boît&apos;à Soif — l&apos;appli des piliers de bar.
        </p>
        <button onClick={() => navigate('/a-propos')}
          style={{ margin: '8px 0 0', padding: '6px 0', border: 'none', background: 'transparent', color: COL.or, fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline' }}>
          À propos de l&apos;application
        </button>
      </footer>
    </AppShell>
  );
}
