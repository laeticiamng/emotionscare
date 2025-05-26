
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/accessibility.css';
import { validateStartup } from './utils/startupCheck';

// Ensure React is available globally for proper hook functionality
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Startup validation
if (!validateStartup()) {
  console.error('❌ Startup validation failed - some dependencies may be missing');
}

// Configuration des erreurs globales
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // En production, envoyer à un service de monitoring
  if (import.meta.env.PROD && typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.error?.message || 'Unknown error',
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // En production, envoyer à un service de monitoring
  if (import.meta.env.PROD && typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.reason?.message || 'Unhandled promise rejection',
      fatal: false
    });
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
