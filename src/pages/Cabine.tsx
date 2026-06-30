import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { COL, FRAUNCES } from '../ui/theme';
import { parlerTavernier, vibrer, sonnerie } from '../features/audio/sons';
import { lireStockage, ecrireStockage } from '../lib/storage';
import { etatBac, paramsIvresse, bredouiller } from '../features/pesealco/widmark';
import { reponsePatron } from '../features/cabine/oracle';
import { SIGNES, horoscopeDuJour, commentaireDerniere, etatPisse, type HoroDuJour } from '../features/cabine/contenu';
import { Entete } from './cabine/Cadre';
import { Toasts } from './cabine/Toasts';
import { MotDuJour } from './cabine/MotDuJour';
import { Surnom } from './cabine/Surnom';
import { Traducteur } from './cabine/Traducteur';
import { Mytho } from './cabine/Mytho';
import { Beauferie } from './cabine/Beauferie';
import { QuiPaie } from './cabine/QuiPaie';
import { SelfieFlou } from './cabine/SelfieFlou';
import { Citations } from './cabine/Citations';

const fmtBac = (g: number) => g.toFixed(2).replace('.', ',');

type Vue = 'menu' | 'souffle' | 'equilibre' | 'patron' | 'horoscope' | 'derniere' | 'bellemere' | 'pisse' | 'legendes'
  | 'toasts' | 'motdujour' | 'surnom' | 'traducteur' | 'mytho' | 'beauferie' | 'quipaie' | 'selfie' | 'citations';

