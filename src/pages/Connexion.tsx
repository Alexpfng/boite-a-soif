import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../features/auth/AuthContext';
import { COL, FRAUNCES } from '../ui/theme';

type Mode = 'connexion' | 'inscription';

function messageErreur(brut: string): string {
  const m = brut.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user already')) return 'Un compte existe déjà avec cet email. Connecte-toi.';
  if (m.includes('password should be at least')) return 'Le mot de passe doit faire au moins 6 caractères.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Adresse email invalide.';
  if (m.includes('email not confirmed')) return 'Vérifie ta boîte mail pour confirmer ton compte avant de te connecter.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

export default function Connexion() {
  const { user, chargement } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || '/app';

  const [mode, setMode] = useState<Mode>('connexion');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!chargement && user) return <Navigate to={destination} replace />;

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setInfo(null);
    setEnCours(true);
    try {
      if (mode === 'inscription') {
        if (pseudo.trim().length < 2) { setErreur('Choisis un pseudo (2 caractères minimum).'); setEnCours(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: motDePasse,
          options: {
            data: { pseudo: pseudo.trim().slice(0, 24) },
            emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}app`,
          },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.');
          setMode('connexion');
        } else {
          navigate(destination, { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: motDePasse });
        if (error) throw error;
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErreur(messageErreur(err instanceof Error ? err.message : String(err)));
    } finally {
      setEnCours(false);
    }
  }

  async function avecGoogle() {
    setErreur(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}app` },
    });
    if (error) setErreur('Connexion Google indisponible pour le moment. Utilise ton email en attendant.');
  }

  const champ: React.CSSProperties = {
    width: '100%', minHeight: 56, padding: '14px 16px', fontSize: '1.05rem',
    border: `2px solid ${COL.bleu1}`, borderRadius: 14, background: '#14110F', color: COL.creme,
  };
  const label: React.CSSProperties = { display: 'block', margin: '0 0 6px 2px', fontWeight: 700, fontSize: '0.92rem', color: COL.texte2 };

  return (
    <main style={{ minHeight: '100vh', background: COL.ardoise, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 18px', color: COL.creme }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link to="/" aria-label="Retour au site" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 22 }}>
          <img src={`${import.meta.env.BASE_URL}brand/logo.png`} alt="" width={52} height={52} style={{ borderRadius: 12, display: 'block' }} />
          <span style={{ fontFamily: 'Mulish, system-ui, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: COL.creme }}>La Boît&rsquo;à <span style={{ color: COL.rougeNeon }}>Soif</span></span>
        </Link>

        <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 22, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', padding: '26px 22px' }}>
          <h1 className="pmu-titre" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
            {mode === 'connexion' ? 'Se connecter' : 'Créer un compte'}
          </h1>
          <p style={{ margin: '6px 0 20px', fontSize: '0.92rem', color: COL.texte2, textAlign: 'center', textTransform: 'none' }}>
            {mode === 'connexion' ? 'Retrouve tes potes et tes données.' : 'Ton espace de pilier, gratuit.'}
          </p>

          {info && (
            <div role="status" style={{ margin: '0 0 16px', background: '#20281C', border: '1px solid #3c5a32', color: '#cfe6bf', borderRadius: 12, padding: '12px 14px', fontSize: '0.9rem', lineHeight: 1.45 }}>
              {info}
            </div>
          )}
          {erreur && (
            <div role="alert" style={{ margin: '0 0 16px', background: '#341F1B', border: `1px solid ${COL.rouge}`, color: '#f3c7bd', borderRadius: 12, padding: '12px 14px', fontSize: '0.9rem', lineHeight: 1.45 }}>
              {erreur}
            </div>
          )}

          <button type="button" onClick={avecGoogle} aria-label="Continuer avec Google"
            style={{ width: '100%', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#1f1f1f', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', marginBottom: 16 }}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continuer avec Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 16px', color: COL.texte2, fontSize: '0.8rem' }}>
            <span style={{ flex: 1, height: 1, background: COL.bleu1 }} /> ou par email <span style={{ flex: 1, height: 1, background: COL.bleu1 }} />
          </div>

          <form onSubmit={soumettre} noValidate>
            {mode === 'inscription' && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="pseudo" style={label}>Pseudo de comptoir</label>
                <input id="pseudo" type="text" autoComplete="nickname" required maxLength={24}
                  value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Dédé la Gnôle" style={champ} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="email" style={label}>Adresse email</label>
              <input id="email" type="email" inputMode="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@exemple.fr" style={champ} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="mdp" style={label}>Mot de passe</label>
              <input id="mdp" type="password" autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'} required minLength={6}
                value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
                placeholder={mode === 'inscription' ? '6 caractères minimum' : '••••••••'} style={champ} />
            </div>

            <button type="submit" disabled={enCours} className="pmu-arcade"
              style={{ width: '100%', minHeight: 56, fontSize: '1.05rem', opacity: enCours ? 0.7 : 1 }}>
              {enCours ? 'Un instant…' : mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: '0.92rem', color: COL.texte2 }}>
            {mode === 'connexion' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'connexion' ? 'inscription' : 'connexion'); setErreur(null); setInfo(null); }}
              style={{ border: 'none', background: 'transparent', color: COL.or, fontWeight: 800, textDecoration: 'underline', fontSize: '0.92rem', padding: 0, cursor: 'pointer', fontFamily: FRAUNCES }}>
              {mode === 'connexion' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>

      </div>
    </main>
  );
}
