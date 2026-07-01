import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { useAuth } from '../features/auth/AuthContext';
import { lireProfil, uploaderAvatar, type ProfilPilier } from '../features/profil/api';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');
function fmtDate(iso: string) { try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return iso; } }

function Stat({ valeur, label }: { valeur: string; label: string }) {
  return (
    <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 14px' }}>
      <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.7rem', color: COL.or, lineHeight: 1 }}>{valeur}</div>
      <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: COL.texte2, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// Consos regroupées par semaine (12 dernières) + résumé de la semaine en cours.
function bucketsSemaines(cuites: { cloturee_at: string; consos: number; duree_min: number }[]) {
  const MS = 7 * 86400000, now = Date.now();
  const semaines: number[] = [];
  for (let i = 11; i >= 0; i--) {
    const fin = now - i * MS, debut = fin - MS;
    semaines.push(cuites.filter((c) => { const t = Date.parse(c.cloturee_at); return t > debut && t <= fin; }).reduce((s, c) => s + c.consos, 0));
  }
  const dcuites = cuites.filter((c) => Date.parse(c.cloturee_at) > now - MS);
  return { semaines, consosSemaine: dcuites.reduce((s, c) => s + c.consos, 0), tempsSemaine: dcuites.reduce((s, c) => s + c.duree_min, 0), cuitesSemaine: dcuites.length };
}

function Courbe({ valeurs }: { valeurs: number[] }) {
  const max = Math.max(1, ...valeurs);
  const W = 100, H = 40, n = valeurs.length;
  const pts = valeurs.map((v, i) => [n <= 1 ? 0 : (i / (n - 1)) * W, H - (v / max) * H] as const);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 110, display: 'block' }} aria-hidden="true">
        <path d={`${line} L${W},${H} L0,${H} Z`} fill="rgba(225,75,58,0.22)" />
        <path d={line} fill="none" stroke={COL.rougeNeon} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: COL.texte2, marginTop: 2 }}>
        <span>il y a 12 sem.</span><span>max {max}</span><span>cette sem.</span>
      </div>
    </div>
  );
}

