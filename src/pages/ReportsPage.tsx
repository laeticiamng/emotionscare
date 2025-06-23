
import React from 'react';
import { Link } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-600 to-teal-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">📊 Rapports et Analytics</h1>
          <p className="text-xl mb-8 text-green-100">
            Analyses détaillées du bien-être organisationnel
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-300">📈 Rapport Mensuel</h3>
              <p className="text-green-100">Évolution du bien-être sur 30 jours</p>
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                Générer
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-teal-300">📋 Rapport Équipes</h3>
              <p className="text-teal-100">Comparaison inter-équipes</p>
              <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg">
                Générer
              </button>
            </div>
          </div>
          
          <Link to="/b2b/admin/dashboard" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour au dashboard admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
