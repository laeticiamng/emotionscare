
import React from 'react';

console.log('🧪 TestPage component rendering...');

const TestPage: React.FC = () => {
  console.log('🧪 TestPage function called');
  
  React.useEffect(() => {
    console.log('🧪 TestPage mounted');
    return () => console.log('🧪 TestPage unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold">PAGE TEST - ROUGE VISIBLE</h1>
      <p className="text-lg mb-4">Si vous voyez cette page rouge, le routage fonctionne !</p>
      <a href="/" className="text-yellow-300 underline hover:text-yellow-100">
        Retour accueil
      </a>
      
      <div className="mt-8 bg-black/20 p-4 rounded">
        <h3 className="font-semibold">🔍 Debug Info TestPage</h3>
        <p className="text-sm">
          Route actuelle: {window.location.pathname}<br/>
          Timestamp: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default TestPage;
