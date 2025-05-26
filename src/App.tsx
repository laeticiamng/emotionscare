
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { Suspense } from "react";
import AppRouter from "./AppRouter";
import { GlobalErrorBoundary } from "@/components/ErrorBoundary/GlobalErrorBoundary";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import SecurityProvider from "@/components/security/SecurityProvider";
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";
import AppProviders from "@/providers/AppProviders";

// Initialiser la validation d'environnement
import '@/lib/env-validation';
import '@/lib/errorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Ne pas retry sur les erreurs d'authentification
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <GlobalErrorBoundary>
        <SecurityProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={150}>
              <BrowserRouter>
                <AppProviders>
                  <UserModeProvider>
                    <MusicProvider>
                      <SkipToContent />
                      <Toaster />
                      <Sonner />
                      <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
                      <AppRouter />
                    </MusicProvider>
                  </UserModeProvider>
                </AppProviders>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </SecurityProvider>
      </GlobalErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
