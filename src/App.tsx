import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppProviders from '@/AppProviders';
import { AppRouter } from '@/router/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('📱 App: Début du rendu principal');
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Router>
            <AppRouter />
          </Router>
        </AppProviders>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('❌ Erreur dans App:', error);
    return <div style={{color: 'red', padding: '20px', background: 'white'}}>Erreur App: {error?.message}</div>;
  }
}

export default App;