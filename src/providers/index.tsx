// @ts-nocheck
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { logger } from '@/lib/logger';

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

// Create query client outside component to avoid recreation
const queryClient = new QueryClient({
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

const I18nBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <I18nProvider>{children}</I18nProvider>;
};

export function RootProvider({ children }: RootProviderProps) {
  return (
    <HelmetProvider>
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <AuthProvider>
              <UserModeProvider>
                <I18nBootstrap>
                  <MoodProvider>
                    <MusicProvider>
                      <UnifiedProvider>
                        <ConsentProvider>
                          <AccessibilityProvider>
                            <ThemeProvider
                              attribute="class"
                              defaultTheme="system"
                              enableSystem
                              storageKey="emotionscare-theme"
                            >
                              <TooltipProvider>
                                <NotificationProvider>
                                  <AccessibilitySkipLinks />
                                  {children}
                                  <Toaster />
                                  <PolicyAcceptanceModal />
                                  <CookieBanner />
                                </NotificationProvider>
                              </TooltipProvider>
                            </ThemeProvider>
                          </AccessibilityProvider>
                        </ConsentProvider>
                      </UnifiedProvider>
                    </MusicProvider>
                  </MoodProvider>
                </I18nBootstrap>
              </UserModeProvider>
            </AuthProvider>
          </ErrorProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </HelmetProvider>
  );
}

export default RootProvider;