
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/accessibility.css';
import { validateStartup } from './utils/startupCheck';

// Ensure React is available globally for proper hook functionality
// This is critical for framer-motion and other libraries that expect React to be global
if (typeof window !== 'undefined') {
  (window as any).React = React;
  // Also ensure React hooks are available globally
  (window as any).ReactHooks = {
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useRef: React.useRef,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
  };
}

// Also set it on globalThis for better compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
}

// Startup validation - but don't block if it fails
try {
  if (!validateStartup()) {
    console.warn('⚠️ Startup validation failed - some features may not work properly');
  }
} catch (error) {
  console.warn('⚠️ Startup validation error:', error);
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

// Ensure the root element exists before trying to render
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
