// @ts-nocheck

import { useEffect, useCallback } from 'react';
import { announceToScreenReader } from '@/utils/accessibility';

export const useAccessibility = () => {
  // Gestion du focus pour les modales
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Fermer la modale sur Escape
        const closeButton = containerRef.current?.querySelector('[data-close-modal]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  // Annonces pour lecteurs d'écran
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  // Skip links management
  const handleSkipLink = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Gestion des raccourcis clavier globaux
  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K pour ouvrir le menu de commandes
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const commandMenu = document.querySelector('[data-command-menu]') as HTMLElement;
        commandMenu?.click();
      }
      
      // Échap pour fermer les overlays
      if (e.key === 'Escape') {
        const activeOverlay = document.querySelector('[data-overlay-active]') as HTMLElement;
        const closeButton = activeOverlay?.querySelector('[data-close]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyboard);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyboard);
    };
  }, []);

  return {
    trapFocus,
    announce,
    handleSkipLink,
    // Helper pour les IDs uniques
    generateId: (prefix: string = 'element') => 
      `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};
