// ========== IMPORTS OPTIMISÉS ==========
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CookieConsent } from '@/COMPONENTS.reg';

// Contexts unifiés optimisés
import { 
  AuthProvider,
  UserModeProvider,
  ThemeProvider,
  CacheProvider,
  CoachProvider,
  MusicProvider,
  FeedbackProvider,
  InnovationProvider,
  EthicsProvider,
  ErrorProvider
} from './contexts';

// RouterV2 unifié
import { simpleRouter as routerV2 } from './routerV2/simple-router';

// ========== CONFIGURATION REACT QUERY ==========
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ========== APP PRINCIPAL ==========
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <CacheProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AuthProvider>
                <UserModeProvider>
                  <CoachProvider>
                    <MusicProvider>
                      <FeedbackProvider>
                        <InnovationProvider>
                          <EthicsProvider>
                            {/* 🚀 RouterV2 - Système unifié optimisé */}
                            <RouterProvider router={routerV2} />
                            
                            {/* 🔔 Notifications globales */}
                            <Toaster />
                            <Sonner />
                            <CookieConsent />
                          </EthicsProvider>
                        </InnovationProvider>
                      </FeedbackProvider>
                    </MusicProvider>
                  </CoachProvider>
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
