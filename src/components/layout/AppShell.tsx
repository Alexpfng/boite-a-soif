import { useState, type ReactNode } from 'react';
import { SkipLink } from '../a11y/SkipLink';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { AccessibilityPanel } from '../a11y/AccessibilityPanel';

interface Props {
  children: ReactNode;
  /** Outils plein écran : pas de chrome */
  hideChrome?: boolean;
}

export function AppShell({ children, hideChrome }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100dvh',
        background: '#1B1917',
        color: '#F3E8CF',
        lineHeight: 1.65,
        position: 'relative',
        boxShadow: '0 0 60px rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SkipLink />

      {!hideChrome && <TopBar onOpenPanel={() => setPanelOpen(true)} />}

      <main id="contenu-principal" tabIndex={-1} style={{ flex: 1, padding: hideChrome ? 0 : '0 0 130px 0', outline: 'none' }}>
        {children}
      </main>

      {!hideChrome && <BottomNav />}

      <AccessibilityPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
