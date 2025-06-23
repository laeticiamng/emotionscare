
import React from 'react';
import { Link } from 'react-router-dom';

const EventsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">📅 Gestion des Événements</h1>
          <p className="text-xl mb-8 text-purple-100">
            Organisez des événements bien-être pour vos équipes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">🧘 Session Méditation</h3>
              <p className="text-purple-100 mb-2">Demain 14h00</p>
              <p className="text-purple-100">15 participants inscrits</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-pink-300">🎯 Atelier Gestion Stress</h3>
              <p className="text-pink-100 mb-2">Vendredi 16h00</p>
              <p className="text-pink-100">8 participants inscrits</p>
            </div>
          </div>
          
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-4">
            Créer un événement
          </button>
          
          <Link to="/b2b/admin/dashboard" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour au dashboard admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
