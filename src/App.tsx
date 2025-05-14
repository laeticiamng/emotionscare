
import React from 'react';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  console.log('🚀 App: Rendu du composant App');
  
  return (
    <>
      <div className="min-h-screen bg-background">
        <h1>Test Affichage</h1>
        <p>Si ce texte s'affiche, le rendu de base fonctionne.</p>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
