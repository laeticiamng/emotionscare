
import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg mb-4">
        Bienvenue dans la documentation d'EmotionsCare, votre plateforme de bien-être émotionnel en entreprise.
      </p>
      <div className="grid gap-8 mt-8">
        <div className="card-premium p-6">
          <h2 className="text-2xl font-semibold mb-4">Guide de démarrage</h2>
          <p>
            Découvrez comment utiliser efficacement les différentes fonctionnalités d'EmotionsCare pour améliorer votre bien-être au travail.
          </p>
        </div>
        <div className="card-premium p-6">
          <h2 className="text-2xl font-semibold mb-4">Modules disponibles</h2>
          <p>
            Explorez nos différents modules conçus pour vous aider à gérer vos émotions et améliorer votre bien-être.
          </p>
        </div>
        <div className="card-premium p-6">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <p>
            Trouvez des réponses aux questions fréquemment posées sur l'utilisation d'EmotionsCare.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
