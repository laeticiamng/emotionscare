import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CookieConsent } from '@/COMPONENTS.reg';

// Import des contexts
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from '@/components/theme-provider';

// Import des providers nécessaires pour les modules
import { MusicProvider } from './contexts/MusicContext';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { InnovationProvider } from './contexts/InnovationContext';
import { EthicsProvider } from './contexts/EthicsContext';
import { CacheProvider } from './contexts/CacheContext';
import { ErrorProvider } from './contexts/ErrorContext';

// Import RouterV2 - ACTIVATION DU SYSTÈME UNIFIÉ
import { simpleRouter as routerV2 } from './routerV2/simple-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <CacheProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AuthProvider>
                <UserModeProvider>
                  <MusicProvider>
                    <FeedbackProvider>
                      <InnovationProvider>
                        <EthicsProvider>
                          {/* 🚀 ACTIVATION RouterV2 - Système unifié avec 80+ routes */}
                          <RouterProvider router={routerV2} />
                          <Toaster />
                          <Sonner />
                          <CookieConsent />
                        </EthicsProvider>
                      </InnovationProvider>
                    </FeedbackProvider>
                  </MusicProvider>
                </UserModeProvider>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </CacheProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
