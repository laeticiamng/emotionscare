
import React from 'react';

console.log('🏠 Home component rendering...');

const Home: React.FC = () => {
  console.log('🏠 Home component function called');
  
  React.useEffect(() => {
    console.log('🏠 Home component mounted');
    return () => console.log('🏠 Home component unmounted');
  }, []);

  return (
    <div data-testid="page-root" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: 'red',
          background: 'yellow',
          padding: '1rem',
          border: '3px solid black'
        }}>
          HELLO HOME - EmotionsCare
        </h1>
        
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#f0f8ff' }}>
          🎉 PAGE D'ACCUEIL FONCTIONNELLE - VERSION DEBUG
        </p>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#90EE90' }}>
            ✅ Status : Page montée avec succès
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#f0f8ff' }}>
            Si vous voyez ce contenu, la route "/" fonctionne parfaitement !
          </p>
        </div>

        <div style={{
          background: 'rgba(255,0,0,0.2)',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>🔍 Debug Info</h3>
          <p style={{ fontSize: '0.9rem', color: '#ffcccc' }}>
            Route: {window.location.pathname}<br/>
            Timestamp: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
