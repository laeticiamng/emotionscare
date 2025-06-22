
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { EthicsProvider } from '@/contexts/EthicsContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from 'sonner';
import PrivacyConsentBanner from '@/components/privacy/PrivacyConsentBanner';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>
          <AuthProvider>
            <UserModeProvider>
              <UserPreferencesProvider>
                <EthicsProvider>
                  {children}
                  <PrivacyConsentBanner />
                  <Toaster 
                    position="top-right" 
                    richColors 
                    closeButton
                    duration={4000}
                  />
                </EthicsProvider>
              </UserPreferencesProvider>
            </UserModeProvider>
          </AuthProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
