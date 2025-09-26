'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext.minimal';
import { UserModeProvider } from '@/contexts/UserModeContext.minimal';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';

// Client Query simple
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant d'erreur simple
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-destructive">Une erreur s'est produite</h1>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
}

export type RootProviderProps = {
  children: React.ReactNode;
};

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
            <UserModeProvider>
              <AuthProvider>
                {children}
                <Toaster 
                  position="top-center"
                  richColors
                  closeButton
                />
              </AuthProvider>
            </UserModeProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default RootProvider;