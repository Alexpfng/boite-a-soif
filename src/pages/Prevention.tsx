import { AppShell } from "../components/layout/AppShell";
import { COL, FRAUNCES } from "../ui/theme";
import { MESSAGE_SANITAIRE } from "../components/legal/MessageSanitaire";

// Page de prévention : ressources officielles d'aide et d'écoute autour de
// l'alcool. Numéro et lien d'Alcool Info Service (Santé publique France).
const TEL_AIS = "0980980930";

function Carte({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: COL.panneau, border: `1px solid ${COL.bleu1}`, borderRadius: 16, padding: "16px 18px" }}>
      {children}
    </div>
  );
}

export default function Prevention() {
  return (
    <AppShell>
      <section style={{ background: "#14110F", borderBottom: `2px solid ${COL.or}`, padding: "24px 22px" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: COL.or }}>
          On rigole, mais on assure
        </div>
        <h1 className="pmu-titre" style={{ fontSize: "2rem", marginTop: 10 }}>
          Besoin d&apos;<span className="accent">aide</span> ?
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "0.98rem", color: COL.texte2, lineHeight: 1.5 }}>
          Toi ou un proche vous posez des questions sur l&apos;alcool ? Des professionnels sont
          là pour en parler — gratuitement, anonymement, sans jugement.
        </p>
      </section>

      <section style={{ margin: "18px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Alcool Info Service */}
        <Carte>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: COL.or }}>
            Alcool Info Service
          </h2>
          <p style={{ margin: "6px 0 14px", fontSize: "0.9rem", color: COL.texte2, lineHeight: 1.5 }}>
            Le service national d&apos;aide à distance de Santé publique France. Écoute
            téléphonique, chat et informations pour faire le point sur sa consommation.
          </p>
          <a
            href={`tel:${TEL_AIS}`}
            className="pmu-arcade pmu-arcade--or"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, fontSize: "1.05rem", textDecoration: "none" }}
          >
            📞 0 980 980 930
          </a>
          <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: COL.texte2, textAlign: "center" }}>
            Anonyme et non surtaxé · 7j/7 de 8h à 2h
          </p>
          <a
            href="https://www.alcool-info-service.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: 12, textAlign: "center", color: COL.creme, fontWeight: 700, fontSize: "0.9rem", textDecoration: "underline" }}
          >
            alcool-info-service.fr →
          </a>
        </Carte>

        {/* Urgences */}
        <Carte>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: COL.or }}>
            En cas d&apos;urgence
          </h2>
          <p style={{ margin: "6px 0 12px", fontSize: "0.9rem", color: COL.texte2, lineHeight: 1.5 }}>
            Malaise, coma éthylique, personne en danger : n&apos;attends pas.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="tel:15" className="pmu-arcade" style={{ flex: 1, minWidth: 120, minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "0.95rem" }}>
              🚑 SAMU · 15
            </a>
            <a href="tel:112" className="pmu-arcade pmu-arcade--ardoise" style={{ flex: 1, minWidth: 120, minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "0.95rem" }}>
              ☎️ Urgences · 112
            </a>
          </div>
        </Carte>

        {/* Rappels */}
        <Carte>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: "1.15rem", color: COL.or }}>
            Les bons réflexes
          </h2>
          <ul style={{ margin: "10px 0 0", padding: "0 0 0 20px", fontSize: "0.9rem", color: COL.texte2, lineHeight: 1.6 }}>
            <li>Un verre d&apos;eau entre chaque verre, et on mange.</li>
            <li>On désigne un <strong style={{ color: COL.creme }}>Sam</strong> : celui qui conduit ne boit pas.</li>
            <li>Le Pèse-Alco est une <strong style={{ color: COL.creme }}>estimation ludique</strong> : il ne remplace jamais un éthylotest, et ne dit jamais qu&apos;on peut conduire.</li>
            <li>Repères de consommation à moindre risque : pas plus de 2 verres par jour, et pas tous les jours.</li>
          </ul>
        </Carte>

        <div style={{ background: "#14110F", border: `1px solid ${COL.or}`, borderRadius: 16, padding: "14px 16px" }}>
          <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, color: COL.or, textAlign: "center", lineHeight: 1.45 }}>
            ⚠️ {MESSAGE_SANITAIRE}
          </p>
        </div>
      </section>

      <div style={{ height: 20 }} />
    </AppShell>
  );
}
