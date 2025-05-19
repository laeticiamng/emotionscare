
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import AppRouter from './AppRouter';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { CoachProvider } from '@/contexts/CoachContext';
import { ChatProvider } from '@/contexts/ChatContext';

import PrivacyConsentBanner from './components/privacy/PrivacyConsentBanner';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <ThemeProvider>
          <AuthProvider>
            <UserModeProvider>
              <PreferencesProvider>
                <LayoutProvider>
                  <CoachProvider>
                    <ChatProvider>
                      <Router>
                        <AppRouter />
                        <PrivacyConsentBanner />
                        <Toaster />
                      </Router>
                    </ChatProvider>
                  </CoachProvider>
                </LayoutProvider>
              </PreferencesProvider>
            </UserModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
