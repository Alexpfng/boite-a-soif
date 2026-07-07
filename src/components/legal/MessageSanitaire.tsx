import { Link } from "react-router-dom";
import { COL } from "../../ui/theme";

// Message sanitaire officiel imposé par la loi Évin (art. L3323-4 du Code de
// la santé publique, formulation du décret du 31 octobre 1991). À conserver
// tel quel, lisible et détaché du fond. Rendu en pied global de l'app.
export const MESSAGE_SANITAIRE =
  "L'abus d'alcool est dangereux pour la santé, à consommer avec modération.";

export function MessageSanitaire() {
  return (
    <footer
      aria-label="Avertissement sanitaire"
      style={{
        borderTop: `1px solid ${COL.or}`,
        background: "#14110F",
        padding: "12px 16px",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, color: COL.or, lineHeight: 1.4 }}>
        ⚠️ {MESSAGE_SANITAIRE}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: COL.texte2, lineHeight: 1.4 }}>
        Réservé aux 18 ans et plus. Jamais d&apos;alcool au volant.{" "}
        <Link to="/prevention" style={{ color: COL.creme, textDecoration: "underline", fontWeight: 700 }}>
          Besoin d&apos;aide ?
        </Link>{" "}
        ·{" "}
        <Link to="/a-propos" style={{ color: COL.texte2, textDecoration: "underline" }}>
          Mentions légales
        </Link>
      </p>
    </footer>
  );
}
