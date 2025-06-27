
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import MusicProvider from './contexts/MusicContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './router/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  console.log('🚀 App component mounting...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MusicProvider>
            <div className="min-h-screen bg-background">
              <ErrorBoundary fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de routage</h1>
                    <p className="text-muted-foreground">Une erreur s'est produite lors du chargement de la page.</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Consultez /emergency pour plus de détails
                    </p>
                  </div>
                </div>
              }>
                <AppRouter />
              </ErrorBoundary>
            </div>
          </MusicProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
