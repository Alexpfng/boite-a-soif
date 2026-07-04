import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { useAuth } from '../features/auth/AuthContext';
import {
  chercherProfils, envoyerDemande, accepterDemande, retirerAmitie, listerAmities,
  lirePseudoProfil, abonnerAmities,
  type LienAmi, type ProfilTrouve,
} from '../features/champions/amis';

function Pastille({ children }: { children: React.ReactNode }) {
  return <span style={{ width: 40, height: 40, borderRadius: '50%', background: COL.or, color: '#2A1F10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }} aria-hidden="true">{children}</span>;
}

export default function Amis() {
  const { user, chargement } = useAuth();
  const navigate = useNavigate();
  const monId = user?.id ?? null;

  const [liens, setLiens] = useState<LienAmi[]>([]);
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState<ProfilTrouve[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const recharger = useCallback(() => {
    if (monId) listerAmities(monId).then(setLiens);
  }, [monId]);

  useEffect(() => { recharger(); }, [recharger]);

  // Les demandes arrivent en direct (si la table est publiée en Realtime).
  useEffect(() => {
    if (!monId) return;
    return abonnerAmities(recharger);
  }, [monId, recharger]);

  const message = (m: string) => { setFlash(m); window.setTimeout(() => setFlash((c) => (c === m ? null : c)), 2500); };

  // ── Lien de pote : ouvrir /amis?pote=<id> envoie la demande tout seul ──
  const lienPote = monId ? `${window.location.origin}${import.meta.env.BASE_URL}amis?pote=${monId}` : '';
  const [qrPote, setQrPote] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const demandeAuto = useRef(false); // une seule tentative par visite

  useEffect(() => {
    const cible = searchParams.get('pote');
    if (!cible || !monId || demandeAuto.current) return;
    demandeAuto.current = true;
    setSearchParams({}, { replace: true }); // nettoie l'URL (pas de re-demande au refresh)
    (async () => {
      if (cible === monId) { message('Ça, c’est TON lien de pote. Fais-le scanner aux autres 😄'); return; }
      const pseudoCible = await lirePseudoProfil(cible);
      const dejaLie = (await listerAmities(monId)).some((l) => l.autreId === cible);
      if (dejaLie) { message(`${pseudoCible} et toi, c'est déjà lié 🍻`); return; }
      if (await envoyerDemande(cible)) {
        message(`Demande envoyée à ${pseudoCible} 🍻 — il n'a plus qu'à accepter.`);
        recharger();
      } else {
        message('Demande impossible (souci réseau ?). Réessaie via le lien.');
      }
    })();
  }, [searchParams, monId, recharger, setSearchParams]);

  const basculerQr = async () => {
    if (qrPote) { setQrPote(null); return; }
    try {
      setQrPote(await QRCode.toDataURL(lienPote, { width: 480, margin: 2, color: { dark: '#1B1917', light: '#F3E8CF' } }));
    } catch {
      message('Impossible de générer le QR code.');
    }
  };

  // Recherche en direct (débouncée).
  useEffect(() => {
    if (!monId) return;
    const t = setTimeout(() => {
      if (recherche.trim().length < 2) { setResultats([]); return; }
      chercherProfils(recherche, monId).then(setResultats);
    }, 350);
    return () => clearTimeout(t);
  }, [recherche, monId]);

  const idsLies = useMemo(() => new Set(liens.map((l) => l.autreId)), [liens]);

  const recues = liens.filter((l) => l.sens === 'recue');
  const amis = liens.filter((l) => l.sens === 'ami');
  const envoyees = liens.filter((l) => l.sens === 'envoyee');

  if (!chargement && !user) return <Navigate to="/connexion" replace state={{ from: '/amis' }} />;

  const ajouter = async (p: ProfilTrouve) => {
    if (await envoyerDemande(p.id)) { message(`Demande envoyée à ${p.pseudo} 🍻`); recharger(); }
    else message('Déjà demandé, ou souci réseau.');
  };
  const accepter = async (l: LienAmi) => { if (await accepterDemande(l.amitieId)) { message(`${l.pseudo} est dans ta bande !`); recharger(); } };
  const retirer = async (l: LienAmi) => { if (await retirerAmitie(l.amitieId)) recharger(); };

  // Partage du LIEN DE POTE : le pote l'ouvre (même en invité), sa demande
  // part toute seule — zéro recherche de pseudo pour qui ne connaît pas l'appli.
  const inviter = async () => {
    const partage = {
      title: "La Boît'à Soif",
      text: "Deviens mon pote sur La Boît'à Soif 🍻 — ouvre ce lien, entre (même en invité), et ta demande m'arrive direct.",
      url: lienPote,
    };
    if (typeof navigator.share === 'function') {
      try { await navigator.share(partage); return; } catch { return; }
    }
    try { await navigator.clipboard.writeText(lienPote); message('Lien de pote copié ! Envoie-le 🍻'); }
    catch { message(lienPote); }
  };

  const btn: React.CSSProperties = { minHeight: 44, padding: '0 14px', borderRadius: 10, fontWeight: 800, fontSize: '0.85rem', border: 'none' };

  return (
    <AppShell>
      <section style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '22px 22px 20px' }}>
        <button onClick={() => navigate('/champions')} style={{ border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', padding: 0, marginBottom: 8 }}>← Les Champions</button>
        <h1 className="pmu-titre" style={{ fontSize: '1.9rem', margin: 0 }}>Mes <span className="accent">potes</span></h1>
        <p style={{ margin: '6px 0 0', color: COL.texte2, fontSize: '0.92rem', lineHeight: 1.45 }}>Envoie ton lien de pote (ou fais scanner ton QR) : la demande part toute seule.</p>
      </section>

      {flash && (
        <div role="status" style={{ margin: '14px 16px 0', background: COL.panneau, border: `1px solid ${COL.or}`, borderRadius: 12, padding: '12px 14px', color: COL.creme, fontWeight: 600, fontSize: '0.9rem' }}>{flash}</div>
      )}

      {/* Inviter : lien de pote (demande automatique) + QR à faire scanner */}
      <section style={{ margin: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={inviter} className="pmu-arcade" style={{ flex: 1, minHeight: 56, fontSize: '1rem' }}>🤝 Envoyer mon lien de pote</button>
          <button onClick={basculerQr} aria-expanded={qrPote != null} className="pmu-arcade pmu-arcade--ardoise" style={{ minHeight: 56, padding: '0 16px', fontSize: '0.95rem' }}>
            {qrPote ? '✕' : '📷 QR'}
          </button>
        </div>
        {qrPote && (
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <img src={qrPote} alt="QR code de mon lien de pote" width={200} height={200}
              style={{ display: 'block', margin: '0 auto', borderRadius: 12, border: `2px solid ${COL.or}` }} />
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: COL.texte2 }}>Fais scanner : la demande de pote part toute seule.</p>
          </div>
        )}
        <p style={{ margin: '8px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.45 }}>
          Ton pote ouvre le lien, entre dans la boîte (même en invité), et sa demande t&apos;arrive
          directement — rien à chercher, rien à taper.
        </p>
      </section>

      {/* Recherche */}
      <section style={{ margin: '18px 16px 0' }}>
        <label htmlFor="rech" style={{ display: 'block', margin: '0 0 6px 2px', fontWeight: 700, fontSize: '0.85rem', color: COL.texte2 }}>Chercher un pilier</label>
        <input id="rech" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Pseudo (ex. Dédé)"
          style={{ width: '100%', minHeight: 54, padding: '12px 16px', fontSize: '1rem', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 14, color: COL.creme }} />
        {resultats.length > 0 && (
          <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resultats.map((p) => {
              const lie = idsLies.has(p.id);
              return (
                <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '10px 12px' }}>
                  <Pastille>{p.pseudo.charAt(0).toUpperCase()}</Pastille>
                  <span style={{ flex: 1, fontWeight: 800, color: COL.creme, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.pseudo}</span>
                  {lie ? (
                    <span style={{ color: COL.texte2, fontSize: '0.8rem', fontWeight: 700 }}>déjà lié</span>
                  ) : (
                    <button onClick={() => ajouter(p)} className="pmu-arcade" style={{ minHeight: 44, padding: '0 14px', fontSize: '0.85rem' }}>+ Ajouter</button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Demandes reçues */}
      {recues.length > 0 && (
        <section style={{ margin: '24px 16px 0' }}>
          <h2 style={{ margin: '0 0 10px 2px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or }}>Demandes reçues</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recues.map((l) => (
              <li key={l.amitieId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: COL.panneau, border: `1px solid ${COL.or}`, borderRadius: 14, padding: '10px 12px' }}>
                <Pastille>{l.pseudo.charAt(0).toUpperCase()}</Pastille>
                <span style={{ flex: 1, fontWeight: 800, color: COL.creme, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.pseudo}</span>
                <button onClick={() => accepter(l)} style={{ ...btn, background: COL.vert, color: '#1c2414' }}>Accepter</button>
                <button onClick={() => retirer(l)} style={{ ...btn, background: 'transparent', color: COL.texte2, border: `2px solid ${COL.bleu1}` }}>Refuser</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mes potes */}
      <section style={{ margin: '24px 16px 0' }}>
        <h2 style={{ margin: '0 0 10px 2px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or }}>Ma bande ({amis.length})</h2>
        {amis.length === 0 ? (
          <div style={{ background: COL.panneau, border: `2px dashed ${COL.bleu1}`, borderRadius: 14, padding: '18px 16px', textAlign: 'center', color: COL.texte2 }}>
            Pas encore de pote. Envoie ton lien de pote ci-dessus pour lancer ta tablée !
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {amis.map((l) => (
              <li key={l.amitieId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '10px 12px' }}>
                <button onClick={() => navigate(`/profil/${l.autreId}`)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, background: 'transparent', border: 'none', textAlign: 'left', padding: 0 }}>
                  <Pastille>{l.pseudo.charAt(0).toUpperCase()}</Pastille>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 800, color: COL.creme, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.pseudo} ›</span>
                </button>
                <button onClick={() => retirer(l)} style={{ ...btn, background: 'transparent', color: COL.texte2, border: `2px solid ${COL.bleu1}` }}>Retirer</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Demandes envoyées */}
      {envoyees.length > 0 && (
        <section style={{ margin: '24px 16px 0' }}>
          <h2 style={{ margin: '0 0 10px 2px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.texte2 }}>En attente</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {envoyees.map((l) => (
              <li key={l.amitieId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '10px 12px', opacity: 0.85 }}>
                <Pastille>{l.pseudo.charAt(0).toUpperCase()}</Pastille>
                <span style={{ flex: 1, fontWeight: 800, color: COL.creme, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.pseudo}</span>
                <span style={{ color: COL.texte2, fontSize: '0.8rem', fontWeight: 700 }}>demande envoyée</span>
                <button onClick={() => retirer(l)} style={{ ...btn, background: 'transparent', color: COL.texte2, border: `2px solid ${COL.bleu1}`, minWidth: 40 }}>×</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div style={{ height: 24 }} />
    </AppShell>
  );
}
