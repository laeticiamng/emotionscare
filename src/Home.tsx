
import React from 'react';

console.log('Home component rendering...');

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-6xl font-bold mb-8">EmotionsCare</h1>
        <p className="text-2xl mb-8">
          Bienvenue sur la plateforme de bien-être émotionnel
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Particuliers</h3>
            <p>Gérez votre stress et cultivez votre bien-être</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Entreprises</h3>
            <p>Solutions pour le bien-être de vos équipes</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Professionnels</h3>
            <p>Outils pour les professionnels de santé</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
