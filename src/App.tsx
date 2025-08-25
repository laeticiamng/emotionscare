import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
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
        <Router>
          <AppRouter />
        </Router>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('❌ Erreur dans App:', error);
    return <div style={{color: 'red', padding: '20px', background: 'white'}}>Erreur App: {error?.message}</div>;
  }
}

export default App;