export default function Cabine() {
  const navigate = useNavigate();
  const [vue, setVue] = useState<Vue>('menu');

  return (
    <AppShell>
      <div style={{ background: '#14110F', borderBottom: `2px solid ${COL.or}`, padding: '24px 22px 22px' }}>
        <h1 className="pmu-titre" style={{ fontSize: '1.95rem' }}>
          LA <span className="accent">CABINE</span>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: COL.texte2, lineHeight: 1.5 }}>
          Les petits numéros du comptoir. À faire sur téléphone, c’est meilleur.
        </p>
      </div>

      {vue === 'menu' && (
        <>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '18px 16px 0' }}>
            <Tuile emoji="🎤" titre="L’Éthylotest à souffle" desc="Souffle dans le micro… le verdict tombe." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('souffle')} />
            <Tuile emoji="📳" titre="Le test d’équilibre" desc="Tiens le téléphone immobile 5 secondes. On verra bien." bg={COL.or} fg="#2A1F10" onClick={() => setVue('equilibre')} />
            <Tuile emoji="🔮" titre="Demande au patron" desc="Pose ta question. Le patron tranche (à sa façon)." bg={COL.ambre} fg="#2A1F10" onClick={() => setVue('patron')} />
            <Tuile emoji="🔭" titre="L’Horoscope du Pilier" desc="Ton signe, ta prédiction de comptoir du jour." bg={COL.or} fg="#2A1F10" onClick={() => setVue('horoscope')} />
            <Tuile emoji="🤥" titre="Compteur « c’est ma dernière »" desc="Compte tes « dernières »… on n’est pas dupes." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('derniere')} />
            <Tuile emoji="👵" titre="Détecteur de Belle-mère" desc="Déclenche un faux appel pour t’éclipser." bg={COL.ambre} fg="#2A1F10" onClick={() => setVue('bellemere')} />
            <Tuile emoji="🚽" titre="Le Pisse-mètre" desc="Compte tes allers-retours aux gogues." bg={COL.or} fg="#2A1F10" onClick={() => setVue('pisse')} />
            <Tuile emoji="🏆" titre="Le Mur des Légendes" desc="Les punchlines et exploits de la bande." bg="#14110F" fg={COL.creme} onClick={() => setVue('legendes')} />
            <Tuile emoji="🥂" titre="La Machine à Toasts" desc="Un porté de santé prêt à déclamer." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('toasts')} />
            <Tuile emoji="🕵️" titre="Le Détecteur de Mytho" desc="Vérité ou mytho ? Le polygraphe du comptoir tranche." bg={COL.or} fg="#2A1F10" onClick={() => setVue('mytho')} />
            <Tuile emoji="📸" titre="Le Selfie Flou" desc="Ta vision selon ton taux. Plus tu bois, plus c’est flou." bg={COL.ambre} fg="#2A1F10" onClick={() => setVue('selfie')} />
            <Tuile emoji="🎡" titre="La Roue « Qui paie ? »" desc="Le sort désigne qui régale la tournée." bg="#14110F" fg={COL.creme} onClick={() => setVue('quipaie')} />
            <Tuile emoji="🏷️" titre="Le Générateur de Surnom" desc="Ton blaze de pilier de comptoir." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('surnom')} />
            <Tuile emoji="📖" titre="Le Mot du Jour" desc="L’argot de comptoir, expliqué." bg={COL.or} fg="#2A1F10" onClick={() => setVue('motdujour')} />
            <Tuile emoji="🎽" titre="Le Niveau de Beauferie" desc="Petit quiz : t’es plutôt hipster ou roi du barbeuc ?" bg={COL.ambre} fg="#2A1F10" onClick={() => setVue('beauferie')} />
            <Tuile emoji="🗣️" titre="Le Traducteur Régional" desc="Ta phrase en marseillais, ch’ti, belge, toulousain ou breton." bg="#14110F" fg={COL.creme} onClick={() => setVue('traducteur')} />
            <Tuile emoji="🍷" titre="Citations d’Ivrognes" desc="La sagesse (très relative) du comptoir." bg={COL.rougeNeon} fg="#fff" onClick={() => setVue('citations')} />
          </nav>
          <section style={{ margin: '24px 16px 0' }}>
            <div style={{ background: COL.orangeClair, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: '14px 16px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: COL.texte2, lineHeight: 1.55 }}>
                <strong style={{ color: COL.or }}>🤡 100 % pour rire.</strong> Ces tests n’ont aucune valeur :
                un éthylotest certifié, ça ne se souffle pas dans un téléphone. L’abus d’alcool est dangereux. Jamais au volant.
              </p>
            </div>
          </section>
          <div style={{ margin: '22px 16px 0' }}>
            <button onClick={() => navigate('/app')} className="pmu-arcade pmu-arcade--ardoise" style={{ width: '100%' }}>
              Retour au comptoir
            </button>
          </div>
        </>
      )}

      {vue === 'souffle' && <Souffle onRetour={() => setVue('menu')} />}
      {vue === 'equilibre' && <Equilibre onRetour={() => setVue('menu')} />}
      {vue === 'patron' && <Patron onRetour={() => setVue('menu')} />}
      {vue === 'horoscope' && <Horoscope onRetour={() => setVue('menu')} />}
      {vue === 'derniere' && <Derniere onRetour={() => setVue('menu')} />}
      {vue === 'bellemere' && <BelleMere onRetour={() => setVue('menu')} />}
      {vue === 'pisse' && <Pisse onRetour={() => setVue('menu')} />}
      {vue === 'legendes' && <Legendes onRetour={() => setVue('menu')} />}
      {vue === 'toasts' && <Toasts onRetour={() => setVue('menu')} />}
      {vue === 'motdujour' && <MotDuJour onRetour={() => setVue('menu')} />}
      {vue === 'surnom' && <Surnom onRetour={() => setVue('menu')} />}
      {vue === 'traducteur' && <Traducteur onRetour={() => setVue('menu')} />}
      {vue === 'mytho' && <Mytho onRetour={() => setVue('menu')} />}
      {vue === 'beauferie' && <Beauferie onRetour={() => setVue('menu')} />}
      {vue === 'quipaie' && <QuiPaie onRetour={() => setVue('menu')} />}
      {vue === 'selfie' && <SelfieFlou onRetour={() => setVue('menu')} />}
      {vue === 'citations' && <Citations onRetour={() => setVue('menu')} />}
    </AppShell>
  );
}

function Tuile({ emoji, titre, desc, bg, fg, onClick }: {
  emoji: string; titre: string; desc: string; bg: string; fg: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
      background: bg, color: fg, border: 'none', borderRadius: 18, padding: '18px 18px',
      boxShadow: '0 5px 0 rgba(0,0,0,0.45)',
    }}>
      <span style={{ fontSize: '2.1rem', lineHeight: 1 }} aria-hidden="true">{emoji}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.01em' }}>{titre}</span>
        <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.9, marginTop: 2 }}>{desc}</span>
      </span>
    </button>
  );
}

