
import React from 'react';

const Home: React.FC = () => {
  console.log('Home component rendering successfully');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              EmotionsCare
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Votre plateforme de bien-être émotionnel pour une vie plus équilibrée
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg">
              Commencer votre parcours
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200 dark:border-gray-600 px-8 py-3 rounded-lg font-medium transition-colors">
              En savoir plus
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Scan Émotionnel
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analysez vos émotions en temps réel avec notre IA avancée
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Musicothérapie
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Découvrez des playlists personnalisées selon votre humeur
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Coach IA
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bénéficiez de conseils personnalisés de notre coach virtuel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
