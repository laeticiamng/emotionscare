import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import MusicProvider from './contexts/MusicContext';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import AppRouter from './router/AppRouter';
import LiveUXMonitor from '@/components/ux/LiveUXMonitor';

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
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MusicProvider>
            <div className="min-h-screen bg-background">
              <RootErrorBoundary>
                <AppRouter />
              </RootErrorBoundary>
              <LiveUXMonitor />
            </div>
          </MusicProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
};

export default App;