// ── 1) Éthylotest à souffle ────────────────────────────────────────────────
function Souffle({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'mesure' | 'resultat' | 'refus'>('pret');
  const [niveau, setNiveau] = useState(0);
  const [taux, setTaux] = useState(0);
  const ref = useRef<{ ctx?: AudioContext; stream?: MediaStream; raf?: number }>({});

  useEffect(() => () => nettoyer(), []);
  function nettoyer() {
    const r = ref.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    r.stream?.getTracks().forEach((t) => t.stop());
    r.ctx?.close().catch(() => {});
    ref.current = {};
  }

  async function souffler() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      ref.current = { ctx, stream };
      setPhase('mesure');
      setNiveau(0);

      const data = new Uint8Array(an.frequencyBinCount);
      const t0 = performance.now();
      let peak = 0, somme = 0, n = 0;
      const tick = () => {
        an.getByteTimeDomainData(data);
        let s = 0;
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; s += v * v; }
        const rms = Math.sqrt(s / data.length);
        peak = Math.max(peak, rms); somme += rms; n++;
        setNiveau(Math.min(1, rms * 4));
        if (performance.now() - t0 < 3000) {
          ref.current.raf = requestAnimationFrame(tick);
        } else {
          const moy = somme / Math.max(1, n);
          const score = Math.min(1, peak * 0.6 + moy * 4);
          const t = Math.round(score * 380) / 100; // 0 → 3,8 g/L (totalement bidon)
          nettoyer();
          setTaux(t);
          setPhase('resultat');
          const et = etatBac(t);
          const v = paramsIvresse(t);
          parlerTavernier(bredouiller(et.annonce, t), v.pitch, v.rate);
        }
      };
      ref.current.raf = requestAnimationFrame(tick);
    } catch {
      setPhase('refus');
    }
  }

  return (
    <>
      <Entete titre="L’Éthylotest à souffle" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">🎤</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Approche le téléphone de ta bouche et <strong style={{ color: COL.texte }}>souffle fort pendant 3 secondes</strong> au signal.
            </p>
            <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>
              🌬️ Je souffle !
            </button>
          </>
        )}

        {phase === 'mesure' && (
          <>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.4rem', color: COL.or }}>Souffle… souffle… !</div>
            <div style={{ height: 26, background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 999, overflow: 'hidden', marginTop: 18 }}>
              <div style={{ height: '100%', width: `${Math.round(niveau * 100)}%`, background: COL.rougeNeon, transition: 'width .08s linear' }} />
            </div>
            <p style={{ color: COL.texte2, marginTop: 12, fontSize: '0.85rem' }}>Le souffle-o-mètre te jauge…</p>
          </>
        )}

        {phase === 'resultat' && (() => {
          const et = etatBac(taux);
          return (
            <div style={{ background: et.fond, border: `2px solid ${et.accent}`, borderRadius: 20, padding: '22px 18px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Verdict du souffle</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3.4rem', lineHeight: 1, color: et.accent, marginTop: 6 }}>{fmtBac(taux)} <span style={{ fontSize: '1rem' }}>g/L</span></div>
              <div style={{ fontSize: '2rem', marginTop: 8 }} aria-hidden="true">{et.emoji}</div>
              <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: et.texteSur, marginTop: 4 }}>{et.titre}</div>
              <p style={{ fontSize: '0.8rem', color: COL.texte2, marginTop: 10 }}>Mesure 100 % fantaisiste, évidemment. 😉</p>
              <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>🌬️ Re-souffler</button>
            </div>
          );
        })()}

        {phase === 'refus' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '18px 16px' }}>
            <p style={{ margin: 0, color: COL.texte, lineHeight: 1.5 }}>🎤 Pas d’accès au micro. Autorise le microphone (ou réessaie sur ton téléphone) pour souffler dans la machine.</p>
            <button onClick={souffler} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>Réessayer</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 2) Test d'équilibre ────────────────────────────────────────────────────
