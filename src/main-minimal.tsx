// TEST MINIMAL - Diagnostic écran blanc
import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('=== MAIN.TSX CHARGÉ ===');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ ROOT ELEMENT NOT FOUND');
  throw new Error('Root element not found');
}

console.log('✅ ROOT ELEMENT FOUND');

function MinimalApp() {
  console.log('✅ MINIMAL APP RENDERING');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui',
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>
        ✅ React fonctionne !
      </h1>
      <p style={{ color: '#666' }}>
        Si vous voyez ce message, React charge correctement.
      </p>
      <details style={{ marginTop: '20px' }}>
        <summary>Diagnostic système</summary>
        <pre style={{ background: '#fff', padding: '10px', marginTop: '10px' }}>
{JSON.stringify({
  timestamp: new Date().toISOString(),
  location: window.location.href,
  userAgent: navigator.userAgent,
  screen: `${window.screen.width}x${window.screen.height}`
}, null, 2)}
        </pre>
      </details>
    </div>
  );
}

try {
  console.log('🚀 CREATING ROOT...');
  const root = createRoot(rootElement);
  console.log('🚀 RENDERING...');
  root.render(<MinimalApp />);
  console.log('✅ RENDER COMPLETE');
} catch (error) {
  console.error('❌ RENDER ERROR:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h1>❌ Erreur de rendu</h1>
      <pre>${error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  `;
}
