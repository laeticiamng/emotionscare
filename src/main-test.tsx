// TEST MINIMAL - Debug écran blanc
import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('=== MAIN TEST STARTING ===');

const TestApp = () => {
  console.log('=== TestApp rendering ===');
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      color: '#00ff00',
      fontSize: '24px',
      fontFamily: 'monospace'
    }}>
      <div>
        <h1>✅ REACT FONCTIONNE</h1>
        <p>Si vous voyez ce message, React se charge correctement</p>
        <p style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
console.log('=== Root element ===', root);

if (!root) {
  document.body.innerHTML = '<div style="color:red;padding:20px;">ERROR: Root element not found</div>';
  throw new Error('Root element not found');
}

console.log('=== Creating React root ===');
createRoot(root).render(<TestApp />);
console.log('=== React render called ===');
