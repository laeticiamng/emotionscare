
import React from 'react';
import { Link } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-orange-600 to-amber-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">👥 Tableau de bord Collaborateur</h1>
          <p className="text-orange-100">Votre espace bien-être en entreprise</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">🎯 Bien-être</h3>
            <div className="text-2xl mb-2">8.2/10</div>
            <p className="text-orange-100">Score cette semaine</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">📊 Équipe</h3>
            <div className="text-2xl mb-2">15 personnes</div>
            <p className="text-yellow-100">Membres actifs</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-300">🏆 Rang</h3>
            <div className="text-2xl mb-2">#3</div>
            <p className="text-red-100">Dans votre département</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/scan" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">Scan Quotidien</p>
          </Link>
          <Link to="/music" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🎵</div>
            <p className="text-sm">Pause Musicale</p>
          </Link>
          <Link to="/gamification" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-sm">Défis Équipe</p>
          </Link>
          <Link to="/coach" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm">Coach RH</p>
          </Link>
        </div>
        
        <div className="text-center">
          <Link to="/" className="text-orange-300 hover:text-orange-100 underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
