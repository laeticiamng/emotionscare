
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

// Configuration globale de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="emotionscare-ui-theme">
        <AuthProvider>
          <UserModeProvider>
            <LayoutProvider>
              <SidebarProvider>
                {children}
                <Toaster />
                <SonnerToaster />
              </SidebarProvider>
            </LayoutProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
