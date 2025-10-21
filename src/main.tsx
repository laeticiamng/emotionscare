// @ts-nocheck
import { logger } from '@/lib/logger';
import i18n from '@/lib/i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './styles/accessibility.css';
import './theme/theme.css';
import { Loader2 } from 'lucide-react';
import AccessibilitySkipLinks from '@/components/AccessibilitySkipLinks';
import RootErrorBoundary from '@/components/error/RootErrorBoundary';
import { RootProvider } from '@/providers';
import { router } from '@/routerV2/router';

// Initialiser le logger en premier
logger.info('Application starting', undefined, 'SYSTEM');

// Imports critiques avec error handling (non bloquants)
import('@/observability/sentry.client')
  .then(() => logger.info('Sentry client loaded', undefined, 'SYSTEM'))
  .catch((error) => logger.error('Failed to load Sentry', error as Error, 'SYSTEM'));

// Monitoring optionnel - ne doit pas bloquer l'app
import('@/lib/performance')
  .then(({ initPerformanceMonitoring }) => {
    initPerformanceMonitoring();
    logger.info('Performance monitoring loaded', undefined, 'SYSTEM');
  })
  .catch((error) => logger.warn('Performance monitoring failed to load', error as Error, 'SYSTEM'));

import('@/lib/monitoring')
  .then(({ initMonitoring }) => {
    initMonitoring();
    logger.info('Monitoring loaded', undefined, 'SYSTEM');
  })
  .catch((error) => logger.warn('Monitoring failed to load', error as Error, 'SYSTEM'));

// Ajouter les métadonnées d'accessibilité essentielles
const addAccessibilityMeta = () => {
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content =
      "Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.";
    document.head.appendChild(metaDesc);
  }

  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(metaViewport);
  }
};

const enableGlobalImageOptimizations = () => {
  const enhance = (img: HTMLImageElement) => {
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
  };

  const scan = (root: ParentNode | HTMLImageElement) => {
    if (root instanceof HTMLImageElement) {
      enhance(root);
      return;
    }
    root.querySelectorAll?.('img').forEach((element) => {
      if (element instanceof HTMLImageElement) {
        enhance(element);
      }
    });
  };

  scan(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          enhance(node);
        } else if (node instanceof HTMLElement) {
          scan(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language?.split('-')[0] ?? 'fr';
  document.title = "EmotionsCare - Plateforme d'intelligence émotionnelle";
  addAccessibilityMeta();
}

if (typeof window !== 'undefined') {
  document.body.classList.add('enhanced-focus');
  enableGlobalImageOptimizations();
  logger.info('Global optimizations enabled', undefined, 'SYSTEM');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  const error = new Error('Application root element not found');
  logger.error('Fatal: Root element missing', error, 'SYSTEM');
  throw error;
}

logger.info('Root element found, rendering app', undefined, 'SYSTEM');

createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <React.Suspense
        fallback={
          <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
            <Loader2 aria-hidden className="mb-6 h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Chargement de l'application…</p>
              <p className="text-sm text-muted-foreground">
                Nous préparons votre espace émotionnel, merci de patienter.
              </p>
            </div>
          </div>
        }
      >
        <RootProvider>
          <AccessibilitySkipLinks />
          <RouterProvider router={router} />
        </RootProvider>
      </React.Suspense>
    </RootErrorBoundary>
  </React.StrictMode>
);
