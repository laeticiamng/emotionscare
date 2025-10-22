import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

console.log('🚀 Main.tsx executed');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('✅ Root element found');

createRoot(rootElement).render(
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '24px'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1>✅ React Works!</h1>
      <p>EmotionsCare is loading...</p>
    </div>
  </div>
);

console.log('✅ React rendered');
