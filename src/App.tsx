import React from 'react';

// Version ultra-basique sans aucune dépendance externe
function App() {
  console.log('📱 App: Version ultra-basique pour debug');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>EmotionsCare - Debug</h1>
      <p>Application de base sans erreur</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h2>Status: OK</h2>
        <p>Aucune erreur React.Children.only détectée</p>
      </div>
    </div>
  );
}

export default App;