import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { lireStockage, ecrireStockage } from '../../lib/storage';

// Préférences d'accessibilité, persistées et appliquées sur <html>.
// Le script inline d'index.html les applique avant le premier rendu (pas de flash).

export const CRANS_TAILLE = [100, 115, 130, 150] as const;
export type CranTaille = (typeof CRANS_TAILLE)[number];

export interface PrefsA11y {
  fontScale: CranTaille;
  contrast: boolean;
  comfort: boolean;
}

const PREFS_DEFAUT: PrefsA11y = { fontScale: 100, contrast: false, comfort: false };

interface ContexteA11y {
  prefs: PrefsA11y;
  setPrefs: (p: Partial<PrefsA11y>) => void;
}

const Ctx = createContext<ContexteA11y>({ prefs: PREFS_DEFAUT, setPrefs: () => {} });

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<PrefsA11y>(() => ({
    ...PREFS_DEFAUT,
    ...lireStockage<Partial<PrefsA11y>>('a11y', {}),
  }));

  useEffect(() => {
    const html = document.documentElement;
    html.style.setProperty('--font-scale', String(prefs.fontScale / 100));
    if (prefs.contrast) html.setAttribute('data-theme', 'contrast');
    else html.removeAttribute('data-theme');
    if (prefs.comfort) html.setAttribute('data-comfort', 'true');
    else html.removeAttribute('data-comfort');
    ecrireStockage('a11y', prefs);
  }, [prefs]);

  const setPrefs = (p: Partial<PrefsA11y>) => setPrefsState((avant) => ({ ...avant, ...p }));

  return <Ctx.Provider value={{ prefs, setPrefs }}>{children}</Ctx.Provider>;
}

export function useA11y() {
  return useContext(Ctx);
}