export default function Profil() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cible = id === 'me' ? (user?.id || '') : id;

  const [p, setP] = useState<ProfilPilier | null>(null);
  const [chargement, setChargement] = useState(true);
  const [upEnCours, setUp] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let actif = true; setChargement(true);
    lireProfil(cible).then((r) => { if (actif) { setP(r); setChargement(false); } });
    return () => { actif = false; };
  }, [cible]);

  async function choisirFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUp(true);
    const url = await uploaderAvatar(file);
    setUp(false);
    if (url && p) setP({ ...p, avatarUrl: url });
  }

  return (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '18px 22px' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', padding: 0 }}>← Retour</button>
      </div>

      {chargement || !p ? (
        <p style={{ textAlign: 'center', color: COL.texte2, padding: '30px 0' }}>Chargement du profil… 🍺</p>
      ) : (
        <>
          {/* En-tête profil */}
          <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 104, height: 104, margin: '0 auto' }}>
              {p.avatarUrl
                ? <img src={p.avatarUrl} alt="" width={104} height={104} style={{ width: 104, height: 104, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${COL.or}` }} />
                : <div style={{ width: 104, height: 104, borderRadius: '50%', background: COL.or, color: '#2A1F10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FRAUNCES, fontWeight: 800, fontSize: '2.6rem' }} aria-hidden="true">{p.pseudo.charAt(0).toUpperCase()}</div>}
              {p.estMoi && (
                <button onClick={() => fileRef.current?.click()} aria-label="Changer la photo"
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: '50%', border: `2px solid ${COL.ardoise}`, background: COL.rougeNeon, color: '#fff', fontSize: '1rem' }}>📷</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={choisirFichier} style={{ display: 'none' }} />
            <h1 className="pmu-titre" style={{ fontSize: '1.7rem', marginTop: 12 }}>{p.pseudo}</h1>
            {p.estMoi && <div style={{ fontSize: '0.8rem', color: COL.texte2 }}>{upEnCours ? 'Envoi de la photo…' : 'Ton profil de pilier'}</div>}
          </section>

          {/* Stats façon Strava */}
          <section style={{ margin: '18px 16px 0' }}>
            <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '0 2px 10px' }}>Ses statistiques de gnôle</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Stat valeur={`${p.nbCuites}`} label="Cuites au compteur" />
              <Stat valeur={`${p.totalConsos}`} label="Consos cumulées" />
              <Stat valeur={`${fmtBac(p.record)} g/L`} label="Record perso 🏅" />
              <Stat valeur={p.moyConsos.toFixed(1)} label="Moy. consos / cuite" />
              <Stat valeur={`${p.cetteSemaine}`} label="Cuites cette semaine" />
              <Stat valeur={`${Math.round(p.cuites.reduce((s, c) => s + c.duree_min, 0) / 60)} h`} label="Temps au comptoir" />
            </div>
          </section>

          {/* Cette semaine + courbe 12 semaines (façon Strava) */}
          {(() => { const b = bucketsSemaines(p.cuites); return (
            <section style={{ margin: '20px 16px 0' }}>
              <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '0 2px 10px' }}>Au comptoir, cette semaine</h2>
              <div style={{ display: 'flex', gap: 22, marginBottom: 12 }}>
                <div><div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.6rem', color: COL.creme, lineHeight: 1 }}>{b.consosSemaine}</div><div style={{ fontSize: '0.72rem', color: COL.texte2, marginTop: 2 }}>Consos</div></div>
                <div><div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.6rem', color: COL.creme, lineHeight: 1 }}>{b.cuitesSemaine}</div><div style={{ fontSize: '0.72rem', color: COL.texte2, marginTop: 2 }}>Cuites</div></div>
                <div><div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.6rem', color: COL.creme, lineHeight: 1 }}>{Math.floor(b.tempsSemaine / 60)}h{String(b.tempsSemaine % 60).padStart(2, '0')}</div><div style={{ fontSize: '0.72rem', color: COL.texte2, marginTop: 2 }}>Au comptoir</div></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: COL.texte2, marginBottom: 4 }}>12 dernières semaines · consos</div>
              <Courbe valeurs={b.semaines} />
            </section>
          ); })()}

          {/* Dernières cuites (façon flux Strava) */}
          <section style={{ margin: '22px 16px 0' }}>
            <h2 style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', color: COL.or, margin: '0 2px 10px' }}>Dernières cuites</h2>
            {p.cuites.length === 0 ? (
              <div style={{ background: COL.panneau, border: `2px dashed ${COL.bleu1}`, borderRadius: 14, padding: '18px 16px', textAlign: 'center', color: COL.texte2, lineHeight: 1.5 }}>
                {p.estMoi
                  ? 'Aucune cuite enregistrée. Clôture une session dans le Pèse-Alco pour la voir apparaître ici. 🍺'
                  : 'Rien à voir ici — soit pas encore de cuite, soit vous n’êtes pas encore amis (les cuites sont réservées aux potes).'}
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.cuites.map((c) => (
                  <li key={c.id} style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: COL.creme }}>🍺 {c.consos} conso{c.consos > 1 ? 's' : ''}</span>
                      <span style={{ fontSize: '0.78rem', color: COL.texte2 }}>{fmtDate(c.cloturee_at)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: '0.82rem', color: COL.texte2 }}>
                      <span>Pic : <strong style={{ color: COL.or }}>{fmtBac(c.pic_bac)} g/L</strong></span>
                      <span>Durée : <strong style={{ color: COL.creme }}>{c.duree_min >= 60 ? `${Math.floor(c.duree_min / 60)}h${String(c.duree_min % 60).padStart(2, '0')}` : `${c.duree_min} min`}</strong></span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ margin: '22px 16px 0' }}>
            <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2, lineHeight: 1.5 }}>🎖️ Un profil de pilier, pas un trophée : l’abus d’alcool est dangereux. On compte les fous rires, pas les verres.</p>
            </div>
          </section>
          <div style={{ height: 20 }} />
        </>
      )}
    </AppShell>
  );
}
