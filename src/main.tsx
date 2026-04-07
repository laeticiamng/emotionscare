// @ts-nocheck
// rebuild: 2026-04-07T12:01
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// Global error handler to catch crashes before React mounts
window.addEventListener('error', (event) => {
  console.error('[BOOT] Uncaught error:', event.error?.message || event.message, event.error?.stack);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('[BOOT] Unhandled rejection:', event.reason?.message || event.reason, event.reason?.stack);
});

let router: any;
let RootProvider: any;

try {
  const routerModule = await import('@/routerV2');
  router = routerModule.router;
  const providersModule = await import('@/providers');
  RootProvider = providersModule.RootProvider;
} catch (err: any) {
  console.error('[BOOT] Failed to load modules:', err?.message, err?.stack);
  document.getElementById('root')!.innerHTML = `<div style="padding:2rem;font-family:system-ui"><h1>Erreur de chargement</h1><pre>${err?.message}\n${err?.stack}</pre></div>`;
  throw err;
}

import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <RootProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </RootProvider>
    </StrictMode>
  );
} catch (err: any) {
  console.error('[BOOT] Render failed:', err?.message, err?.stack);
  rootElement.innerHTML = `<div style="padding:2rem;font-family:system-ui"><h1>Erreur de rendu</h1><pre>${err?.message}\n${err?.stack}</pre></div>`;
}

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
