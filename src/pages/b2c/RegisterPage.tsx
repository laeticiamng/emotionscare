
import React from 'react';
import { Link } from 'react-router-dom';

const B2CRegisterPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Inscription B2C</h1>
            <p className="text-blue-100">Créez votre compte personnel EmotionsCare</p>
          </div>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input 
                  type="password" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Créer mon compte
              </button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-blue-100">
                Déjà un compte ? 
                <Link to="/b2c/login" className="text-blue-300 hover:text-blue-100 underline ml-1">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-blue-300 hover:text-blue-100 underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CRegisterPage;
