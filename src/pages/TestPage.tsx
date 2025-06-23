
import React from 'react';

console.log('🧪 TestPage: Component loading...');

const TestPage: React.FC = () => {
  console.log('🧪 TestPage: Component rendering');
  
  React.useEffect(() => {
    console.log('🧪 TestPage: Component mounted');
    return () => console.log('🧪 TestPage: Component unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8 text-white">🧪 Page de Test</h1>
          <p className="text-xl mb-8 text-green-100">
            Cette page sert à tester les fonctionnalités
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-300">✅ Test Page ACTIVE</h2>
            <p className="text-lg text-green-100">
              La page de test fonctionne correctement !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-400">🏠 Retour Accueil</h3>
              <a href="/" className="text-yellow-300 underline hover:text-yellow-100">
                Aller à l'accueil
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
              <a href="/point20" className="text-yellow-300 underline hover:text-yellow-100">
                Aller au Point 20
              </a>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
            <h3 className="font-semibold text-blue-300 mb-2">🔍 Debug Info</h3>
            <p className="text-sm text-blue-200">
              Route actuelle: {window.location.pathname}<br/>
              Test réussi: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
