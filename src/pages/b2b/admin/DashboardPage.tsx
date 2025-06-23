
import React from 'react';
import { Link } from 'react-router-dom';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-red-600 to-rose-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">⚡ Tableau de bord Administrateur</h1>
          <p className="text-red-100">Gestion RH et analyse organisationnelle</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-300">👥 Collaborateurs</h3>
            <div className="text-2xl mb-2">247</div>
            <p className="text-red-100">Utilisateurs actifs</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-pink-300">📈 Engagement</h3>
            <div className="text-2xl mb-2">89%</div>
            <p className="text-pink-100">Taux de participation</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">😊 Bien-être global</h3>
            <div className="text-2xl mb-2">7.8/10</div>
            <p className="text-orange-100">Score moyen organisation</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">⚠️ Alertes</h3>
            <div className="text-2xl mb-2">3</div>
            <p className="text-yellow-100">Signalements en cours</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Link to="/teams" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm">Équipes</p>
          </Link>
          <Link to="/reports" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm">Rapports</p>
          </Link>
          <Link to="/events" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm">Événements</p>
          </Link>
          <Link to="/settings" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-sm">Paramètres</p>
          </Link>
          <Link to="/notifications" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-sm">Notifications</p>
          </Link>
          <Link to="/audit" className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">Audit</p>
          </Link>
        </div>
        
        <div className="text-center">
          <Link to="/" className="text-red-300 hover:text-red-100 underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
