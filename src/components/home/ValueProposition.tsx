
import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: "Confidentialité & Sécurité",
    description: "Chiffrement AES-256, RGPD compliant, données anonymisées"
  },
  {
    title: "Engagement Ludique",
    description: "Daily Streak, badges, défis et récompenses personnalisés"
  },
  {
    title: "Solutions Actionnables",
    description: "Alertes prédictives, recommandations ciblées, rapports détaillés"
  }
];

const ValueProposition: React.FC = () => {
  return (
    <div className="glassmorphism p-8 md:p-10 mb-12 rounded-2xl">
      <h2 className="text-3xl font-semibold text-center mb-8 heading-elegant">
        Pourquoi EmotionsCare<span className="text-xs align-super">™</span> ?
      </h2>
      
      <p className="text-center text-lg mb-10 max-w-4xl mx-auto text-balance">
        Parce que chaque collaborateur mérite d'être entendu, compris et soutenu dans son quotidien professionnel.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ValueProposition;
