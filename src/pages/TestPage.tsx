
import React from 'react';

const TestPage: React.FC = () => {
  console.log('🧪 TestPage component rendering...');
  
  React.useEffect(() => {
    console.log('🧪 TestPage mounted');
    return () => console.log('🧪 TestPage unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">🧪 Page de Test</h1>
          <p className="text-xl mb-8 text-green-100">
            Cette page sert aux tests et au débogage
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-300">✅ Test Page Active</h2>
            <p className="text-lg text-green-100">
              La page de test fonctionne maintenant correctement avec le router unifié !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">🔧 Fonctionnalités</h3>
              <ul className="text-left text-green-100 space-y-2">
                <li>• Router unifié actif</li>
                <li>• Lazy loading fonctionnel</li>
                <li>• Error boundary en place</li>
                <li>• Suspense configuré</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">🧭 Navigation</h3>
              <div className="space-y-2">
                <a href="/" className="block text-yellow-300 underline hover:text-yellow-100">
                  ← Retour à l'accueil
                </a>
                <a href="/point20" className="block text-yellow-300 underline hover:text-yellow-100">
                  Aller au Point 20
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
            <h3 className="font-semibold text-blue-300 mb-2">🔍 Debug Info</h3>
            <p className="text-sm text-blue-200">
              Route: {window.location.pathname}<br/>
              User Agent: {navigator.userAgent.slice(0, 50)}...<br/>
              Timestamp: {new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
