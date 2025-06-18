
import React from 'react';

const TestHome = () => {
  console.log('TestHome is rendering - NO LAZY LOADING');
  
  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      backgroundColor: 'red',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <div>
        <h1>TEST PAGE - SI VOUS VOYEZ CECI, ÇA MARCHE!</h1>
        <p>Route: /</p>
        <button 
          onClick={() => console.log('Button clicked!')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestHome;
