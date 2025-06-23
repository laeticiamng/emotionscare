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
import { OptimizationProvider } from '@/contexts/OptimizationContext';
import { initializeProductionSecurity } from '@/utils/productionSecurity';

// Configuration React Query avec optimisations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Optimisation : éviter les refetch inutiles
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Initialiser la sécurité production
  React.useEffect(() => {
    initializeProductionSecurity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OptimizationProvider>
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
        </OptimizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
