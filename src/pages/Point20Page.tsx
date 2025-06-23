
import React from 'react';

console.log('📊 Point20Page component rendering...');

const Point20Page: React.FC = () => {
  console.log('📊 Point20Page function called');
  
  React.useEffect(() => {
    console.log('📊 Point20Page mounted');
    return () => console.log('📊 Point20Page unmounted');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">Point 20 - Feedback</h1>
          <p className="text-2xl mb-8 text-purple-100">
            Centre de feedback et amélioration continue
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-300">✅ Point 20 Actif</h2>
            <p className="text-lg text-purple-100">
              Module de feedback et amélioration continue fonctionnel !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-400">📝 Feedback</h3>
              <p className="text-purple-100">Système de retours utilisateurs</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">📈 Métriques</h3>
              <p className="text-purple-100">Analyse des performances</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">🔄 Amélioration</h3>
              <p className="text-purple-100">Processus d'amélioration continue</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors">
              🏠 Retour Accueil
            </a>
            <a href="/test" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors">
              🧪 Page Test
            </a>
          </div>

          <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4">
            <h3 className="font-semibold text-purple-300 mb-2">🔍 Point 20 Info</h3>
            <p className="text-sm text-purple-200">
              Route actuelle: {window.location.pathname}<br/>
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Point20Page;
