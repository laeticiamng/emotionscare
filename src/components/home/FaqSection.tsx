
import React from 'react';

const FaqSection: React.FC = () => {
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Foire aux questions</h2>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-fade-in transform transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ animationDelay: "100ms" }}>
          <h3 className="text-xl font-medium mb-2">Comment fonctionne l'analyse émotionnelle ?</h3>
          <p className="text-gray-600">
            Notre système utilise des algorithmes d'intelligence artificielle pour analyser votre texte ou votre voix et détecter votre état émotionnel actuel. Il propose ensuite des recommandations adaptées pour améliorer votre bien-être.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-fade-in transform transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ animationDelay: "200ms" }}>
          <h3 className="text-xl font-medium mb-2">Mes données sont-elles sécurisées ?</h3>
          <p className="text-gray-600">
            Absolument. Nous prenons la confidentialité très au sérieux. Toutes vos données sont cryptées et ne sont jamais partagées avec des tiers. Vous pouvez également activer le mode confidentiel pour une sécurité renforcée.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
