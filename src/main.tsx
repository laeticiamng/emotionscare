/**
 * Main.tsx - Version React minimale pour test
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

// Version minimale de test React
function MinimalApp() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'black', fontSize: '32px', marginBottom: '20px' }}>
        ✅ React fonctionne - EmotionsCare
      </h1>
      <p style={{ color: 'black', fontSize: '18px', marginBottom: '20px' }}>
        Test React minimal réussi !
      </p>
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #4caf50'
      }}>
        <h2 style={{ color: 'black', marginBottom: '10px' }}>Status:</h2>
        <ul style={{ color: 'black' }}>
          <li>✅ HTML: OK</li>
          <li>✅ JavaScript: OK</li>
          <li>✅ React: OK</li>
          <li>✅ DOM Rendering: OK</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('React événements fonctionnent!')}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        Test React Event
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red;">ROOT ELEMENT NOT FOUND</h1>';
} else {
  console.log('✅ Root element found, starting React...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<MinimalApp />);
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ React render failed:', error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: white; color: black; padding: 20px;">
        <h1 style="color: red;">React Render Failed</h1>
        <p style="color: black;">Error: ${error}</p>
      </div>
    `;
  }
}