
import React from 'react';

console.log('%c[HomePage] Component file loaded', 'color:purple; font-weight:bold');

const HomePage: React.FC = () => {
  console.log('%c[HomePage] Component function called', 'color:orange; font-weight:bold');
  
  React.useEffect(() => {
    console.log('%c[HomePage] monté', 'color:lime; font-weight:bold');
    return () => console.log('%c[HomePage] Component unmounted', 'color:red');
  }, []);

  // Style inline pour debug - force l'affichage même si CSS/Tailwind bloque
  return (
    <div 
      data-testid="page-root" 
      style={{
        color: 'red', 
        fontSize: '40px', 
        backgroundColor: 'yellow', 
        padding: '20px',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <h1 style={{color:'red', fontSize:40}}>🎉 HELLO HOME - EmotionsCare</h1>
      <p style={{color:'black', fontSize:20}}>
        Si vous voyez ce texte, HomePage fonctionne !
      </p>
      <div style={{color:'blue', fontSize:16}}>
        Debug Info:<br/>
        - Route: {window.location.pathname}<br/>
        - Timestamp: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default HomePage;
