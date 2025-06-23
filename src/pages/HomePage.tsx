import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 text-white">EmotionsCare</h1>
          <p className="text-2xl mb-8 text-blue-100">
            Plateforme de bien-être émotionnel - Toutes routes fonctionnelles
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {/* Diagnostic Route */}
            <Link to="/route-diagnostic" className="bg-green-500/20 border border-green-400 p-4 rounded-lg backdrop-blur-sm hover:bg-green-500/30 transition-colors">
              <h3 className="font-semibold text-green-300">🔍 Test toutes les routes</h3>
              <p className="text-xs text-green-200">Diagnostic complet</p>
            </Link>
            
            {/* Routes principales */}
            <Link to="/choose-mode" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-green-400">🎯 Choix du mode</h3>
            </Link>
            
            {/* Routes B2C */}
            <Link to="/b2c/login" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-blue-400">👤 B2C Login</h3>
            </Link>
            <Link to="/b2c/register" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-blue-400">📝 B2C Register</h3>
            </Link>
            <Link to="/b2c/dashboard" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-blue-400">📊 B2C Dashboard</h3>
            </Link>
            
            {/* Routes B2B */}
            <Link to="/b2b/selection" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-orange-400">🏢 B2B Sélection</h3>
            </Link>
            <Link to="/b2b/user/login" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-orange-400">👥 B2B User Login</h3>
            </Link>
            <Link to="/b2b/admin/login" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-red-400">⚡ B2B Admin Login</h3>
            </Link>
            
            {/* Fonctionnalités principales */}
            <Link to="/scan" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-purple-400">🔍 Scan Émotions</h3>
            </Link>
            <Link to="/music" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-pink-400">🎵 Musique</h3>
            </Link>
            <Link to="/coach" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-green-400">🤖 Coach IA</h3>
            </Link>
            <Link to="/journal" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-yellow-400">📖 Journal</h3>
            </Link>
            <Link to="/vr" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-cyan-400">🥽 Réalité Virtuelle</h3>
            </Link>
            <Link to="/gamification" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-green-400">🎮 Gamification</h3>
            </Link>
            
            {/* Pages existantes */}
            <Link to="/test" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-red-400">🧪 Test</h3>
            </Link>
            <Link to="/point20" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-purple-400">📊 Point 20</h3>
            </Link>
          </div>

          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
            <h3 className="font-semibold text-green-300 mb-2">✅ Système de routage unifié activé</h3>
            <p className="text-sm text-green-200">
              {/* Mise à jour du compteur de routes */}
              25+ routes connectées - Dernière mise à jour: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
