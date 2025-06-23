
import React from 'react';
import { Link } from 'react-router-dom';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">🤖 Coach IA EmotionsCare</h1>
          <p className="text-xl mb-8 text-green-100">
            Votre assistant personnel pour le bien-être émotionnel
          </p>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm max-w-2xl mx-auto mb-8">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-4 text-green-300">Coach disponible 24h/24</h2>
            <p className="text-green-100 mb-6">
              Discutez avec notre IA spécialisée en bien-être émotionnel. 
              Obtenez des conseils personnalisés, des exercices de respiration et des techniques de gestion du stress.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Commencer une conversation
            </button>
          </div>
          
          <Link to="/" className="text-green-300 hover:text-green-100 underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
