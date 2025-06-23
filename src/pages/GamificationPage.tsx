
import React from 'react';
import { Link } from 'react-router-dom';

const GamificationPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">🎮 Gamification</h1>
          <p className="text-xl mb-8 text-purple-100">
            Transformez votre bien-être en aventure ludique
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">Achievements</h3>
              <p className="text-yellow-100">Débloquez des récompenses</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Points XP</h3>
              <p className="text-blue-100">Gagnez de l'expérience</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4 text-green-300">Défis</h3>
              <p className="text-green-100">Relevez des challenges</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🏅</div>
              <h3 className="text-xl font-semibold mb-4 text-red-300">Classements</h3>
              <p className="text-red-100">Comparez vos progrès</p>
            </div>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-purple-300 mb-2">🎪 Système de progression</h3>
            <p className="text-sm text-purple-200">
              Plus vous utilisez EmotionsCare, plus vous progressez et débloquez de nouvelles fonctionnalités !
            </p>
          </div>
          
          <Link to="/" className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
