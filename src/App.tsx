import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppRouter from "./AppRouter";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { ThemeProvider } from "@/providers/ThemeProvider";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

// Validate React before creating QueryClient
console.log('App: React validation:', {
  React: !!React,
  useState: !!React.useState,
  useEffect: !!React.useEffect,
  Suspense: !!Suspense
});

if (!React || !React.useState) {
  throw new Error('React hooks not available in App component');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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
  console.log('App component rendering successfully');
  
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
                    <Toaster />
                  </ToastProvider>
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
