import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/accessibility.css';
import './theme/theme.css';
import { ThemeProvider, I18nProvider } from '@/COMPONENTS.reg';
import { initializeSentry, monitorDOMErrors } from '@/lib/sentry-config';

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

if (typeof window !== 'undefined') {
  initializeSentry();
  monitorDOMErrors();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);