function Equilibre({ onRetour }: { onRetour: () => void }) {
  const [phase, setPhase] = useState<'pret' | 'mesure' | 'resultat' | 'refus'>('pret');
  const [reste, setReste] = useState(5);
  const [grade, setGrade] = useState('A');
  const ref = useRef<{ handler?: (e: DeviceMotionEvent) => void; timer?: number; prev?: { x: number; y: number; z: number }; somme: number; n: number; recu: boolean }>({ somme: 0, n: 0, recu: false });

  useEffect(() => () => stop(), []);
  function stop() {
    const r = ref.current;
    if (r.handler) window.removeEventListener('devicemotion', r.handler);
    if (r.timer) window.clearInterval(r.timer);
  }

  const VERDICTS: Record<string, { titre: string; sous: string }> = {
    A: { titre: 'Stable comme un roc', sous: 'Trop stable, même. T’as vraiment bu, toi ?' },
    B: { titre: 'Léger roulis', sous: 'Rien à signaler, marin d’eau douce.' },
    C: { titre: 'Ça tangue gentiment', sous: 'Le pont bouge un peu, capitaine.' },
    D: { titre: 'Houla, ça remue', sous: 'Le sol fait des vagues, hein ?' },
    E: { titre: 'Démarche en crabe', sous: 'Tiens-toi au comptoir, mon grand.' },
    F: { titre: 'Niveau chamallow', sous: 'Assieds-toi. Tout de suite.' },
  };

  async function tester() {
    const DM = (window as unknown as { DeviceMotionEvent?: { requestPermission?: () => Promise<string> } }).DeviceMotionEvent;
    if (DM && typeof DM.requestPermission === 'function') {
      try {
        const p = await DM.requestPermission();
        if (p !== 'granted') { setPhase('refus'); return; }
      } catch { setPhase('refus'); return; }
    }
    ref.current = { somme: 0, n: 0, recu: false };
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a) return;
      ref.current.recu = true;
      const cur = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
      const p = ref.current.prev;
      if (p) {
        ref.current.somme += Math.abs(cur.x - p.x) + Math.abs(cur.y - p.y) + Math.abs(cur.z - p.z);
        ref.current.n++;
      }
      ref.current.prev = cur;
    };
    window.addEventListener('devicemotion', handler);
    ref.current.handler = handler;
    setPhase('mesure');
    setReste(5);
    let s = 5;
    ref.current.timer = window.setInterval(() => {
      s -= 1;
      setReste(s);
      if (s <= 0) {
        stop();
        if (!ref.current.recu) { setPhase('refus'); return; }
        const moy = ref.current.somme / Math.max(1, ref.current.n);
        const g = moy < 0.25 ? 'A' : moy < 0.6 ? 'B' : moy < 1.1 ? 'C' : moy < 2 ? 'D' : moy < 3.5 ? 'E' : 'F';
        setGrade(g);
        setPhase('resultat');
        parlerTavernier(`Stabilité : ${g}. ${VERDICTS[g].sous}`, 0.5, 0.9);
      }
    }, 1000);
  }

  return (
    <>
      <Entete titre="Le test d’équilibre" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0', textAlign: 'center' }}>
        {phase === 'pret' && (
          <>
            <div style={{ fontSize: '3.6rem' }} aria-hidden="true">📳</div>
            <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
              Tends le bras et <strong style={{ color: COL.texte }}>tiens le téléphone le plus immobile possible 5 secondes</strong>. La machine juge ton tremblement.
            </p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 20, minHeight: 64 }}>📳 Je me teste !</button>
          </>
        )}

        {phase === 'mesure' && (
          <>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4rem', color: COL.or, lineHeight: 1 }}>{reste}</div>
            <p style={{ color: COL.texte2, marginTop: 10 }}>Ne bouge plus… on te scanne.</p>
          </>
        )}

        {phase === 'resultat' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.or}`, borderRadius: 20, padding: '22px 18px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COL.texte2 }}>Stabilité posturale</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4rem', lineHeight: 1, color: COL.or, marginTop: 4 }}>{grade}</div>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.25rem', color: COL.creme, marginTop: 8 }}>{VERDICTS[grade].titre}</div>
            <p style={{ fontSize: '0.9rem', color: COL.texte2, marginTop: 6 }}>{VERDICTS[grade].sous}</p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>📳 Recommencer</button>
          </div>
        )}

        {phase === 'refus' && (
          <div style={{ background: COL.panneau, border: `2px solid ${COL.bleu1}`, borderRadius: 18, padding: '18px 16px' }}>
            <p style={{ margin: 0, color: COL.texte, lineHeight: 1.5 }}>📳 Capteur de mouvement indisponible (ou refusé). Ce test, c’est <strong>sur téléphone</strong> que ça se passe — autorise le mouvement et réessaie.</p>
            <button onClick={tester} className="pmu-arcade" style={{ width: '100%', marginTop: 16 }}>Réessayer</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 3) Demande au patron ───────────────────────────────────────────────────
function Patron({ onRetour }: { onRetour: () => void }) {
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState<string | null>(null);

  function demander() {
    const r = reponsePatron();
    setReponse(r);
    parlerTavernier(r, 0.5, 0.9);
  }

  return (
    <>
      <Entete titre="Demande au patron" onRetour={onRetour} />
      <section style={{ margin: '18px 16px 0' }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pose ta question au patron…"
          style={{ width: '100%', minHeight: 54, padding: '12px 16px', fontSize: '1rem', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 14, color: COL.texte }}
        />
        <button onClick={demander} className="pmu-arcade" style={{ width: '100%', marginTop: 12, minHeight: 60 }}>
          🔮 Demander au patron
        </button>

        {reponse && (
          <div className="pmu-ardoise" style={{ marginTop: 18 }}>
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Le patron a parlé</div>
            <p className="craie" style={{ margin: '10px 0 0', fontFamily: FRAUNCES, fontSize: '1.2rem', lineHeight: 1.4 }}>« {reponse} »</p>
          </div>
        )}

        <p style={{ margin: '16px 2px 0', fontSize: '0.8rem', color: COL.texte2, lineHeight: 1.5 }}>
          Le patron répond ce qu’il veut, quand il veut. La question, c’est surtout pour la forme.
        </p>
      </section>
    </>
  );
}

// ── 4) L'Horoscope du Pilier ────────────────────────────────────────────────
function Horoscope({ onRetour }: { onRetour: () => void }) {
  const [signe, setSigne] = useState<string | null>(null);
  const [horo, setHoro] = useState<HoroDuJour | null>(null);
  function choisir(cle: string, nom: string) {
    const h = horoscopeDuJour(cle);
    setSigne(nom);
    setHoro(h);
    parlerTavernier(h.texte, 0.55, 0.95);
  }
  const chip: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(243,232,207,0.08)', border: '1px solid rgba(243,232,207,0.25)', borderRadius: 999, padding: '6px 12px', fontSize: '0.82rem' };
  return (
    <>
      <Entete titre="L’Horoscope du Pilier" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        {!signe || !horo ? (
          <>
            <p style={{ color: COL.texte2, margin: '0 2px 12px', lineHeight: 1.5 }}>Choisis ton signe, le comptoir lit ton avenir.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {SIGNES.map((s) => (
                <button key={s.cle} onClick={() => choisir(s.cle, s.nom)}
                  style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 14, padding: '12px 4px', color: COL.creme, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '1.6rem' }} aria-hidden="true">{s.emoji}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{s.nom}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="pmu-ardoise">
            <div className="craie-2" style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{signe} · aujourd’hui</div>
            <p className="craie" style={{ margin: '10px 0 0', fontFamily: FRAUNCES, fontSize: '1.2rem', lineHeight: 1.4 }}>{horo.texte}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <span className="craie" style={chip}>🍹 Boisson porte-bonheur : {horo.boisson}</span>
              <span className="craie" style={chip}>🍀 Chiffre chance : {horo.chance} tournée{horo.chance > 1 ? 's' : ''}</span>
            </div>
            <button onClick={() => { setSigne(null); setHoro(null); }} className="pmu-arcade pmu-arcade--or" style={{ marginTop: 16, padding: '0 18px', minHeight: 48 }}>← Changer de signe</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 5) Compteur « c'est ma dernière » ───────────────────────────────────────
function Derniere({ onRetour }: { onRetour: () => void }) {
  const [n, setN] = useState<number>(() => lireStockage<number>('cabine-derniere', 0));
  function ajouter() {
    const v = n + 1;
    setN(v);
    ecrireStockage('cabine-derniere', v);
    parlerTavernier(commentaireDerniere(v), 0.5, 0.95);
  }
  function reset() { setN(0); ecrireStockage('cabine-derniere', 0); }
  return (
    <>
      <Entete titre="« C’est ma dernière »" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4.5rem', color: COL.rougeNeon, lineHeight: 1 }}>{n}</div>
        <p style={{ color: COL.texte2, margin: '6px 0 0', minHeight: 40, lineHeight: 1.4 }}>{commentaireDerniere(n)}</p>
        <button onClick={ajouter} className="pmu-arcade" style={{ width: '100%', marginTop: 18, minHeight: 70, fontSize: '1.05rem' }}>🤥 « C’est ma dernière ! »</button>
        {n > 0 && (
          <button onClick={reset} style={{ marginTop: 12, border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'underline' }}>Remettre à zéro (nouvelle soirée)</button>
        )}
      </section>
    </>
  );
}

// ── 6) Détecteur de Belle-mère (faux appel) ─────────────────────────────────
function BelleMere({ onRetour }: { onRetour: () => void }) {
  const [appel, setAppel] = useState(false);
  const [attente, setAttente] = useState<number | null>(null);
  const ref = useRef<{ stop?: () => void; t1?: number; t2?: number }>({});

  useEffect(() => () => cleanup(), []);
  function cleanup() {
    const r = ref.current;
    if (r.stop) r.stop();
    if (r.t1) window.clearTimeout(r.t1);
    if (r.t2) window.clearInterval(r.t2);
    ref.current = {};
  }
  function declencher() {
    setAttente(null);
    setAppel(true);
    ref.current.stop = sonnerie();
    vibrer([600, 300, 600, 300, 600, 300, 600]);
  }
  function programmer(sec: number) {
    cleanup();
    setAppel(false);
    if (sec <= 0) { declencher(); return; }
    setAttente(sec);
    ref.current.t2 = window.setInterval(() => setAttente((a) => (a && a > 1 ? a - 1 : a)), 1000);
    ref.current.t1 = window.setTimeout(() => { if (ref.current.t2) window.clearInterval(ref.current.t2); declencher(); }, sec * 1000);
  }
  function raccrocher() { cleanup(); setAppel(false); setAttente(null); }

  if (appel) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: '#0c0a09', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '64px 24px 54px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.7)', letterSpacing: '0.05em' }}>Appel entrant…</div>
          <div style={{ fontSize: '5rem', marginTop: 24 }} aria-hidden="true">👵</div>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '2rem', color: '#fff', marginTop: 14 }}>Belle-maman</div>
          <div style={{ color: 'rgba(255,255,255,.6)', marginTop: 4 }}>mobile</div>
        </div>
        <div style={{ display: 'flex', gap: 56 }}>
          <button onClick={raccrocher} aria-label="Refuser l’appel" style={{ width: 74, height: 74, borderRadius: '50%', border: 'none', background: '#E1503A', color: '#fff', fontSize: '1.8rem' }}>✕</button>
          <button onClick={raccrocher} aria-label="Décrocher" style={{ width: 74, height: 74, borderRadius: '50%', border: 'none', background: '#2E8540', color: '#fff', fontSize: '1.8rem' }}>✓</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <Entete titre="Détecteur de Belle-mère" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3.4rem' }} aria-hidden="true">👵📞</div>
        <p style={{ color: COL.texte2, margin: '8px 0 0', lineHeight: 1.5 }}>
          Besoin d’une excuse pour filer ? Programme un <strong style={{ color: COL.texte }}>faux appel de Belle-maman</strong> :
          range le téléphone, il sonnera tout seul. À toi de jouer la comédie.
        </p>
        {attente ? (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '3rem', color: COL.or }}>{attente}s</div>
            <p style={{ color: COL.texte2 }}>Ça va sonner… range vite le téléphone !</p>
            <button onClick={raccrocher} style={{ marginTop: 8, border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, textDecoration: 'underline' }}>Annuler</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 20 }}>
            <button onClick={() => programmer(0)} className="pmu-arcade" style={{ minHeight: 60 }}>Maintenant</button>
            <button onClick={() => programmer(10)} className="pmu-arcade pmu-arcade--ambre" style={{ minHeight: 60 }}>Dans 10 s</button>
            <button onClick={() => programmer(30)} className="pmu-arcade pmu-arcade--ambre" style={{ minHeight: 60 }}>Dans 30 s</button>
          </div>
        )}
      </section>
    </>
  );
}

// ── 7) Le Pisse-mètre ───────────────────────────────────────────────────────
function Pisse({ onRetour }: { onRetour: () => void }) {
  const [n, setN] = useState<number>(() => lireStockage<number>('cabine-pisse', 0));
  const e = etatPisse(n);
  function ajouter() { const v = n + 1; setN(v); ecrireStockage('cabine-pisse', v); }
  function reset() { setN(0); ecrireStockage('cabine-pisse', 0); }
  return (
    <>
      <Entete titre="Le Pisse-mètre" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '4.5rem', color: COL.or, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.2rem', color: COL.creme, marginTop: 8 }}>{e.badge}</div>
        <p style={{ color: COL.texte2, margin: '4px 0 0' }}>{e.mot}</p>
        <button onClick={ajouter} className="pmu-arcade pmu-arcade--ambre" style={{ width: '100%', marginTop: 18, minHeight: 70, fontSize: '1.05rem' }}>🚽 J’y vais !</button>
        {n > 0 && (
          <button onClick={reset} style={{ marginTop: 12, border: 'none', background: 'transparent', color: COL.texte2, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'underline' }}>Remettre à zéro (nouvelle soirée)</button>
        )}
      </section>
    </>
  );
}

// ── 8) Le Mur des Légendes ──────────────────────────────────────────────────
function Legendes({ onRetour }: { onRetour: () => void }) {
  const [liste, setListe] = useState<string[]>(() => lireStockage<string[]>('cabine-legendes', []));
  const [texte, setTexte] = useState('');
  function graver() {
    const t = texte.trim();
    if (!t) return;
    const suivant = [t, ...liste].slice(0, 100);
    setListe(suivant);
    ecrireStockage('cabine-legendes', suivant);
    setTexte('');
  }
  function retirer(idx: number) {
    const suivant = liste.filter((_, k) => k !== idx);
    setListe(suivant);
    ecrireStockage('cabine-legendes', suivant);
  }
  return (
    <>
      <Entete titre="Le Mur des Légendes" onRetour={onRetour} />
      <section style={{ margin: '14px 16px 0' }}>
        <p style={{ color: COL.texte2, margin: '0 2px 12px', lineHeight: 1.5 }}>Grave les punchlines et exploits de la bande. Pour la postérité.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={texte} onChange={(ev) => setTexte(ev.target.value)} placeholder="« Dédé a payé une tournée ! »"
            style={{ flex: 1, minHeight: 50, padding: '10px 14px', fontSize: '0.95rem', background: '#14110F', border: `2px solid ${COL.bleu1}`, borderRadius: 12, color: COL.texte }} />
          <button onClick={graver} className="pmu-arcade" style={{ padding: '0 16px', minHeight: 50 }}>Graver</button>
        </div>
        {liste.length === 0 ? (
          <div style={{ marginTop: 16, background: COL.panneau, border: `2px dashed ${COL.bleu1}`, borderRadius: 14, padding: '20px 16px', textAlign: 'center', color: COL.texte2 }}>
            Le mur est vide. La première légende reste à écrire…
          </div>
        ) : (
          <div className="pmu-ardoise" style={{ marginTop: 16 }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {liste.map((l, i) => (
                <li key={i} className="craie" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: i < liste.length - 1 ? '1px dashed rgba(243,232,207,0.2)' : 'none' }}>
                  <span className="craie-accent" style={{ fontWeight: 800 }}>★</span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{l}</span>
                  <button onClick={() => retirer(i)} aria-label="Effacer cette légende" style={{ border: 'none', background: 'transparent', color: 'rgba(243,232,207,0.6)', fontWeight: 700, fontSize: '1.1rem' }}>×</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
