
import React from 'react';

const B2CLoginPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Connexion B2C</h1>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/70"
                placeholder="Votre mot de passe"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
            >
              Se connecter
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-blue-300 hover:text-blue-100 underline">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CLoginPage;
