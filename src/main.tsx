import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProviders from './AppProviders';
import './index.css';

// Configuration de l'attribut lang pour l'accessibilité
document.documentElement.lang = 'fr';

// Configuration des métadonnées d'accessibilité
document.title = 'EmotionsCare - Plateforme d\'intelligence émotionnelle';

// Ajouter les métadonnées d'accessibilité manquantes
const addAccessibilityMeta = () => {
  // Meta description si manquante
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = 'Plateforme d\'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.';
    document.head.appendChild(metaDesc);
  }
  
  // Meta viewport si manquante
  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(metaViewport);
  }
  
  // Meta charset si manquante
  if (!document.querySelector('meta[charset]')) {
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    document.head.appendChild(metaCharset);
  }
};

addAccessibilityMeta();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);