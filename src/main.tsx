/**
 * TEST MINIMAL - Diagnostic écran blanc
 */

console.log('🚀 STEP 1: main.tsx loading...');

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

const TestApp = () => {
  console.log('✅ STEP 5: TestApp rendering');
  
  React.useEffect(() => {
    console.log('✅ STEP 6: useEffect - React works!');
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#22c55e' }}>✅ React fonctionne!</h1>
      <p>JavaScript s'exécute. Ouvrez la console (F12) pour voir les logs.</p>
      <div style={{ background: '#f5f5f5', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <h2>🔍 Diagnostic:</h2>
        <p>Si vous voyez cette page, le problème venait des providers ou du router.</p>
        <p><strong>Prochaine étape:</strong> Réactiver les providers un par un.</p>
      </div>
    </div>
  );
};

console.log('✅ STEP 7: Rendering...');

createRoot(rootElement).render(<TestApp />);

console.log('✅ STEP 8: Rendered!');
