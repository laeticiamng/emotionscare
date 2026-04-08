// @ts-nocheck
// rebuild: 2026-04-08T09:00
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2';
import { RootProvider } from '@/providers';
import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </RootProvider>
  </StrictMode>
);

// Defer non-critical initialisation after first paint
requestIdleCallback(() => {
  import('@/lib/logger').then(({ logger }) => {
    logger.info('🚀 EmotionsCare Platform Loaded', undefined, 'SYSTEM');
  });
  import('@/lib/webVitals').then(({ initWebVitals }) => initWebVitals());
  import('@/lib/serviceWorkerRegistration').then(({ registerServiceWorker }) => {
    registerServiceWorker();
  });
});
