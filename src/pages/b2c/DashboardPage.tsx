
import React from 'react';
import { Link } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-600 to-teal-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🏠 Tableau de bord B2C</h1>
          <p className="text-green-100">Bienvenue dans votre espace personnel EmotionsCare</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-green-300">😊 Humeur du jour</h3>
            <div className="text-3xl mb-2">😃</div>
            <p className="text-green-100">Joyeux</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">📈 Progression</h3>
            <div className="text-2xl mb-2">75%</div>
            <p className="text-blue-100">Objectifs de bien-être</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">🎯 Streak</h3>
            <div className="text-2xl mb-2">7 jours</div>
            <p className="text-purple-100">Utilisation continue</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/scan" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">Scan Émotions</p>
          </Link>
          <Link to="/music" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🎵</div>
            <p className="text-sm">Musique</p>
          </Link>
          <Link to="/journal" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm">Journal</p>
          </Link>
          <Link to="/coach" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm">Coach IA</p>
          </Link>
        </div>
        
        <div className="text-center">
          <Link to="/" className="text-green-300 hover:text-green-100 underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
