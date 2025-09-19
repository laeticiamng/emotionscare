import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './styles/accessibility.css';
import './theme/theme.css';
import { I18nProvider } from '@/COMPONENTS.reg';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { initializeSentry, monitorDOMErrors } from '@/lib/sentry-config';
import AccessibilitySkipLinks from '@/components/AccessibilitySkipLinks';
import { RootProvider } from '@/providers';
import { router } from '@/routerV2';

// Configuration de l'attribut lang pour l'accessibilité
document.documentElement.lang = 'fr';
document.title = 'EmotionsCare - Plateforme d\'intelligence émotionnelle';

// Ajouter les métadonnées d'accessibilité essentielles
const addAccessibilityMeta = () => {
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = 'Plateforme d\'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.';
    document.head.appendChild(metaDesc);
  }

  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(metaViewport);
  }
};

addAccessibilityMeta();

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

if (typeof window !== 'undefined') {
  initializeSentry();
  monitorDOMErrors();
  document.body.classList.add('enhanced-focus');
  enableGlobalImageOptimizations();
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <RootProvider>
      <AccessibilityProvider>
        <I18nProvider>
          <AccessibilitySkipLinks />
          <RouterProvider router={router} />
        </I18nProvider>
      </AccessibilityProvider>
    </RootProvider>
  </React.StrictMode>
);
