
import React from 'react';

const BrowsingPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Navigation</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <p className="text-lg">Page Navigation - TODO: Interface de navigation</p>
          <a href="/" className="text-yellow-300 underline hover:text-yellow-100 mt-4 inline-block">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrowsingPage;
