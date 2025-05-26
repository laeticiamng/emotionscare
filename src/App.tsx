
import React from "react";
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

// Import toast components separately to control initialization
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Initialize validation files
import '@/lib/env-validation';
import '@/lib/errorBoundary';

// Validate React availability before creating QueryClient
if (!React || !React.useState) {
  throw new Error('React hooks not available in App component');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  console.log('App component rendering with React hooks available:', {
    useState: !!React.useState,
    useEffect: !!React.useEffect,
    useContext: !!React.useContext
  });
  
  return (
    <EnhancedErrorBoundary level="critical" showDetails={true}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <UserModeProvider>
                <MusicProvider>
                  <ToastProvider>
                    <SkipToContent />
                    <Suspense fallback={
                      <div className="flex h-screen items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    }>
                      <AppRouter />
                    </Suspense>
                    <ToastViewport />
                  </ToastProvider>
                  <Sonner />
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
