
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import AppRouter from "./AppRouter";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { ThemeProvider } from "@/providers/ThemeProvider";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary";

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
  console.log('App component rendering with full architecture');
  
  return (
    <EnhancedErrorBoundary level="critical" showDetails={true}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <UserModeProvider>
                <MusicProvider>
                  <SkipToContent />
                  <Toaster />
                  <Sonner />
                  <Suspense fallback={
                    <div className="flex h-screen items-center justify-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }>
                    <AppRouter />
                  </Suspense>
                </MusicProvider>
              </UserModeProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
