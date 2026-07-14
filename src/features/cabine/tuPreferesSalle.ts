// ──────────────────────────────────────────────────────────────────────────
// « Tu préfères ? » à distance : chacun sur son téléphone rejoint la même
// partie via un code court. 100 % Supabase Realtime (broadcast + présence),
// AUCUNE table ni migration — le code EST le nom du canal. L'hôte pilote les
// dilemmes ; tout le monde vote et voit le décompte en direct.
// ──────────────────────────────────────────────────────────────────────────

import { supabase } from "../../integrations/supabase/client";

export interface DilemmeDistant {
  a: string;
  b: string;
  cat: string;
  round: number;
}

export interface VoteDistant {
  id: string;
  pseudo: string;
  choix: "a" | "b";
  round: number;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans I/O/0/1 (lecture facile)

/** Code de salle à 4 caractères, lisible et facile à dicter. */
export function genererCodeTP(): string {
  let s = "";
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

export interface SalleTP {
  envoyerDilemme: (d: DilemmeDistant) => void;
  envoyerVote: (choix: "a" | "b", round: number) => void;
  quitter: () => void;
}

export interface OptionsSalleTP {
  code: string;
  monId: string;
  pseudo: string;
  onPret: () => void;
  onDilemme: (d: DilemmeDistant) => void;
  onVote: (v: VoteDistant) => void;
  onPresents: (noms: string[]) => void;
  onSync: () => void;
}

/** Ouvre (ou rejoint) la salle du code donné. Renvoie de quoi émettre + quitter. */
export function ouvrirSalleTP(opts: OptionsSalleTP): SalleTP {
  const canal = supabase.channel(`tp:${opts.code.toUpperCase()}`, {
    config: { broadcast: { self: true }, presence: { key: opts.monId } },
  });

  canal
    .on("broadcast", { event: "dilemme" }, ({ payload }) => {
      const p = payload as Partial<DilemmeDistant> | undefined;
      if (p && typeof p.a === "string" && typeof p.b === "string" && typeof p.round === "number") {
        opts.onDilemme({ a: p.a, b: p.b, cat: String(p.cat || ""), round: p.round });
      }
    })
    .on("broadcast", { event: "vote" }, ({ payload }) => {
      const p = payload as Partial<VoteDistant> | undefined;
      if (p && typeof p.id === "string" && (p.choix === "a" || p.choix === "b") && typeof p.round === "number") {
        opts.onVote({ id: p.id, pseudo: String(p.pseudo || "Pilier"), choix: p.choix, round: p.round });
      }
    })
    .on("broadcast", { event: "sync" }, () => opts.onSync())
    .on("presence", { event: "sync" }, () => {
      const etat = canal.presenceState() as unknown as Record<string, { pseudo?: string }[]>;
      const noms = Object.values(etat).map((metas) => (metas[0] && metas[0].pseudo) || "Pilier");
      opts.onPresents(noms);
    })
    .subscribe((statut) => {
      if (statut === "SUBSCRIBED") {
        canal.track({ pseudo: opts.pseudo }).catch(() => {});
        // On demande l'état courant : utile pour un arrivant en cours de partie.
        canal.send({ type: "broadcast", event: "sync", payload: {} }).catch(() => {});
        opts.onPret();
      }
    });

  return {
    envoyerDilemme: (d) => {
      canal.send({ type: "broadcast", event: "dilemme", payload: d }).catch(() => {});
    },
    envoyerVote: (choix, round) => {
      canal.send({ type: "broadcast", event: "vote", payload: { id: opts.monId, pseudo: opts.pseudo, choix, round } }).catch(() => {});
    },
    quitter: () => {
      supabase.removeChannel(canal);
    },
  };
}
