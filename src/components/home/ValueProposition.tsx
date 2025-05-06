
import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: "Confidentialité & Sécurité",
    description: "Chiffrement AES-256, RGPD compliant, données anonymisées pour une protection maximale de vos informations personnelles."
  },
  {
    title: "Engagement Ludique",
    description: "Daily Streak, badges, défis et récompenses personnalisés pour maintenir votre motivation et engagement quotidien."
  },
  {
    title: "Solutions Actionnables",
    description: "Alertes prédictives, recommandations ciblées et rapports détaillés pour transformer les données en actions concrètes."
  }
];

const ValueProposition: React.FC = () => {
  return (
    <div className="glassmorphism p-10 md:p-14 mb-12 rounded-3xl shadow-premium">
      <h2 className="text-3xl font-semibold text-center mb-10 heading-elegant">
        Pourquoi EmotionsCare<span className="text-xs align-super">™</span> ?
      </h2>
      
      <p className="text-center text-lg mb-12 max-w-4xl mx-auto text-balance text-[1.05rem] leading-relaxed">
        Parce que chaque collaborateur mérite d'être entendu, compris et soutenu dans son quotidien professionnel.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
