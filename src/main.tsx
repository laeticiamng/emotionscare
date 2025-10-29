import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2';
import { RootProvider } from '@/providers';
import { logger } from '@/lib/logger';
import { ensureSentryClient } from '@/lib/obs/sentry.web';
import '@/index.css';

// Initialize monitoring (Sentry)
ensureSentryClient();

// Configuration des logs
logger.info('🚀 EmotionsCare Platform Loading...', undefined, 'SYSTEM');

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
      <RouterProvider router={router} />
    </RootProvider>
  </StrictMode>
);

logger.info('✅ Application rendered successfully', undefined, 'SYSTEM');
