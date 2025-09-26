import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 Starting EmotionsCare App...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red;">ROOT ELEMENT NOT FOUND</h1>';
} else {
  console.log('✅ Root element found, starting React app...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ EmotionsCare app rendered successfully');
  } catch (error) {
    console.error('❌ React render failed:', error);
    rootElement.innerHTML = `
      <div style="min-h: 100vh; background: white; color: black; padding: 20px;">
        <h1 style="color: red;">EmotionsCare - Erreur de Rendu</h1>
        <p style="color: black;">Erreur: ${error}</p>
        <p style="color: black;">Veuillez recharger la page.</p>
      </div>
    `;
  }
}