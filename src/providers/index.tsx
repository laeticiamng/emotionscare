// @ts-nocheck
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { logger } from '@/lib/logger';

import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { NotificationProvider } from '@/components/ui/notification-system';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import RootErrorBoundary from '@/components/error/RootErrorBoundary';
import { ErrorProvider } from '@/contexts';
import { MoodProvider } from '@/contexts/MoodContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ConsentProvider } from '@/features/clinical-optin/ConsentProvider';
import { I18nProvider } from '@/lib/i18n/i18n';
import i18n from '@/lib/i18n';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { MusicProvider } from '@/contexts/MusicContext';
import { ThemeProvider } from '@/providers/theme';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  });

interface RootProviderProps {
  children: React.ReactNode;
}

const useI18nReady = () => {
  const [ready, setReady] = React.useState(() => {
    // Try to determine if i18n is ready immediately
    return i18n.isInitialized || i18n.language !== undefined;
  });

  React.useEffect(() => {
    if (ready) {
      return;
    }

    // Set a timeout to prevent infinite waiting
    const timeout = setTimeout(() => {
      logger.warn('[i18n] Initialization timeout, proceeding anyway', undefined, 'SYSTEM');
      setReady(true);
    }, 3000); // 3 seconds timeout

    const handleInitialized = () => {
      clearTimeout(timeout);
      setReady(true);
    };

    // Check if already initialized
    if (i18n.isInitialized || i18n.language !== undefined) {
      clearTimeout(timeout);
      setReady(true);
      return;
    }

    // Listen for initialization
    i18n.on('initialized', handleInitialized);
    i18n.on('loaded', handleInitialized);
    i18n.on('languageChanged', handleInitialized);

    return () => {
      clearTimeout(timeout);
      i18n.off('initialized', handleInitialized);
      i18n.off('loaded', handleInitialized);
      i18n.off('languageChanged', handleInitialized);
    };
  }, [ready]);

  return ready;
};

const I18nBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ FIX: Render immediately instead of waiting for i18n
  // i18n will load in background without blocking app render
  return <I18nProvider>{children}</I18nProvider>;
};

export function RootProvider({ children }: RootProviderProps) {
  const [queryClient] = React.useState(createQueryClient);
  const resolvedDefaultTheme = 'system';

  logger.info('🔍 RootProvider mounting', undefined, 'SYSTEM');

  return (
    <HelmetProvider>
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme={resolvedDefaultTheme}
            enableSystem
            storageKey="emotionscare-theme"
            themes={['light', 'dark', 'system']}
          >
            <Suspense fallback={<div>Chargement...</div>}>
              {children}
            </Suspense>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </HelmetProvider>
  );
}

export default RootProvider;
