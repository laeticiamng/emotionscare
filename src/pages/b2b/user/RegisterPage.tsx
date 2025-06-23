
import React from 'react';
import { Link } from 'react-router-dom';

const B2BUserRegisterPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-orange-600 to-red-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Inscription Collaborateur</h1>
            <p className="text-orange-100">Rejoignez votre organisation sur EmotionsCare</p>
          </div>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Code d'invitation</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="Code fourni par votre RH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email professionnel</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                  placeholder="nom@entreprise.com"
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
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Rejoindre l'organisation
              </button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-orange-100">
                Déjà inscrit ? 
                <Link to="/b2b/user/login" className="text-orange-300 hover:text-orange-100 underline ml-1">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/b2b/selection" className="text-orange-300 hover:text-orange-100 underline">
              ← Retour à la sélection B2B
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BUserRegisterPage;
