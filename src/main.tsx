
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('%c[Main] Démarrage VERSION DEBUG - AUCUN PROVIDER', 'color:purple; font-weight:bold');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('%c[Main] ✅ App rendu sans providers', 'color:green; font-weight:bold');
