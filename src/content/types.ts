// Types du système de contenu A'PHAS'AIDE

export type SectionId = 'conseils' | 'outils' | 'comprendre' | 'aides';

export interface BlocH2   { t: 'h2';       x: string; aValider?: boolean }
export interface BlocP    { t: 'p';        x: string; aValider?: boolean }
export interface BlocList { t: 'list';     items: string[]; aValider?: boolean }
export interface BlocEnc  { t: 'enc';      x: string; aValider?: boolean }
export interface BlocLien { t: 'lien';     x: string; outil: string }
export interface BlocUrgence { t: 'urgence'; x: string; num: string }
export interface BlocTel  { t: 'tel';      x: string; label: string; num: string; aValider?: boolean }
export interface BlocWeb  { t: 'web';      x: string; label: string; url: string; aValider?: boolean }

export type Bloc = BlocH2 | BlocP | BlocList | BlocEnc | BlocLien | BlocUrgence | BlocTel | BlocWeb;

export interface Fiche {
  id: string;
  slug: string;
  titre: string;
  accroche: string;
  section?: SectionId;
  aValider?: boolean;
  blocs?: Bloc[];
  special?: 'definitions' | 'stereotypes';
}

export interface OutilFiche {
  id: string;
  slug: string;
  titre: string;
  sous: string;
  desc: string;
  mode: string;
}

export interface Definition {
  terme: string;
  def: string;
  aValider?: boolean;
}

export interface Stereotype {
  idee: string;
  expl: string;
  aValider?: boolean;
}

export interface EchelleItem {
  id: number;
  label: string;
  dire: string;
  couleur: string;
}

export interface CorpsZone {
  id: string;
  shape: 'circle' | 'rect' | 'ellipse';
  attrs: Record<string, number>;
  face: string;
  dos: string;
}

export interface TlaItem {
  mot: string;
  emoji: string;
  dire: string;
}

export interface Temoignage {
  titre: string;
  nom: string;
  desc: string;
  duree: string;
  dispo: boolean;
}

export interface CarteTexte {
  titre: string;
  lignes: string[];
}

export interface AppContent {
  conseilsIntro: string;
  conseils: Fiche[];
  temoignage: Temoignage;
  outils: OutilFiche[];
  carteTexte: CarteTexte;
  tla: TlaItem[];
  echelle: EchelleItem[];
  corpsZones: CorpsZone[];
  comprendre: Fiche[];
  definitions: Definition[];
  stereotypes: Stereotype[];
  aides: Fiche[];
  rdvTypes: string[];
  liensParente: string[];
}
