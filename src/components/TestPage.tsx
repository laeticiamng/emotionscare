import React from 'react';

export default function TestPage() {
  console.log('[TestPage] Rendering basic test component');
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🔧 Test Minimal Component
      </h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Si vous voyez ce message, React fonctionne.
      </p>
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Informations de base:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Composant React rendu</li>
          <li>✅ CSS inline appliqué</li>
          <li>✅ Date: {new Date().toLocaleDateString()}</li>
          <li>✅ Heure: {new Date().toLocaleTimeString()}</li>
        </ul>
      </div>
    </div>
  );
}