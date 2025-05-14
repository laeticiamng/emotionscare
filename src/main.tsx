
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/branding.css';
import './styles/modals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { SoundscapeProvider } from './providers/SoundscapeProvider';
import { StorytellingProvider } from './providers/StorytellingProvider';
import { BrandingProvider } from './contexts/BrandingContext';
import { PredictiveAnalyticsProvider } from './providers/PredictiveAnalyticsProvider';
import { UserModeProvider } from './contexts/UserModeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './AppRouter';

console.log('📋 main.tsx: Initialisation de l\'application');

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Ajouter une variable globale pour le débogage
window.__APP_DEBUG__ = true;
console.log('🔍 Debug mode activé');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <UserModeProvider>
                <BrandingProvider>
                  <SoundscapeProvider>
                    <StorytellingProvider>
                      <PredictiveAnalyticsProvider>
                        <MusicProvider>
                          <AppRouter />
                          <Toaster />
                        </MusicProvider>
                      </PredictiveAnalyticsProvider>
                    </StorytellingProvider>
                  </SoundscapeProvider>
                </BrandingProvider>
              </UserModeProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

console.log('✅ main.tsx: Application montée avec succès');
