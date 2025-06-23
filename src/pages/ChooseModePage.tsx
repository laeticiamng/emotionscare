
import React from 'react';
import { Link } from 'react-router-dom';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Choisir votre mode d'utilisation</h1>
          <p className="text-xl mb-12 text-indigo-100">
            Sélectionnez comment vous souhaitez utiliser EmotionsCare
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/b2c/login" className="bg-white/10 p-8 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold mb-4 text-blue-300">Mode B2C</h2>
              <p className="text-blue-100">Utilisation personnelle pour gérer votre bien-être émotionnel</p>
            </Link>
            
            <Link to="/b2b/selection" className="bg-white/10 p-8 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold mb-4 text-orange-300">Mode B2B</h2>
              <p className="text-orange-100">Solution pour les entreprises et équipes RH</p>
            </Link>
          </div>
          
          <div className="mt-12">
            <Link to="/" className="text-indigo-300 hover:text-indigo-100 underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
