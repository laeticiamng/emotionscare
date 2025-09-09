import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { routerV2 } from './routerV2';
import AppProviders from './AppProviders';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import AccessibilityToolbar from './components/layout/AccessibilityToolbar';
import './index.css';
import './styles/accessibility.css';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <AppProviders>
        <RouterProvider router={routerV2} />
        <AccessibilityToolbar />
      </AppProviders>
    </GlobalErrorBoundary>
  </React.StrictMode>
);