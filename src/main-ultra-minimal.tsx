/**
 * TEST ULTRA-MINIMAL - Bypasse tout pour tester React seul
 */

console.log('🚀 STEP 1: main-ultra-minimal.tsx loading...');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('✅ STEP 2: Imports OK');

const rootElement = document.getElementById('root');

console.log('✅ STEP 3: Root element:', rootElement);

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red; padding: 50px;">❌ Root element not found</h1>';
  throw new Error('Root element not found');
}

console.log('✅ STEP 4: Creating root...');

const App = () => {
  console.log('✅ STEP 5: App component rendering');
  
  React.useEffect(() => {
    console.log('✅ STEP 6: useEffect executed - React is WORKING!');
  }, []);

  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'system-ui',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#22c55e' }}>✅ React fonctionne!</h1>
      <p>Si vous voyez ceci, React se charge correctement.</p>
      <p><strong>Le problème vient donc d'un provider ou d'un composant spécifique.</strong></p>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        marginTop: '20px',
        borderRadius: '8px'
      }}>
        <h2>🔍 Prochaines étapes:</h2>
        <ol>
          <li>Tester avec AuthProvider seul</li>
          <li>Ajouter les providers un par un</li>
          <li>Identifier le provider qui bloque</li>
          <li>Corriger ou remplacer le provider défectueux</li>
        </ol>
      </div>

      <div style={{ 
        background: '#fef2f2', 
        padding: '20px', 
        marginTop: '20px',
        borderRadius: '8px',
        border: '2px solid #ef4444'
      }}>
        <h2>⚠️ Pour revenir à l'app normale:</h2>
        <p>Il faut restaurer <code>src/main.tsx</code> et corriger les providers.</p>
      </div>
    </div>
  );
};

console.log('✅ STEP 7: Rendering App...');

createRoot(rootElement).render(<App />);

console.log('✅ STEP 8: App rendered successfully!');
