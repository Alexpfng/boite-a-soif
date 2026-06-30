import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../features/auth/AuthContext';
import { Symbole, Wordmark } from '../ui/icons';
import { COL, FRAUNCES } from '../ui/theme';

type Mode = 'connexion' | 'inscription';

function messageErreur(brut: string): string {
  const m = brut.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cet email. Connectez-vous.';
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Adresse email invalide.';
  if (m.includes('email not confirmed')) return 'Vérifiez votre boîte mail pour confirmer votre compte avant de vous connecter.';
  return "Une erreur est survenue. Réessayez dans un instant.";
}

export default function Connexion() {
  const { user, chargement } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || '/app';

  const [mode, setMode] = useState<Mode>('connexion');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Déjà connecté : aller directement à l'application
  if (!chargement && user) return <Navigate to={destination} replace />;

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setInfo(null);
    setEnCours(true);
    try {
      if (mode === 'inscription') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: motDePasse,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        // Si la confirmation par email est exigée, aucune session n'est ouverte.
        if (!data.session) {
          setInfo('Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
          setMode('connexion');
        } else {
          navigate(destination, { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: motDePasse,
        });
        if (error) throw error;
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErreur(messageErreur(err instanceof Error ? err.message : String(err)));
    } finally {
      setEnCours(false);
    }
  }

  const champ: React.CSSProperties = {
    width: '100%', minHeight: 56, padding: '14px 16px', fontSize: '1.05rem',
    border: `2px solid ${COL.bleu1}`, borderRadius: 14, background: '#fff', color: COL.texte,
    outlineColor: COL.bleu7,
  };
  const label: React.CSSProperties = { display: 'block', margin: '0 0 6px 2px', fontWeight: 600, fontSize: '0.95rem', color: COL.bleu9 };

  return (
    <main style={{ minHeight: '100vh', background: COL.sable, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 18px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link to="/" aria-label="Retour au site" style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', color: COL.bleu9, marginBottom: 22 }}>
          <Symbole size={46} color={COL.bleu9} />
          <Wordmark taille="hero" />
        </Link>

        <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 2px 12px rgba(14,58,77,0.08)', padding: '26px 22px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.5rem', color: COL.bleu9, textAlign: 'center' }}>
            {mode === 'connexion' ? 'Se connecter' : 'Créer un compte'}
          </h1>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: COL.texte2, textAlign: 'center' }}>
            {mode === 'connexion' ? 'Accédez à votre espace personnel.' : 'Votre espace personnel, gratuit et privé.'}
          </p>

          {info && (
            <div role="status" style={{ margin: '0 0 16px 0', background: '#E9F6EC', border: '1px solid #Bfe3C7', color: '#1E5E2C', borderRadius: 12, padding: '12px 14px', fontSize: '0.92rem' }}>
              {info}
            </div>
          )}
          {erreur && (
            <div role="alert" style={{ margin: '0 0 16px 0', background: '#FBEAE7', border: '1px solid #F2C7BF', color: COL.rouge, borderRadius: 12, padding: '12px 14px', fontSize: '0.92rem' }}>
              {erreur}
            </div>
          )}

          <form onSubmit={soumettre} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="email" style={label}>Adresse email</label>
              <input id="email" type="email" inputMode="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr" style={champ} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="mdp" style={label}>Mot de passe</label>
              <input id="mdp" type="password" autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'} required minLength={6}
                value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
                placeholder={mode === 'inscription' ? '6 caractères minimum' : '••••••••'} style={champ} />
            </div>

            <button type="submit" disabled={enCours}
              style={{
                width: '100%', minHeight: 56, border: 'none', borderRadius: 14,
                background: enCours ? COL.gris : COL.orange, color: '#fff',
                fontSize: '1.05rem', fontWeight: 700, cursor: enCours ? 'default' : 'pointer',
              }}>
              {enCours ? 'Veuillez patienter…' : mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ margin: '18px 0 0 0', textAlign: 'center', fontSize: '0.95rem', color: COL.texte2 }}>
            {mode === 'connexion' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'connexion' ? 'inscription' : 'connexion'); setErreur(null); setInfo(null); }}
              style={{ border: 'none', background: 'transparent', color: COL.bleu7, fontWeight: 700, textDecoration: 'underline', fontSize: '0.95rem', padding: 0, cursor: 'pointer' }}
            >
              {mode === 'connexion' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>

        <p style={{ margin: '20px 0 0 0', textAlign: 'center' }}>
          <Link to="/" style={{ color: COL.bleu7, fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none' }}>← Retour au site</Link>
        </p>
      </div>
    </main>
  );
}
