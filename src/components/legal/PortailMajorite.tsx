import { useState } from "react";
import { lireStockage, ecrireStockage } from "../../lib/storage";
import { COL } from "../../ui/theme";
import { MESSAGE_SANITAIRE } from "./MessageSanitaire";

// Portail de majorité : au 1er lancement sur l'appareil, on confirme avoir
// 18 ans ou plus avant d'entrer (contenu autour de l'alcool). Le choix est
// mémorisé par appareil (clé globale, non synchronisée). Un « moins de 18 ans »
// ne mémorise rien et renvoie vers la prévention, sans laisser entrer.
const CLE = "majorite-confirmee";
const TEL_AIS = "0980980930";

export function PortailMajorite() {
  const [confirme, setConfirme] = useState<boolean>(() => lireStockage<boolean>(CLE, false));
  const [refus, setRefus] = useState(false);

  if (confirme) return null;

  // Pages d'information publiques : prévention et mentions légales restent
  // accessibles SANS passer le portail (un mineur doit pouvoir joindre l'aide ;
  // des mentions légales doivent être consultables par tous). `endsWith` gère
  // aussi bien la racine qu'un éventuel sous-chemin de déploiement.
  const chemin = typeof window !== "undefined" ? window.location.pathname : "";
  if (chemin.endsWith("/prevention") || chemin.endsWith("/a-propos")) return null;

  const entrer = () => {
    ecrireStockage(CLE, true);
    setConfirme(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation de majorité"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: COL.ardoise,
        color: COL.creme,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 22px",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <img
          src={`${import.meta.env.BASE_URL}brand/logo.png`}
          alt=""
          width={64}
          height={64}
          style={{ borderRadius: 14, display: "block", margin: "0 auto 14px" }}
        />

        {!refus ? (
          <>
            <h1 className="pmu-titre" style={{ fontSize: "1.7rem", margin: "0 0 6px" }}>
              Tu as <span className="accent" style={{ color: COL.rougeNeon }}>18 ans</span> ou plus ?
            </h1>
            <p style={{ margin: "0 0 20px", fontSize: "0.95rem", color: COL.texte2, lineHeight: 1.5 }}>
              La Boît&apos;à Soif tourne autour de la vie de comptoir : son contenu est
              réservé aux personnes majeures. En entrant, tu confirmes avoir 18 ans ou plus.
            </p>

            <button
              onClick={entrer}
              className="pmu-arcade"
              style={{ width: "100%", minHeight: 56, fontSize: "1.05rem" }}
            >
              🍺 J&apos;ai 18 ans ou plus — entrer
            </button>
            <button
              onClick={() => setRefus(true)}
              style={{
                width: "100%",
                marginTop: 12,
                minHeight: 50,
                background: "transparent",
                border: `2px solid ${COL.bleu1}`,
                borderRadius: 14,
                color: COL.texte2,
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              J&apos;ai moins de 18 ans
            </button>
          </>
        ) : (
          <>
            <h1 className="pmu-titre" style={{ fontSize: "1.6rem", margin: "0 0 6px" }}>
              À dans <span className="accent" style={{ color: COL.rougeNeon }}>quelques années</span> !
            </h1>
            <p style={{ margin: "0 0 18px", fontSize: "0.95rem", color: COL.texte2, lineHeight: 1.5 }}>
              Cette application est réservée aux personnes majeures. Reviens quand tu auras
              l&apos;âge — et en attendant, si tu te poses des questions sur l&apos;alcool,
              des gens sont là pour en parler, gratuitement et anonymement.
            </p>
            <a
              href={`tel:${TEL_AIS}`}
              className="pmu-arcade pmu-arcade--or"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 56,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              📞 Alcool Info Service — 0 980 980 930
            </a>
            <p style={{ margin: "12px 0 0", fontSize: "0.78rem", color: COL.texte2 }}>
              Anonyme et non surtaxé, 7j/7 de 8h à 2h.
            </p>
            {/* Rechargement volontaire (pas de navigation SPA) : la page
                /prevention est exemptée du portail, elle s'affichera bien. */}
            <a
              href={`${import.meta.env.BASE_URL}prevention`}
              style={{ display: "inline-block", marginTop: 16, color: COL.creme, fontWeight: 700, fontSize: "0.9rem", textDecoration: "underline" }}
            >
              Voir toutes les ressources d&apos;aide →
            </a>
          </>
        )}

        <p style={{ margin: "22px 0 0", fontSize: "0.74rem", fontWeight: 700, color: COL.or, lineHeight: 1.4 }}>
          ⚠️ {MESSAGE_SANITAIRE}
        </p>
      </div>
    </div>
  );
}
