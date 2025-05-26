
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Diagnostics de démarrage
console.log('EmotionsCare - Initialisation:', {
  React: !!React,
  hooks: { 
    useState: !!React.useState, 
    useContext: !!React.useContext,
    useEffect: !!React.useEffect
  },
  StrictMode: !!StrictMode,
  timestamp: new Date().toISOString()
});

// Ensure React is globally available for compatibility
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('React défini globalement pour compatibilité');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément root introuvable - Vérifiez index.html');
}

console.log('Création du root React...');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('Application EmotionsCare démarrée avec succès');
