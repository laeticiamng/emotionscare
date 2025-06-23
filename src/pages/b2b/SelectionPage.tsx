
import React from 'react';

const B2BSelectionPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Espace B2B</h1>
          <p className="text-xl text-gray-300">Choisissez votre type d'accès</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">👤 Collaborateur</h2>
            <p className="text-gray-300 mb-6">
              Accès utilisateur pour les employés
            </p>
            <a 
              href="/b2b/user/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Accès Collaborateur
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-400">⚙️ Administration</h2>
            <p className="text-gray-300 mb-6">
              Accès administrateur pour les RH
            </p>
            <a 
              href="/b2b/admin/login"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Accès Administration
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a href="/" className="text-gray-400 hover:text-gray-200 underline">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
