
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import AppRouter from "./AppRouter";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Initialiser la validation d'environnement
import '@/lib/env-validation';
import '@/lib/errorBoundary';

console.log('[App] React object:', React);
console.log('[App] React version:', React?.version);

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
  console.log('[App] Rendering...');
  
  // Ensure React is available before rendering
  if (!React || !React.createElement) {
    console.error('[App] React is not available!');
    return React.createElement('div', {}, 'Loading...');
  }
  
  return React.createElement(
    ThemeProvider,
    { defaultTheme: "system", storageKey: "ui-theme" },
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        TooltipProvider,
        { delayDuration: 150 },
        React.createElement(
          BrowserRouter,
          {},
          React.createElement(
            AuthProvider,
            {},
            React.createElement(
              UserModeProvider,
              {},
              React.createElement(
                MusicProvider,
                {},
                React.createElement(SkipToContent),
                React.createElement(Toaster),
                React.createElement(Sonner),
                React.createElement(
                  Suspense,
                  { fallback: React.createElement('div', {}, 'Loading...') },
                  React.createElement(AppRouter)
                )
              )
            )
          )
        )
      )
    )
  );
}

export default App;
