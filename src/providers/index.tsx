// @ts-nocheck
import React from 'react';
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
import { SimpleAuthProvider } from '@/contexts/SimpleAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
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
  const ready = useI18nReady();

  // Temporairement, on force le rendu même si i18n n'est pas prêt
  // pour éviter l'écran blanc 
  if (!ready) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#fff'
      }}>
        <div>Chargement de l'application...</div>
      </div>
    );
  }

  return <I18nProvider>{children}</I18nProvider>;
};

export function RootProvider({ children }: RootProviderProps) {
  const [queryClient] = React.useState(createQueryClient);

  return (
    <HelmetProvider>
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <SimpleAuthProvider>
              <AuthProvider>
                <UserModeProvider>
                  <I18nBootstrap>
                    <ThemeProvider defaultTheme="system" storageKey="emotionscare-theme">
                      <AccessibilityProvider>
                        <NotificationProvider>
                          <TooltipProvider delayDuration={200} skipDelayDuration={100}>
                            <UnifiedProvider>
                              <MoodProvider>
                                <MusicProvider>
                                  {children}
                                  <Toaster
                                    position="top-right"
                                    className="toaster group"
                                    closeButton
                                    toastOptions={{
                                      classNames: {
                                        toast:
                                          'group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-premium',
                                        description: 'group-[.toast]:text-muted-foreground',
                                        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                                        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                                      },
                                    }}
                                  />
                                </MusicProvider>
                              </MoodProvider>
                            </UnifiedProvider>
                          </TooltipProvider>
                        </NotificationProvider>
                      </AccessibilityProvider>
                    </ThemeProvider>
                  </I18nBootstrap>
                </UserModeProvider>
              </AuthProvider>
            </SimpleAuthProvider>
          </ErrorProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </HelmetProvider>
  );
}

export default RootProvider;
