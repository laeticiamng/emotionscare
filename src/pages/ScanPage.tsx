
import React from 'react';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">📱 Scan Émotionnel</h1>
          <p className="text-xl mb-8 text-teal-100">
            Analysez vos émotions en temps réel
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-300">✅ Module Scan Actif</h2>
            <p className="text-lg text-teal-100">
              Le module de scan émotionnel est opérationnel
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

export default ScanPage;
