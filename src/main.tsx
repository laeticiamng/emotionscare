
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/branding.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { BrowserRouter } from 'react-router-dom';
import { SoundscapeProvider } from './providers/SoundscapeProvider';
import { StorytellingProvider } from './providers/StorytellingProvider';
import { BrandingProvider } from './contexts/BrandingContext';
import { PredictiveAnalyticsProvider } from './providers/PredictiveAnalyticsProvider';
import { UserModeProvider } from './contexts/UserModeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <MusicProvider>
                <BrandingProvider>
                  <SoundscapeProvider>
                    <StorytellingProvider>
                      <UserModeProvider>
                        <PredictiveAnalyticsProvider>
                          <AuthProvider>
                            <App />
                            <Toaster />
                          </AuthProvider>
                        </PredictiveAnalyticsProvider>
                      </UserModeProvider>
                    </StorytellingProvider>
                  </SoundscapeProvider>
                </BrandingProvider>
              </MusicProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
