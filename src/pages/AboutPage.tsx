
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">À propos d'EmotionsCare</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            EmotionsCare est une plateforme innovante dédiée au bien-être émotionnel 
            des professionnels de santé.
          </p>
          <p className="text-lg">
            Notre mission est d'accompagner les professionnels de santé dans la gestion 
            de leur bien-être émotionnel grâce à des outils d'IA avancés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
