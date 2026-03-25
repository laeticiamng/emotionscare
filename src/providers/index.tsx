import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { NotificationProvider } from '@/components/ui/notification-system';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import RootErrorBoundary from '@/components/error/RootErrorBoundary';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ConsentProvider } from '@/features/clinical-optin/ConsentProvider';
import { I18nProvider } from '@/lib/i18n/i18n';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { MusicProvider } from '@/contexts/music';
import { ThemeProvider } from '@/providers/theme';
import { PolicyAcceptanceModal } from '@/components/gdpr/PolicyAcceptanceModal';
import AccessibilitySkipLinks from '@/components/accessibility/AccessibilitySkipLinks';
import { CookieBanner } from '@/components/cookies/CookieBanner';
import { composeProviders } from './compose';
import { AmbientProvider } from '@/experience/providers/AmbientProvider';
import { isSupabaseConfigured } from '@/integrations/supabase/client';

// Create query client outside component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/**
 * Providers composés — ordre d'imbrication aplati via composeProviders.
 * Groupés par responsabilité :
 *   1. Infrastructure (SEO, erreurs, query)
 *   2. Auth & mode
 *   3. i18n
 *   4. État applicatif (mood, music, unified)
 *   5. Consentements & accessibilité
 *   6. UI (thème, tooltips, notifications)
 */
const InfraAndStateProviders = composeProviders([
  // 1 — Infrastructure
  [HelmetProvider],
  [RootErrorBoundary],
  [QueryClientProvider, { client: queryClient }],
  [ErrorProvider],

  // 2 — Auth & Mode
  [AuthProvider],
  [UserModeProvider],

  // 3 — i18n
  [I18nProvider],

  // 4 — État applicatif
  [MoodProvider],
  [MusicProvider],
  [UnifiedProvider],

  // 4b — Experience Layer (ambient, immersion, transitions)
  [AmbientProvider],

  // 5 — Consentements & Accessibilité
  [ConsentProvider],
  [AccessibilityProvider],

  // 6 — UI
  [ThemeProvider, { attribute: 'class', defaultTheme: 'system', enableSystem: true, storageKey: 'emotionscare-theme' }],
  [TooltipProvider],
  [NotificationProvider],
]);

interface RootProviderProps {
  children: React.ReactNode;
}

function ConfigurationWarning() {
  if (isSupabaseConfigured) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        padding: '12px 16px',
        background: '#fef3c7',
        color: '#92400e',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        textAlign: 'center',
        borderBottom: '2px solid #f59e0b',
      }}
    >
      <strong>Configuration manquante :</strong> Supabase n&apos;est pas configuré.
      Copiez <code>.env.example</code> vers <code>.env</code> et renseignez{' '}
      <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
    </div>
  );
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <InfraAndStateProviders>
      <ConfigurationWarning />
      <AccessibilitySkipLinks />
      {children}
      <Toaster />
      <PolicyAcceptanceModal />
      <CookieBanner />
    </InfraAndStateProviders>
  );
}

export default RootProvider;
