// @ts-nocheck
/**
 * Utilitaires spécialisés pour les opérations DOM sécurisées
 * Prévient spécifiquement les erreurs "Cannot read properties of undefined (reading 'add')"
 */

import { safeClassAdd, safeClassRemove, safeClassToggle, safeGetDocumentRoot } from './safe-helpers';
import { logger } from '@/lib/logger';

/**
 * Interface pour les opérations DOM sécurisées
 */
interface SafeDOMOperations {
  addClass: (element: Element | null, ...classes: string[]) => void;
  removeClass: (element: Element | null, ...classes: string[]) => void;
  toggleClass: (element: Element | null, className: string, force?: boolean) => boolean;
  hasClass: (element: Element | null, className: string) => boolean;
  getAttribute: (element: Element | null, name: string) => string | null;
  setAttribute: (element: Element | null, name: string, value: string) => void;
  setStyle: (element: HTMLElement | null, property: string, value: string) => void;
}

/**
 * Manager global pour les opérations DOM sécurisées
 */
class DOMSafetyManager {
  private static instance: DOMSafetyManager;
  private errorCount = 0;
  private maxErrors = 50;

  static getInstance(): DOMSafetyManager {
    if (!DOMSafetyManager.instance) {
      DOMSafetyManager.instance = new DOMSafetyManager();
    }
    return DOMSafetyManager.instance;
  }

  private logError(operation: string, error: any, context?: any): void {
    this.errorCount++;
    
    if (this.errorCount <= this.maxErrors) {
      logger.warn(`[DOMSafety] ${operation} failed`, { error, context, errorCount: this.errorCount }, 'SYSTEM');
      
      if (this.errorCount === this.maxErrors) {
        logger.warn('[DOMSafety] Maximum error count reached, suppressing further warnings', undefined, 'SYSTEM');
      }
    }
  }

  /**
   * Gestion sécurisée des thèmes
   */
  applyTheme(theme: string): void {
    try {
      const root = safeGetDocumentRoot();
      
      // Supprimer les anciens thèmes
      const themeClasses = ['light', 'dark', 'system', 'high-contrast'];
      themeClasses.forEach(themeClass => {
        safeClassRemove(root, themeClass);
      });
      
      // Ajouter le nouveau thème
      safeClassAdd(root, theme);
      
      // Sauvegarder dans localStorage de manière sécurisée
      try {
        localStorage.setItem('theme', theme);
      } catch (storageError) {
        this.logError('applyTheme localStorage', storageError, { theme });
      }
      
    } catch (error) {
      this.logError('applyTheme', error, { theme });
    }
  }

  /**
   * Gestion sécurisée de l'accessibilité
   */
  applyAccessibilitySettings(settings: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    largeText?: boolean;
    enhancedFocus?: boolean;
  }): void {
    try {
      const root = safeGetDocumentRoot();
      
      if (settings.highContrast !== undefined) {
        if (settings.highContrast) {
          safeClassAdd(root, 'high-contrast');
        } else {
          safeClassRemove(root, 'high-contrast');
        }
      }
      
      if (settings.reducedMotion !== undefined) {
        if (settings.reducedMotion) {
          safeClassAdd(root, 'reduce-motion');
        } else {
          safeClassRemove(root, 'reduce-motion');
        }
      }
      
      if (settings.largeText !== undefined) {
        if (settings.largeText) {
          safeClassAdd(root, 'large-text');
        } else {
          safeClassRemove(root, 'large-text');
        }
      }
      
      if (settings.enhancedFocus !== undefined) {
        if (settings.enhancedFocus) {
          safeClassAdd(root, 'enhanced-focus');
        } else {
          safeClassRemove(root, 'enhanced-focus');
        }
      }
      
    } catch (error) {
      this.logError('applyAccessibilitySettings', error, { settings });
    }
  }

  /**
   * Initialisation sécurisée des éléments critiques
   */
  initializeCriticalElements(): void {
    try {
      // Vérifier que le document est prêt
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeCriticalElements());
        return;
      }

      // Initialiser html element si manquant
      if (!document.documentElement) {
        logger.warn('[DOMSafety] documentElement missing, creating fallback', undefined, 'SYSTEM');
        const html = document.createElement('html');
        document.appendChild(html);
      }

      // Initialiser body si manquant
      if (!document.body) {
        logger.warn('[DOMSafety] body missing, creating fallback', undefined, 'SYSTEM');
        const body = document.createElement('body');
        document.documentElement.appendChild(body);
      }

      // Ajouter les classes de base nécessaires
      const root = safeGetDocumentRoot();
      safeClassAdd(root, 'dom-safety-initialized');

    } catch (error) {
      this.logError('initializeCriticalElements', error);
    }
  }

  /**
   * Nettoyage des ressources DOM
   */
  cleanup(): void {
    try {
      this.errorCount = 0;
      logger.info('[DOMSafety] Cleanup completed', undefined, 'SYSTEM');
    } catch (error) {
      logger.error('[DOMSafety] Cleanup failed', error as Error, 'SYSTEM');
    }
  }

  /**
   * Obtient les statistiques d'erreurs
   */
  getStats(): { errorCount: number; maxErrors: number } {
    return {
      errorCount: this.errorCount,
      maxErrors: this.maxErrors
    };
  }
}

// Instance globale
export const domSafety = DOMSafetyManager.getInstance();

/**
 * Hook pour initialiser la sécurité DOM
 */
export function initializeDOMSafety(): void {
  // Initialiser au chargement
  if (typeof window !== 'undefined') {
    domSafety.initializeCriticalElements();
    
    // Cleanup au déchargement
    window.addEventListener('beforeunload', () => {
      domSafety.cleanup();
    });
  }
}

/**
 * Wrapper sécurisé pour les opérations DOM communes
 */
export const safeDOMOps: SafeDOMOperations = {
  addClass: safeClassAdd,
  removeClass: safeClassRemove,
  toggleClass: safeClassToggle,
  
  hasClass: (element: Element | null, className: string): boolean => {
    if (!element || !element.classList || !className) {
      return false;
    }
    try {
      return element.classList.contains(className);
    } catch (error) {
      logger.warn('[safeDOMOps.hasClass] Failed', { error, element, className }, 'SYSTEM');
      return false;
    }
  },
  
  getAttribute: (element: Element | null, name: string): string | null => {
    if (!element || !name) {
      return null;
    }
    try {
      return element.getAttribute(name);
    } catch (error) {
      logger.warn('[safeDOMOps.getAttribute] Failed', { error, element, name }, 'SYSTEM');
      return null;
    }
  },
  
  setAttribute: (element: Element | null, name: string, value: string): void => {
    if (!element || !name) {
      return;
    }
    try {
      element.setAttribute(name, value);
    } catch (error) {
      logger.warn('[safeDOMOps.setAttribute] Failed', { error, element, name, value }, 'SYSTEM');
    }
  },
  
  setStyle: (element: HTMLElement | null, property: string, value: string): void => {
    if (!element || !element.style || !property) {
      return;
    }
    try {
      element.style.setProperty(property, value);
    } catch (error) {
      logger.warn('[safeDOMOps.setStyle] Failed', { error, element, property, value }, 'SYSTEM');
    }
  }
};

// Initialisation automatique
if (typeof window !== 'undefined') {
  initializeDOMSafety();
}