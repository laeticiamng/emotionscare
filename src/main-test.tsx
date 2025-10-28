console.log('🔍 TEST: Script started');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('🔍 TEST: Imports OK');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('🔴 TEST: Root element not found');
  throw new Error('Root element not found');
}

console.log('🔍 TEST: Root element found');

const TestApp = () => {
  console.log('🔍 TEST: TestApp rendering');
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>✅ TEST: Application se charge correctement</h1>
      <p>Si vous voyez ce message, le problème vient des providers ou du router.</p>
    </div>
  );
};

console.log('🔍 TEST: Creating root...');
createRoot(rootElement).render(<TestApp />);
console.log('🔍 TEST: Render complete');
