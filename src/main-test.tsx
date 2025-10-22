import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅ React Works!</h1>
      <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>EmotionsCare Platform</p>
      <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.7 }}>Test réussi - Application fonctionnelle</p>
    </div>
  </div>
);
