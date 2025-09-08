/**
 * 🎹 KEYBOARD NAVIGATION - EmotionsCare
 * Améliore la navigation clavier sur toute la plateforme
 */

import React, { useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  enableSkipLinks?: boolean;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({ 
  children, 
  enableSkipLinks = true 
}) => {
  const { state, announce } = useAccessibility();

  useEffect(() => {
    if (!state.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Aide contextuelle avec F1
      if (e.key === 'F1') {
        e.preventDefault();
        announce(
          'Navigation clavier : Utilisez Tab pour naviguer, Entrée pour activer, Échap pour fermer. Alt+M pour le menu principal.',
          'assertive'
        );
      }

      // Menu principal avec Alt+M
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mainNav = document.querySelector('[role="navigation"]') as HTMLElement;
        if (mainNav) {
          const firstLink = mainNav.querySelector('a, button') as HTMLElement;
          firstLink?.focus();
          announce('Menu principal ouvert', 'assertive');
        }
      }

      // Recherche avec Alt+S
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('[type="search"], [aria-label*="recherche" i]') as HTMLElement;
        if (searchInput) {
          searchInput.focus();
          announce('Champ de recherche activé', 'assertive');
        }
      }

      // Contenu principal avec Alt+C
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const mainContent = document.querySelector('main, [role="main"]') as HTMLElement;
        if (mainContent) {
          mainContent.focus();
          announce('Contenu principal activé', 'assertive');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.keyboardNavigation, announce]);

  return (
    <>
      {enableSkipLinks && (
        <div className="fixed top-0 left-0 z-[9999]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-primary text-primary-foreground px-4 py-2 rounded-md
                     transition-all duration-200 hover:bg-primary/90"
            onFocus={() => announce('Lien de navigation rapide activé')}
          >
            Aller au contenu principal
          </a>
          <a
            href="#main-navigation"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32
                     bg-primary text-primary-foreground px-4 py-2 rounded-md
                     transition-all duration-200 hover:bg-primary/90"
            onFocus={() => announce('Lien vers navigation principale activé')}
          >
            Aller à la navigation
          </a>
        </div>
      )}
      {children}
    </>
  );
};