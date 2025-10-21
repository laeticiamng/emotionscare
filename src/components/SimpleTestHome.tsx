// Simple test component to debug white screen
import React from 'react';

const SimpleTestHome: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        ✅ EmotionsCare
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>
        L'application fonctionne correctement
      </p>
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        maxWidth: '600px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          Si vous voyez ce message, le routeur React fonctionne.
        </p>
        <p style={{ color: '#888' }}>
          Version de test - {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SimpleTestHome;
