
import React from 'react';

const Point20Page: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">📊 Point 20</h1>
          <p className="text-2xl mb-8 text-purple-100">
            Page de feedback et amélioration continue
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-300">✅ Point 20 actif</h2>
            <p className="text-lg text-purple-100">
              Cette page fonctionne parfaitement et sert de référence !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-400">🏠 Accueil</h3>
              <a href="/" className="text-yellow-300 underline hover:text-yellow-100">
                Retour à l'accueil
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">🧪 Test</h3>
              <a href="/test" className="text-yellow-300 underline hover:text-yellow-100">
                Page de test
              </a>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">📊 Point 20</h3>
              <p className="text-purple-100">Vous êtes ici</p>
            </div>
          </div>

          <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4">
            <h3 className="font-semibold text-purple-300 mb-2">🔍 Debug Info</h3>
            <p className="text-sm text-purple-200">
              Route actuelle: {window.location.pathname}<br/>
              Timestamp: {new Date().toLocaleTimeString()}<br/>
              Status: Référence fonctionnelle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Point20Page;
