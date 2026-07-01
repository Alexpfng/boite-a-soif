import { RouterProvider } from 'react-router-dom';
import { AccessibilityProvider } from './components/a11y/AccessibilityContext';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './features/auth/AuthContext';
import { PresenceAuto } from './features/proximite/PresenceAuto';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <ToastProvider>
          <PresenceAuto />
          <RouterProvider router={router} />
        </ToastProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
