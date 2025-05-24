
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">EmotionsCare</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Votre plateforme de bien-être émotionnel powered by AI
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
