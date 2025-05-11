
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <MusicProvider>
            <BrandingProvider>
              <SoundscapeProvider>
                <StorytellingProvider>
                  <UserModeProvider>
                    <PredictiveAnalyticsProvider>
                      <App />
                      <Toaster />
                    </PredictiveAnalyticsProvider>
                  </UserModeProvider>
                </StorytellingProvider>
              </SoundscapeProvider>
            </BrandingProvider>
          </MusicProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
