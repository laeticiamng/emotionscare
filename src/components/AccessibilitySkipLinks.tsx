import React from 'react';

/**
 * Composant de liens d'évitement pour l'accessibilité
 * Permet aux utilisateurs de naviguer rapidement au clavier
 */
const AccessibilitySkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a 
        href="#main-content" 
        className="skip-link focus-visible-ring"
      >
        Aller au contenu principal
      </a>
      <a 
        href="#main-navigation" 
        className="skip-link focus-visible-ring"
        style={{ left: '140px' }}
      >
        Aller à la navigation
      </a>
      <a 
        href="#search" 
        className="skip-link focus-visible-ring"
        style={{ left: '280px' }}
      >
        Aller à la recherche
      </a>
    </div>
  );
};

export default AccessibilitySkipLinks;