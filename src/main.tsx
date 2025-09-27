import '@/observability/sentry.client';
import i18n from '@/lib/i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/accessibility.css';
import './theme/theme.css';

// Métadonnées d'accessibilité
const addAccessibilityMeta = () => {
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = "Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel.";
    document.head.appendChild(metaDesc);
  }

  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(metaViewport);
  }
};

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language?.split('-')[0] ?? 'fr';
  document.title = "EmotionsCare - Plateforme d'intelligence émotionnelle";
  addAccessibilityMeta();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Application root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);