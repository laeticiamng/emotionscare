
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from './AppRouter';
import SecurityProvider from '@/components/security/SecurityProvider';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import './styles/accessibility.css';

// Initialize performance monitoring
if (import.meta.env.PROD) {
  performanceMonitor.recordMetric('app-init', performance.now());
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  React.useEffect(() => {
    // Enregistrer le temps de chargement complet de l'app
    if (import.meta.env.PROD) {
      const loadTime = performance.now();
      performanceMonitor.recordMetric('app-loaded', loadTime);
      console.log(`🚀 App loaded in ${loadTime.toFixed(2)}ms`);
    }
  }, []);

  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <UserModeProvider>
                <AppRouter />
                <Toaster />
              </UserModeProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </SecurityProvider>
  );
};

export default App;
