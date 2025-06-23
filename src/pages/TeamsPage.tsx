
import React from 'react';
import { Link } from 'react-router-dom';

const TeamsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">👥 Gestion des Équipes</h1>
          <p className="text-xl mb-8 text-blue-100">
            Organisez et analysez le bien-être de vos équipes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Équipe Marketing</h3>
              <p className="text-blue-100 mb-2">12 membres</p>
              <div className="text-green-400">Bien-être: 8.5/10</div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Équipe Tech</h3>
              <p className="text-purple-100 mb-2">18 membres</p>
              <div className="text-yellow-400">Bien-être: 7.2/10</div>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-300">Équipe RH</h3>
              <p className="text-green-100 mb-2">6 membres</p>
              <div className="text-green-400">Bien-être: 9.1/10</div>
            </div>
          </div>
          
          <Link to="/b2b/admin/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour au dashboard admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
