
import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Connexion Générale</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <p className="text-lg">Page Connexion - TODO: Formulaire de connexion</p>
          <div className="mt-4 space-y-2">
            <a href="/b2c/login" className="block text-yellow-300 underline hover:text-yellow-100">
              → Connexion B2C
            </a>
            <a href="/b2b/user/login" className="block text-yellow-300 underline hover:text-yellow-100">
              → Connexion B2B Utilisateur
            </a>
            <a href="/b2b/admin/login" className="block text-yellow-300 underline hover:text-yellow-100">
              → Connexion B2B Admin
            </a>
            <a href="/" className="block text-yellow-300 underline hover:text-yellow-100">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
