
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import AppErrorBoundary from '@/components/ErrorBoundary/AppErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from './AppRouter';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <AppErrorBoundary level="critical">
      <ThemeProvider defaultTheme="system" storageKey="emotionscare-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <AppErrorBoundary level="page">
                <AppRouter />
                <Toaster />
              </AppErrorBoundary>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
