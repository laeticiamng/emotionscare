
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Validation critique de React
console.log('=== MAIN.TSX INITIALIZATION ===');

// Validation plus robuste de React
if (!React || typeof React.useState !== 'function') {
  console.error('CRITICAL: React ou ses hooks ne sont pas disponibles');
  throw new Error('React hooks not available - critical initialization failure');
}

console.log('✅ React hooks validation passed');

// Initialisation sécurisée de l'application
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found - Check index.html');
  }

  console.log('Creating React root...');
  const root = createRoot(rootElement);

  try {
    console.log('Rendering EmotionsCare app...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ EmotionsCare application started successfully');
  } catch (error) {
    console.error('❌ Failed to render application:', error);
    
    // Fallback simple sans StrictMode
    try {
      console.log('Attempting fallback render...');
      root.render(<App />);
      console.log('✅ Fallback render successful');
    } catch (fallbackError) {
      console.error('❌ Critical: Both renders failed:', fallbackError);
      
      // Dernier recours avec message d'erreur
      root.render(
        React.createElement('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            padding: '2rem'
          }
        }, [
          React.createElement('h1', { 
            key: 'title', 
            style: { color: '#dc2626', marginBottom: '1rem' } 
          }, 'Erreur de Démarrage'),
          React.createElement('p', { 
            key: 'message', 
            style: { marginBottom: '1rem' } 
          }, 'EmotionsCare n\'a pas pu démarrer correctement.'),
          React.createElement('button', {
            key: 'reload',
            onClick: () => window.location.reload(),
            style: {
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }
          }, 'Recharger la page')
        ])
      );
    }
  }
};

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
