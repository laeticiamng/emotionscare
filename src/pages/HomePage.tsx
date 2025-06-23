
import React from 'react';

console.log('🏠 HomePage component rendering...');

const HomePage: React.FC = () => {
  console.log('🏠 HomePage function called');
  
  React.useEffect(() => {
    console.log('🏠 HomePage mounted');
    return () => console.log('🏠 HomePage unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">EmotionsCare</h1>
          <p className="text-2xl mb-8 text-blue-100">
            PAGE D'ACCUEIL - NOUVELLE VERSION
          </p>
          
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-green-300">✅ Page d'accueil fonctionnelle</h2>
            <p className="text-lg text-blue-100">
              Si vous voyez ce contenu, la page d'accueil fonctionne enfin !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-400">🏠 Accueil</h3>
              <p className="text-blue-100">Vous êtes ici - page fonctionnelle</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-red-400">🧪 Test</h3>
              <a href="/test" className="text-yellow-300 underline hover:text-yellow-100">
                Aller à la page test
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
              <a href="/point20" className="text-yellow-300 underline hover:text-yellow-100">
                Aller au Point 20 (fonctionne)
              </a>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
            <h3 className="font-semibold text-blue-300 mb-2">🔍 Debug Info HomePage</h3>
            <p className="text-sm text-blue-200">
              Route actuelle: {window.location.pathname}<br/>
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
