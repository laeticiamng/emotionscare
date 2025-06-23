
import React from 'react';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">🎵 Musicothérapie</h1>
          <p className="text-xl mb-8 text-indigo-100">
            Thérapie par la musique adaptée à vos émotions
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-300">✅ Module Musique Actif</h2>
            <p className="text-lg text-indigo-100">
              Le module de musicothérapie est opérationnel
            </p>
          </div>

          <a href="/" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors inline-block">
            🏠 Retour Accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
