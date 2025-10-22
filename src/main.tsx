import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('🚀 MAIN.TSX LOADED');

const App = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#667eea',
    color: 'white',
    fontFamily: 'system-ui',
    fontSize: '32px',
    fontWeight: 'bold'
  }}>
    ✅ REACT WORKS - EmotionsCare Loading...
  </div>
);

const root = document.getElementById('root');
if (!root) throw new Error('No root');

console.log('✅ ROOT FOUND');
createRoot(root).render(<App />);
console.log('✅ REACT RENDERED');
