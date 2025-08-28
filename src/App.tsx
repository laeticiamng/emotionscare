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

// RouterV2 unifié - Plus de feature flag, toujours activé
import { routerV2 } from './routerV2';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  console.log('✨ App component mounting avec RouterV2 - Architecture unifiée');

  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <MusicProvider>
            <RootErrorBoundary>
              <RouterProvider router={routerV2} />
            </RootErrorBoundary>
          </MusicProvider>
        </AppProviders>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
};

export default App;