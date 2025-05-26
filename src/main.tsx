
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Critical React validation
console.log('=== MAIN.TSX INITIALIZATION ===');
console.log('React object:', React);
console.log('React hooks available:', {
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  useContext: !!React?.useContext,
  useMemo: !!React?.useMemo,
  useCallback: !!React?.useCallback
});

// Ensure React is globally available
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('React globally set on window');
}

// Validate React is properly loaded
if (!React || !React.useState || !React.useEffect) {
  console.error('CRITICAL: React hooks not available');
  throw new Error('React hooks not available - critical initialization failure');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found - Check index.html');
}

console.log('Creating React root...');
const root = createRoot(rootElement);

// Render with comprehensive error handling
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
  
  // Fallback render
  try {
    console.log('Attempting fallback render...');
    root.render(<App />);
    console.log('✅ Fallback render successful');
  } catch (fallbackError) {
    console.error('❌ Critical: Both renders failed:', fallbackError);
    
    // Last resort error display
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
        React.createElement('h1', { key: 'title', style: { color: '#dc2626', marginBottom: '1rem' } }, 'Erreur de Démarrage'),
        React.createElement('p', { key: 'message', style: { marginBottom: '1rem' } }, 'EmotionsCare n\'a pas pu démarrer correctement.'),
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
