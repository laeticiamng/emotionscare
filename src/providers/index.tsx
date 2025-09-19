import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/contexts/ErrorBoundary';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { I18nProvider } from '@/lib/i18n/i18n';
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

export function RootProvider({ children }: RootProviderProps) {
  const [queryClient] = React.useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserModeProvider>
          <I18nProvider>
            <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
              <AccessibilityProvider>
                <TooltipProvider delayDuration={200} skipDelayDuration={100}>
                  <ErrorBoundary>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                  </ErrorBoundary>
                </TooltipProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          </I18nProvider>
        </UserModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}