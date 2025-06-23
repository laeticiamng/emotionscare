
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Politique de Confidentialité</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <p className="text-lg">Page Confidentialité - TODO: Politique RGPD</p>
          <a href="/" className="text-yellow-300 underline hover:text-yellow-100 mt-4 inline-block">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
