import { RouterProvider } from 'react-router-dom';
import { AccessibilityProvider } from './components/a11y/AccessibilityContext';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './features/auth/AuthContext';
import { EcouteurTchin } from './features/champions/EcouteurTchin';
import { PortailMajorite } from './components/legal/PortailMajorite';
import { PresenceAuto } from './features/proximite/PresenceAuto';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <ToastProvider>
          <PresenceAuto />
          <EcouteurTchin />
          <RouterProvider router={router} />
          {/* Portail de majorité 18+ : overlay au 1er lancement (par appareil). */}
          <PortailMajorite />
        </ToastProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
