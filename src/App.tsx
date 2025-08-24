import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MusicProvider from './contexts/MusicContext';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import AppProviders from './AppProviders';
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
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <MusicProvider>
            <RootErrorBoundary>
              <AppRouter />
            </RootErrorBoundary>
          </MusicProvider>
        </AppProviders>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
};

export default App;