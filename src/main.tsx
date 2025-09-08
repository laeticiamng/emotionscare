import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { premiumRouter } from './core/PremiumRouter';
import AppProviders from './AppProviders';
import './index.css';
import './styles/accessibility.css';

// Production optimizations avec protection
import { logProductionEvent } from './utils/consoleCleanup';

// Configuration de l'attribut lang pour l'accessibilité
document.documentElement.lang = 'fr';
document.title = 'EmotionsCare - Plateforme d\'Intelligence Émotionnelle Premium';

// Ajouter les métadonnées essentielles de manière sécurisée
const addEssentialMeta = () => {
  try {
    // Meta description si manquante
    if (!document.querySelector('meta[name="description"]')) {
      const metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = 'Plateforme premium d\'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants alimentés par l\'IA.';
      document.head.appendChild(metaDesc);
    }
    
    // Meta viewport si manquante
    if (!document.querySelector('meta[name="viewport"]')) {
      const metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(metaViewport);
    }
    
    // Meta charset si manquante
    if (!document.querySelector('meta[charset]')) {
      const metaCharset = document.createElement('meta');
      metaCharset.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(metaCharset, document.head.firstChild);
    }
    
    // Theme color pour PWA
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#3b82f6';
      themeColor.media = '(prefers-color-scheme: light)';
      document.head.appendChild(themeColor);
      
      const darkThemeColor = document.createElement('meta');
      darkThemeColor.name = 'theme-color';
      darkThemeColor.content = '#1e293b';
      darkThemeColor.media = '(prefers-color-scheme: dark)';
      document.head.appendChild(darkThemeColor);
    }

    // Apple touch icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.sizes = '180x180';
      appleIcon.href = '/apple-touch-icon.png';
      document.head.appendChild(appleIcon);
    }
  } catch (error) {
    logProductionEvent('Meta Setup Error', error, 'error');
  }
};

// Initialize accessibility and performance optimizations
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Add essential meta tags
  addEssentialMeta();
  
  // Set up performance monitoring for development
  if (process.env.NODE_ENV === 'development') {
    try {
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
    } catch (error) {
      logProductionEvent('Performance Observer Error', error, 'error');
    }
  }
  
  // Initialize accessibility features after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    try {
      // Mark app as initialized for CSS
      document.documentElement.setAttribute('data-app-initialized', 'true');
      
      // Add accessibility landmark labels
      const main = document.querySelector('main');
      if (main && !main.getAttribute('aria-label')) {
        main.setAttribute('aria-label', 'Contenu principal de l\'application');
      }
    } catch (error) {
      logProductionEvent('DOM Setup Error', error, 'error');
    }
  });
}

// Global error handling avec protection
const handleGlobalError = (event: ErrorEvent) => {
  try {
    logProductionEvent('Uncaught Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }, 'error');
  } catch (e) {
    // Silent fail to prevent error loops
  }
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  try {
    logProductionEvent('Unhandled Promise Rejection', {
      reason: event.reason,
      stack: event.reason?.stack
    }, 'error');
  } catch (e) {
    // Silent fail to prevent error loops
  }
};

// Add error listeners with protection
if (typeof window !== 'undefined') {
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
}

// Render App with Premium Router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={premiumRouter} />
    </AppProviders>
  </React.StrictMode>
);