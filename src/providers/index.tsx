import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { NotificationProvider } from '@/components/ui/notification-system';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/contexts/ErrorBoundary';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { SimpleAuthProvider } from '@/contexts/SimpleAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { I18nProvider } from '@/lib/i18n/i18n';
import i18n from '@/lib/i18n';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { MusicProvider } from '@/contexts/MusicContext';
import { ThemeProvider } from '@/providers/ThemeProvider';

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
  const [ready, setReady] = React.useState(() => i18n.isInitialized);

  React.useEffect(() => {
    if (ready) {
      return;
    }

    const handleInitialized = () => {
      setReady(true);
    };

    if (i18n.isInitialized) {
      setReady(true);
      return;
    }

    i18n.on('initialized', handleInitialized);

    return () => {
      i18n.off('initialized', handleInitialized);
    };
  }, [ready]);

  return ready;
};

const I18nBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ready = useI18nReady();

  if (!ready) {
    return null;
  }

  return <I18nProvider>{children}</I18nProvider>;
};

export function RootProvider({ children }: RootProviderProps) {
  const [queryClient] = React.useState(createQueryClient);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <SimpleAuthProvider>
              <AuthProvider>
                <UserModeProvider>
                  <I18nBootstrap>
                    <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
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
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default RootProvider;
