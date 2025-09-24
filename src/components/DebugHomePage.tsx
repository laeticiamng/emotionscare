import React from 'react';

export default function DebugHomePage() {
  console.log('[DebugHomePage] Component rendered');
  
  try {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#333' }}>🔧 Debug HomePage</h1>
        <p>Si vous voyez ce message, React fonctionne correctement.</p>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px' 
        }}>
          <h2>Informations de diagnostic :</h2>
          <ul>
            <li>✅ React component rendered successfully</li>
            <li>✅ Basic styling applied</li>
            <li>✅ Router working (you're seeing this page)</li>
            <li>Date actuelle: {new Date().toLocaleDateString('fr-FR')}</li>
            <li>Heure: {new Date().toLocaleTimeString('fr-FR')}</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <a href="/login" style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007cba',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Test Link → Login
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[DebugHomePage] Error in render:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee' }}>
        <h1 style={{ color: '#d32f2f' }}>❌ Error in DebugHomePage</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}