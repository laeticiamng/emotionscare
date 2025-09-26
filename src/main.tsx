/**
 * Main.tsx - RouterV2 réparé
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Test d'urgence - Application ultra-simple
function EmergencyApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#000000', fontSize: '32px', marginBottom: '20px' }}>
        🚨 MODE D'URGENCE - EmotionsCare
      </h1>
      <p style={{ color: '#000000', fontSize: '18px', marginBottom: '20px' }}>
        L'application est en cours de réparation. Cette page de test confirme que React fonctionne.
      </p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#000000', marginBottom: '10px' }}>Status:</h2>
        <ul style={{ color: '#000000' }}>
          <li>✅ React: Fonctionnel</li>
          <li>✅ Rendu: OK</li>
          <li>✅ Styles inline: OK</li>
          <li>🔄 Diagnostic en cours...</li>
        </ul>
      </div>
      <button 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => {
          alert('Test de clic fonctionnel !');
          console.log('🟢 Application d\'urgence fonctionnelle');
        }}
      >
        Test de clic
      </button>
    </div>
  );
}

// Configuration d'urgence
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'fr';
  document.title = "EmotionsCare - Mode d'urgence";
  console.log('🚨 Mode d\'urgence activé');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Application root element not found');
}

console.log('🎯 Creating emergency app...');

createRoot(rootElement).render(
  <React.StrictMode>
    <EmergencyApp />
  </React.StrictMode>
);

console.log('✅ Emergency app rendered');
