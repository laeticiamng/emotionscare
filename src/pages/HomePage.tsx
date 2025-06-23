
import React from 'react';

console.log('🏠 HomePage: Component loading...');

const HomePage: React.FC = () => {
  console.log('🏠 HomePage: Component rendering');
  
  React.useEffect(() => {
    console.log('🏠 HomePage: Component mounted successfully');
    return () => console.log('🏠 HomePage: Component unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">EmotionsCare</h1>
          <p className="text-2xl mb-8 text-blue-100">
            Bienvenue sur la plateforme de bien-être émotionnel
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-green-400">✅ Page d'accueil ACTIVE</h2>
            <p className="text-lg text-blue-100">
              Cette page fonctionne maintenant correctement !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">🏠 Accueil</h3>
              <p className="text-blue-100">Vous êtes ici - page fonctionnelle</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
              <a href="/point20" className="text-yellow-300 underline hover:text-yellow-100">
                Aller au Point 20
              </a>
            </div>
          </div>

          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
            <h3 className="font-semibold text-green-300 mb-2">✅ Status Debug</h3>
            <p className="text-sm text-green-200">
              Route: {window.location.pathname}<br/>
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
