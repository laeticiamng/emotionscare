
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProviders from './AppProviders';
import './index.css';

console.log('%c[Main] Démarrage VERSION AVEC PROVIDERS', 'color:purple; font-weight:bold');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);

console.log('%c[Main] ✅ App rendu avec providers complets', 'color:green; font-weight:bold');
