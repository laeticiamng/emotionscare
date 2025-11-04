import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/routerV2';
import '@/index.css';

console.log('🚀 EmotionsCare Loading - Step by step...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

console.log('✅ QueryClient created');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '2rem' }}>
        <h1>Test: QueryClient + Router minimal</h1>
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  </StrictMode>
);

console.log('✅ React mounted');
