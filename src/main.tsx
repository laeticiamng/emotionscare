import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

console.log('🔴 MAIN.TSX LOADED');

function App() {
  console.log('🔴 APP RENDER');
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        ✅ EMOTIONSCARE FONCTIONNE
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        L'application React se charge correctement!
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>📊 Status:</h2>
        <ul style={{ fontSize: '18px', lineHeight: '1.8' }}>
          <li>✅ React chargé</li>
          <li>✅ Main.tsx exécuté</li>
          <li>✅ Tailwind CSS chargé</li>
          <li>⏳ Providers à ajouter</li>
          <li>⏳ Router à intégrer</li>
        </ul>
      </div>
      <p style={{ fontSize: '16px', opacity: 0.8 }}>
        Timestamp: {new Date().toISOString()}
      </p>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  console.error('🔴 ROOT NOT FOUND');
  document.body.innerHTML = '<h1 style="color:red;padding:20px;">ERREUR: #root introuvable</h1>';
} else {
  console.log('🔴 RENDERING...');
  createRoot(root).render(<App />);
  console.log('🔴 RENDER DONE');
}
