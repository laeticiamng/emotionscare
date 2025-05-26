
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[Main] React version:', React.version);
console.log('[Main] Starting app initialization...');

// Ensure React is available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Initialiser la sécurité en production
if (import.meta.env.PROD) {
  try {
    const { initProductionSecurity } = await import('@/lib/security/productionSecurity');
    initProductionSecurity();
  } catch (error) {
    console.error('Security initialization failed:', error);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
