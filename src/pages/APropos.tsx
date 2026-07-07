import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../features/auth/AuthContext";
import { COL, FRAUNCES } from "../ui/theme";
import { MESSAGE_SANITAIRE } from "../components/legal/MessageSanitaire";

// À propos & informations légales de La Boît'à Soif.
// ⚠️ Les champs « [à compléter] » sont à renseigner par l'éditeur (identité,
// adresse, email de contact / DPO) avant une mise en ligne publique.

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: "22px 16px 0" }}>
      <h2 style={{ margin: "0 0 8px 2px", fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: COL.or }}>
        {titre}
      </h2>
      <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: "14px 16px", fontSize: "0.9rem", color: COL.texte2, lineHeight: 1.6 }}>
        {children}
      </div>
    </section>
  );
}

export default function APropos() {
  const { user, estInvite, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  async function deconnexion() {
    await seDeconnecter();
    navigate("/", { replace: true });
  }

  return (
    <AppShell>
      <section style={{ background: "#14110F", borderBottom: `2px solid ${COL.or}`, padding: "24px 22px" }}>
        <h1 className="pmu-titre" style={{ fontSize: "1.9rem", margin: 0 }}>
          À propos &amp; <span className="accent">mentions légales</span>
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "0.95rem", color: COL.texte2, lineHeight: 1.5 }}>
          La Boît&apos;à Soif est une application récréative et satirique sur la vie de comptoir,
          gratuite et sans publicité. Elle se moque de l&apos;apéro entre amis — jamais elle
          n&apos;encourage à boire plus.
        </p>
      </section>

      {/* Mon compte */}
      {user && (
        <section style={{ margin: "18px 16px 0" }}>
          <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: COL.texte2 }}>
              {estInvite ? "En invité 🎭" : "Mon compte"}
            </div>
            <div style={{ margin: "4px 0 12px", fontWeight: 700, color: COL.creme, overflow: "hidden", textOverflow: "ellipsis" }}>
              {estInvite ? "Compte invité (données sur cet appareil)" : user.email}
            </div>
            {estInvite ? (
              <Link to="/connexion" className="pmu-arcade pmu-arcade--or" style={{ display: "inline-block", minHeight: 44, padding: "12px 18px", textDecoration: "none", fontSize: "0.9rem" }}>
                Garder mon compte
              </Link>
            ) : (
              <button onClick={deconnexion} style={{ minHeight: 44, padding: "0 18px", borderRadius: 10, border: `2px solid ${COL.rouge}`, background: "transparent", color: COL.rouge, fontWeight: 700, fontSize: "0.9rem" }}>
                Se déconnecter
              </button>
            )}
          </div>
        </section>
      )}

      <Bloc titre="Prévention">
        <p style={{ margin: 0 }}>
          Une question sur ta consommation ou celle d&apos;un proche ? Retrouve les ressources
          d&apos;aide et les numéros utiles sur la{" "}
          <Link to="/prevention" style={{ color: COL.or, fontWeight: 700, textDecoration: "underline" }}>
            page prévention
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Éditeur">
        <p style={{ margin: 0 }}>
          Éditeur : <strong style={{ color: COL.creme }}>[à compléter : nom / raison sociale]</strong>
          <br />
          Statut : [à compléter — ex. particulier / auto-entrepreneur / société]
          <br />
          Adresse : [à compléter]
          <br />
          Directeur de la publication : [à compléter]
          <br />
          Contact : <strong style={{ color: COL.creme }}>[à compléter : email]</strong>
        </p>
      </Bloc>

      <Bloc titre="Hébergement">
        <p style={{ margin: 0 }}>
          Site hébergé par <strong style={{ color: COL.creme }}>GitHub Pages</strong> — GitHub,
          Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.
          <br />
          Comptes, base de données et synchronisation : <strong style={{ color: COL.creme }}>Supabase</strong> (Supabase, Inc.).
        </p>
      </Bloc>

      <Bloc titre="Données personnelles (RGPD)">
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: COL.creme }}>Données traitées :</strong> adresse email et pseudo
          (compte), tes données d&apos;usage (consommations saisies dans le Pèse-Alco, ardoise,
          progression, amis, concours) et, uniquement si tu l&apos;actives, ta position
          approximative pour la carte des piliers.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: COL.creme }}>Finalités :</strong> te fournir l&apos;application,
          synchroniser tes données entre tes appareils et permettre les fonctions entre amis.{" "}
          <strong style={{ color: COL.creme }}>Base légale :</strong> ton consentement et
          l&apos;exécution du service. Aucune donnée n&apos;est vendue ni utilisée à des fins
          publicitaires ; pas de traceur marketing.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: COL.creme }}>Conservation :</strong> tant que ton compte est
          actif. Tu peux tout effacer en supprimant ton compte (contacte l&apos;éditeur).
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: COL.creme }}>Tes droits :</strong> accès, rectification,
          effacement, portabilité et opposition (RGPD). Pour les exercer, écris à l&apos;éditeur
          à l&apos;adresse ci-dessus. Tu peux aussi saisir la CNIL (cnil.fr).
        </p>
      </Bloc>

      <Bloc titre="Avertissement">
        <p style={{ margin: "0 0 8px" }}>
          Application <strong style={{ color: COL.creme }}>réservée aux personnes majeures (18 ans et plus)</strong>.
          Les estimations du Pèse-Alco (alcoolémie) sont <strong style={{ color: COL.creme }}>indicatives et
          ludiques</strong> : elles reposent sur une formule statistique, ne remplacent en aucun cas
          un éthylotest et ne doivent jamais servir à décider de prendre le volant.
        </p>
        <p style={{ margin: 0, fontWeight: 800, color: COL.or }}>⚠️ {MESSAGE_SANITAIRE}</p>
      </Bloc>

      <footer style={{ margin: "24px 22px 0", padding: "16px 0 8px", borderTop: "1px solid rgba(243,232,207,0.14)" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: COL.texte2 }}>
          La Boît&apos;à Soif — l&apos;appli des piliers de bar. À consommer avec modération.
        </p>
      </footer>
      <div style={{ height: 12 }} />
    </AppShell>
  );
}
