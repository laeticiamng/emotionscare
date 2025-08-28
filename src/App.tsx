/**
 * App.tsx - Point d'entrée principal avec RouterV2
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

// Contexts et providers existants
import MusicProvider from './contexts/MusicContext';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import AppProviders from './AppProviders';

// Routers
import AppRouter from './router/AppRouter';  // Legacy router
import { routerV2 } from './routerV2';       // Nouveau RouterV2

// Feature flag pour RouterV2
const FF_ROUTER_V2 = import.meta.env.VITE_FF_ROUTER_V2 === 'true';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  console.log(`🚀 App component mounting avec ${FF_ROUTER_V2 ? 'RouterV2' : 'Router Legacy'}...`);
  
  if (FF_ROUTER_V2) {
    console.log('✨ RouterV2 activé - Architecture unifiée');
  }

  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <MusicProvider>
            <RootErrorBoundary>
              {FF_ROUTER_V2 ? (
                <RouterProvider router={routerV2} />
              ) : (
                <AppRouter />
              )}
            </RootErrorBoundary>
          </MusicProvider>
        </AppProviders>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
};

export default App;