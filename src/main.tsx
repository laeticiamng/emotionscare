
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[Main] React version:', React.version);
console.log('[Main] Starting app initialization...');

// Wait for DOM to be ready and ensure React is properly initialized
const initializeApp = async () => {
  // Double-check React is available
  if (!React || !React.createElement || !React.StrictMode) {
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
  
  console.log('[Main] Rendering App with React:', !!React);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Initialize the app
initializeApp().catch(console.error);
