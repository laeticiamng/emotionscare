import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/providers/queryClient';
import { router } from '@/routerV2/router';
import { ErrorProvider, UserModeProvider, ThemeProvider } from '@/contexts';
import '@/index.css';

console.log('🚀 EmotionsCare - Application démarrage');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ ERREUR CRITIQUE: Element root introuvable');
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorProvider>
      <ThemeProvider>
        <UserModeProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </UserModeProvider>
      </ThemeProvider>
    </ErrorProvider>
  </React.StrictMode>
);

console.log('✅ Application React montée avec succès');

