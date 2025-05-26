
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[Main] React version:', React.version);
console.log('[Main] Starting app initialization...');

// Ensure React is available globally before any rendering
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Wait for DOM to be ready
const initializeApp = async () => {
  // Ensure React is properly initialized
  if (!React || !React.createElement) {
    console.error('[Main] React not properly loaded');
    return;
  }

  // Initialize security in production
  if (import.meta.env.PROD) {
    try {
      const { initProductionSecurity } = await import('@/lib/security/productionSecurity');
      initProductionSecurity();
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('[Main] Root element not found');
    return;
  }

  console.log('[Main] Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('[Main] Rendering App...');
  root.render(
    React.createElement(React.StrictMode, {}, 
      React.createElement(App)
    )
  );
};

// Initialize the app
initializeApp().catch(console.error);
