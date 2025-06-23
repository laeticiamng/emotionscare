
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { Toaster } from 'sonner';

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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserModeProvider>
            <UserPreferencesProvider>
              {children}
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                duration={4000}
              />
            </UserPreferencesProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
