
import React from 'react';

const B2BAdminLoginPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Connexion Administration</h1>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email administrateur</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70"
                placeholder="admin@entreprise.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70"
                placeholder="Mot de passe administrateur"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-colors"
            >
              Accès Administration
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-2">
            <a href="/b2b/selection" className="text-red-300 hover:text-red-100 underline block">
              ← Retour sélection B2B
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-200 underline block">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminLoginPage;
