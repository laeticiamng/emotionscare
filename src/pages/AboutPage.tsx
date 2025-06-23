
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-600 to-teal-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">À propos d'EmotionsCare</h1>
          <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
            EmotionsCare est une plateforme révolutionnaire de bien-être émotionnel qui utilise l'intelligence artificielle 
            pour vous aider à comprendre, gérer et améliorer votre santé mentale.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-300">🧠 IA Avancée</h3>
              <p className="text-green-100">Analyse émotionnelle en temps réel</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-teal-300">🎵 Musicothérapie</h3>
              <p className="text-teal-100">Recommandations musicales personnalisées</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">🥽 Réalité Virtuelle</h3>
              <p className="text-blue-100">Expériences immersives de relaxation</p>
            </div>
          </div>
          
          <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
