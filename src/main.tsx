
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
