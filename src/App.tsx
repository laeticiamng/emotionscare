import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import des contexts
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from '@/components/theme-provider';
import { SecurityProvider } from './components/security/SecurityProvider';

// Import RouterV2 - ACTIVATION DU SYSTÈME UNIFIÉ
import { simpleRouter as routerV2 } from './routerV2/simple-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <UserModeProvider>
              <SecurityProvider>
                {/* 🚀 ACTIVATION RouterV2 - Système unifié avec 80+ routes */}
                <RouterProvider router={routerV2} />
                <Toaster />
                <Sonner />
              </SecurityProvider>
            </UserModeProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;