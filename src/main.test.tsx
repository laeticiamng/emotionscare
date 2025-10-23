// Test ultra-minimal pour vérifier que React se charge
import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('🔴 TEST: main.test.tsx chargé');

function TestApp() {
  console.log('🔴 TEST: TestApp render');
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ REACT FONCTIONNE</h1>
      <p style={{ fontSize: '20px' }}>Si vous voyez ce message, React se charge correctement.</p>
      <p style={{ fontSize: '16px', marginTop: '20px', opacity: 0.8 }}>
        Timestamp: {new Date().toISOString()}
      </p>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('🔴 TEST: Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">ERREUR: Element #root introuvable</h1>';
} else {
  console.log('🔴 TEST: Root element found, rendering...');
  createRoot(rootElement).render(<TestApp />);
  console.log('🔴 TEST: Render complete');
}
