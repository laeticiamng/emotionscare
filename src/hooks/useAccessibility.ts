/**
 * useAccessibility Hook - Gestion complète de l'accessibilité
 * WCAG 2.1 AAA compliant
 */

import { useCallback, useEffect, useRef } from 'react';

interface UseAccessibilityReturn {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  handleSkipLink: (targetId: string) => void;
  generateId: (prefix?: string) => string;
  trapFocus: (containerRef: React.RefObject<HTMLElement>) => () => void;
  isReducedMotion: () => boolean;
  prefersHighContrast: () => boolean;
  announceToScreenReader: (message: string) => void;
}

let idCounter = 0;

export const useAccessibility = (): UseAccessibilityReturn => {
  const announceRef = useRef<HTMLDivElement>(null);

  // Créer la région d'annonce si elle n'existe pas
  useEffect(() => {
    let announceRegion = document.getElementById('accessibility-announcements');
    if (!announceRegion) {
      announceRegion = document.createElement('div');
      announceRegion.id = 'accessibility-announcements';
      announceRegion.setAttribute('aria-live', 'polite');
      announceRegion.setAttribute('aria-atomic', 'true');
      announceRegion.className = 'sr-only';
      document.body.appendChild(announceRegion);
    }
    announceRef.current = announceRegion as HTMLDivElement;

    return () => {
      // Nettoyage au démontage
      const existingRegion = document.getElementById('accessibility-announcements');
      if (existingRegion && existingRegion.children.length === 0) {
        existingRegion.remove();
      }
    };
  }, []);

  // Annoncer un message aux lecteurs d'écran
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceRef.current) return;

    // Nettoyer le message précédent
    announceRef.current.textContent = '';
    
    // Mettre à jour la priorité si nécessaire
    if (announceRef.current.getAttribute('aria-live') !== priority) {
      announceRef.current.setAttribute('aria-live', priority);
    }

    // Annoncer le nouveau message après un petit délai pour garantir l'annonce
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = message;
      }
    }, 100);

    // Nettoyer après 5 secondes
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = '';
      }
    }, 5000);
  }, []);

  // Alias pour compatibility
  const announceToScreenReader = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  // Gérer les liens de saut
  const handleSkipLink = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announce(`Navigation vers ${target.getAttribute('aria-label') || targetId}`);
    }
  }, [announce]);

  // Générer un ID unique
  const generateId = useCallback((prefix = 'accessibility') => {
    return `${prefix}-${++idCounter}`;
  }, []);

  // Piège à focus pour les modales
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return () => {};

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        const closeButton = container.querySelector('[aria-label*="Fermer"], [aria-label*="Close"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus le premier élément au montage
    setTimeout(() => {
      firstFocusable?.focus();
    }, 100);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Détecter si l'utilisateur préfère le mouvement réduit
  const isReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Détecter si l'utilisateur préfère un contraste élevé
  const prefersHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);

  return {
    announce,
    handleSkipLink,
    generateId,
    trapFocus,
    isReducedMotion,
    prefersHighContrast,
    announceToScreenReader
  };
};