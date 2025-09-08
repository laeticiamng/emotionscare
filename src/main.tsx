import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProviders from './AppProviders';
import './index.css';
import './styles/accessibility.css';

// Production optimizations
import { cleanupConsoleStatements, logProductionEvent } from './utils/consoleCleanup';
import { initializeProductionOptimizations } from './utils/productionSecurity';
import { applyContrastFixes } from './utils/contrastOptimizer';

// Initialize production optimizations
cleanupConsoleStatements();

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
  
  // Add theme-color for PWA
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#3b82f6';
    document.head.appendChild(themeColor);
  }
};

addAccessibilityMeta();

// Initialize security and performance optimizations
if (typeof window !== 'undefined') {
  initializeProductionOptimizations();
  
  // Apply accessibility fixes after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Apply contrast fixes
    const fixesApplied = applyContrastFixes();
    if (fixesApplied > 0) {
      logProductionEvent('Accessibility', `Applied ${fixesApplied} contrast fixes`, 'info');
    }
    
    // Initialize accessibility features
    document.documentElement.setAttribute('data-app-initialized', 'true');
  });
  
  // Performance monitoring for development
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          logProductionEvent('LCP', { value: entry.startTime }, 'info');
        }
        if (entry.entryType === 'first-input') {
          logProductionEvent('FID', { value: (entry as any).processingStart - entry.startTime }, 'info');
        }
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
  }
}

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  logProductionEvent('Uncaught Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  }, 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  logProductionEvent('Unhandled Promise Rejection', {
    reason: event.reason
  }, 'error');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);