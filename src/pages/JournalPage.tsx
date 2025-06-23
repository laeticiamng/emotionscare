
import React from 'react';
import { Link } from 'react-router-dom';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">📖 Journal Émotionnel</h1>
          <p className="text-xl mb-8 text-yellow-100">
            Suivez votre parcours émotionnel au quotidien
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">✍️ Écriture libre</h3>
              <p className="text-yellow-100">Exprimez vos pensées et émotions</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-orange-300">🎤 Journal vocal</h3>
              <p className="text-orange-100">Enregistrez vos réflexions à l'oral</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-red-300">📊 Analyse des tendances</h3>
              <p className="text-red-100">Visualisez votre évolution émotionnelle</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-pink-300">🔒 Confidentialité</h3>
              <p className="text-pink-100">Vos données restent privées et sécurisées</p>
            </div>
          </div>
          
          <Link to="/" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
