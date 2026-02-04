import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2';
import { RootProvider } from '@/providers';
import { logger } from '@/lib/logger';
import { registerServiceWorker } from '@/lib/serviceWorkerRegistration';
import { initWebVitals } from '@/lib/webVitals';
import '@/index.css';

// Configuration des logs
logger.info('🚀 EmotionsCare Platform Loading...', undefined, 'SYSTEM');

// Initialiser Web Vitals tracking
initWebVitals();

// Enregistrer le Service Worker
registerServiceWorker({
  onSuccess: () => {
    logger.info('✅ Service Worker ready for offline use', {}, 'SYSTEM');
  },
  onUpdate: () => {
    logger.info('🔄 New version available', {}, 'SYSTEM');
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  const error = 'Root element not found';
  logger.error(error, new Error(error), 'SYSTEM');
  throw new Error(error);
}

logger.debug('✅ Root element found', undefined, 'SYSTEM');

createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </RootProvider>
  </StrictMode>
);

logger.info('✅ Application rendered successfully', undefined, 'SYSTEM');
