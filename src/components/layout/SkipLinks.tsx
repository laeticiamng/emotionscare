/**
 * SkipLinks - Navigation rapide pour l'accessibilité
 * Permet aux utilisateurs de clavier/lecteurs d'écran de sauter directement au contenu
 */

import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-ring"
      >
        Aller au contenu principal
      </a>
      <a
        href="#main-navigation"
        className="fixed top-4 left-40 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-ring"
      >
        Aller à la navigation
      </a>
    </div>
  );
};

export default SkipLinks;
