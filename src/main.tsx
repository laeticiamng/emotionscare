// @ts-nocheck
// BACKUP DU FICHIER MAIN.TSX ORIGINAL
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

// Initialiser les services critiques
logger.info('Application starting', undefined, 'SYSTEM');

// Initialiser les services de monitoring de manière asynchrone après le render
const initServices = async () => {
  // Import Sentry pour le monitoring (pas critique)
  try {
    const { initSentry } = await import('@/observability/sentry.client');
    if (initSentry) {
      initSentry();
    }
    logger.info('Sentry initialized', undefined, 'SYSTEM');
  } catch (error) {
    logger.warn('Sentry failed to initialize', error as Error, 'SYSTEM');
  }

  // Import monitoring de performance (optionnel)
  try {
    const { initPerformanceMonitoring } = await import('@/lib/performance');
    initPerformanceMonitoring();
    logger.info('Performance monitoring initialized', undefined, 'SYSTEM');
  } catch (error) {
    logger.warn('Performance monitoring failed', error as Error, 'SYSTEM');
  }

  // Import monitoring général (optionnel)
  try {
    const { initMonitoring } = await import('@/lib/monitoring');
    initMonitoring();
    logger.info('Monitoring initialized', undefined, 'SYSTEM');
  } catch (error) {
    logger.warn('Monitoring failed', error as Error, 'SYSTEM');
  }
};

// Démarrer l'initialisation des services après le chargement
initServices().catch(err => {
  logger.warn('Services initialization failed', err as Error, 'SYSTEM');
});

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
