import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './App.css';

// Import des contexts
import AuthContextProvider from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SecurityProvider } from './components/security/SecurityProvider';

// Import RouterV2 - ACTIVATION DU SYSTÈME UNIFIÉ
import { routerV2 } from './routerV2';

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
          <AuthContextProvider>
            <UserModeProvider>
              <SecurityProvider>
                {/* 🚀 ACTIVATION RouterV2 - Système unifié avec 80+ routes */}
                <RouterProvider router={routerV2} />
                <Toaster />
                <Sonner />
              </SecurityProvider>
            </UserModeProvider>
          </AuthContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;