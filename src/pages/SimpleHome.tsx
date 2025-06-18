import React from 'react';

const SimpleHome: React.FC = () => {
  console.log('SimpleHome component is rendering');
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f9ff',
      color: '#1e40af'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          EmotionsCare
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Plateforme de bien-être émotionnel
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: '#ec4899', 
              color: 'white',
              border: 'none',
              borderRadius: '2rem',
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/b2c/login'}
          >
            Espace Personnel
          </button>
          <button 
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'transparent', 
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '2rem',
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/b2b/selection'}
          >
            Espace Entreprise
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHome;