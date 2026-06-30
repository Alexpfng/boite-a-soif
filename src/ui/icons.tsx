// Icônes SVG exactes du design

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ChevronDroit({ size = 20, color = '#4A5A63', strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9 5 L16 12 L9 19" />
    </svg>
  );
}

export const COEUR_PATH = 'M12 21 C12 21 4.5 16 2.8 11.2 C1.5 7.6 3.8 4.5 7 4.5 C9 4.5 10.5 5.6 12 7.4 C13.5 5.6 15 4.5 17 4.5 C20.2 4.5 22.5 7.6 21.2 11.2 C19.5 16 12 21 12 21 Z';

export function Coeur({ size = 23, fill = 'none', stroke = '#E0662A' }: { size?: number; fill?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={COEUR_PATH} fill={fill} stroke={fill === 'none' || stroke ? stroke : undefined} strokeWidth={stroke ? 1.8 : 0} />
    </svg>
  );
}

export function IconeCalendrier({ size = 22, color = '#15576F', strokeWidth = 2.2 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="3" />
      <line x1="4" y1="10.5" x2="20" y2="10.5" />
      <line x1="9" y1="4" x2="9" y2="7" />
      <line x1="15" y1="4" x2="15" y2="7" />
    </svg>
  );
}

export function IconeBulle({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6 C4 4.9 4.9 4 6 4 H18 C19.1 4 20 4.9 20 6 V14 C20 15.1 19.1 16 18 16 H12 L8 20 V16 H6 C4.9 16 4 15.1 4 14 Z" />
    </svg>
  );
}

export function IconeReglages({ size = 30, color = 'currentColor', fillDot }: IconProps & { fillDot?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="8" x2="20" y2="8" />
      <circle cx="9.5" cy="8" r="2.6" fill={fillDot} />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="14.5" cy="16" r="2.6" fill={fillDot} />
    </svg>
  );
}

export function IconeLivre({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <line x1="12" y1="4.5" x2="12" y2="19.5" />
    </svg>
  );
}

export function IconePlus({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <line x1="12" y1="8.5" x2="12" y2="15.5" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  );
}

export function IconeMaison({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11 L12 4 L20 11" />
      <path d="M6.5 9.5 V19.5 H17.5 V9.5" />
    </svg>
  );
}

export function IconeHautParleur({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10 H8 L13 5 V19 L8 14 H4 Z" />
      <path d="M16.5 9 C18.5 10.5 18.5 13.5 16.5 15" />
    </svg>
  );
}

export function IconeTelephone({ size = 22, color = '#15576F' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M6.5 3.5 C5.3 3.5 4.4 4.5 4.6 5.7 C5.5 12.4 11.6 18.5 18.3 19.4 C19.5 19.6 20.5 18.7 20.5 17.5 V15 L16.5 13.6 L14.9 15.2 C12.6 14 10 11.4 8.8 9.1 L10.4 7.5 L9 3.5 Z" />
    </svg>
  );
}

export function IconeLienExterne({ size = 20, color = '#15576F' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9 15 L19 5" />
      <path d="M12 5 H19 V12" />
    </svg>
  );
}

export function IconeRecherche({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

export function IconeAccessibilite({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="6" r="3" />
      <path d="M5 11 C9 12.5 15 12.5 19 11" />
      <path d="M12 12.5 V17 L9 21.5" />
      <path d="M12 17 L15 21.5" />
    </svg>
  );
}

export function IconeRetour({ size = 26, color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5 L8 12 L15 19" />
    </svg>
  );
}

export function IconePouce({ size = 84, rotate = false }: { size?: number; rotate?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={rotate ? { transform: 'rotate(180deg)' } : undefined} aria-hidden="true">
      <path d="M7 11 V21 H4 V11 Z M9 21 H17.5 C18.6 21 19.5 20.3 19.8 19.2 L21.4 13.2 C21.8 11.8 20.8 10.5 19.4 10.5 H14.5 L15.4 6.2 C15.6 5 14.7 4 13.5 4 C13 4 12.5 4.3 12.2 4.7 L9 10.5 Z" />
    </svg>
  );
}

export function IconeCorps({ size = 24, color = '#15576F' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.6" />
      <path d="M12 8 V15" />
      <path d="M7 10.5 H17" />
      <path d="M12 15 L8.5 20.5" />
      <path d="M12 15 L15.5 20.5" />
    </svg>
  );
}

/**
 * Symbole de marque BOÎTE À SOIF — deux verres qui trinquent (« tchin ! »)
 * avec une étincelle de convivialité. `color` pilote les verres, `accent`
 * l'étincelle. Sur fond sombre, passer color="#FFFFFF" : l'étincelle prend
 * un terracotta clair (#F0A074) pour rester lisible (variante « blanc »).
 */
export function Symbole({
  size = 30,
  color = '#E9C46A',
  accent,
}: IconProps & { accent?: string }) {
  const isLight = color.toUpperCase() === '#FFFFFF' || color.toLowerCase() === 'white';
  const etincelle = accent ?? (isLight ? '#F0A074' : '#E14B3A');
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      {/* Verre gauche, incliné vers le centre */}
      <g transform="rotate(-17 50 56)">
        <path d="M24 34 H52 L41 53 Z" fill={color} />
        <line x1="41" y1="53" x2="41" y2="78" stroke={color} strokeWidth={5} strokeLinecap="round" />
        <line x1="30" y1="80" x2="52" y2="80" stroke={color} strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* Verre droit, miroir */}
      <g transform="rotate(17 50 56)">
        <path d="M48 34 H76 L59 53 Z" fill={color} />
        <line x1="59" y1="53" x2="59" y2="78" stroke={color} strokeWidth={5} strokeLinecap="round" />
        <line x1="48" y1="80" x2="70" y2="80" stroke={color} strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* Étincelle du « tchin » au point de contact */}
      <g stroke={etincelle} strokeWidth={5} strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="20" />
        <line x1="37" y1="13" x2="42" y2="22" />
        <line x1="63" y1="13" x2="58" y2="22" />
      </g>
    </svg>
  );
}

/**
 * Mot-marque « Boîte à Soif » — Mulish ExtraBold (800), « Soif » en terracotta.
 * `color` pilote la couleur du texte (par défaut bleu pétrole de la charte).
 */
export function Wordmark({
  taille = 'topbar',
  color = '#F3E8CF',
}: {
  taille?: 'topbar' | 'hero';
  color?: string;
}) {
  const big = taille === 'hero';
  return (
    <span
      style={{
        fontFamily: 'Mulish, system-ui, sans-serif',
        fontWeight: 800,
        fontSize: big ? '2rem' : '1.3rem',
        letterSpacing: '-0.01em',
        lineHeight: 1,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      Boît&rsquo;à <span style={{ color: '#E14B3A' }}>Soif</span>
    </span>
  );
}
