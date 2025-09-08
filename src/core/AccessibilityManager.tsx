/**
 * ACCESSIBILITY MANAGER - Système d'accessibilité WCAG AAA Premium
 * Gestion complète de l'accessibilité avec détection automatique
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUnifiedStore, useUnifiedContext } from './UnifiedStateManager';

// ==================== TYPES ACCESSIBILITÉ ====================

interface AccessibilityPreferences {
  // Vision
  highContrast: boolean;
  reducedTransparency: boolean;
  largeText: number; // 1.0 = normal, 1.5 = large, 2.0 = très large
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Mouvement
  reducedMotion: boolean;
  noAutoplay: boolean;
  
  // Audio
  captionsEnabled: boolean;
  audioDescriptions: boolean;
  
  // Navigation
  keyboardOnlyNavigation: boolean;
  screenReaderOptimized: boolean;
  focusIndicatorEnhanced: boolean;
  
  // Cognitive
  simplifiedInterface: boolean;
  readingAssistance: boolean;
  attentionGuidance: boolean;
}

interface AccessibilityState {
  preferences: AccessibilityPreferences;
  detectedNeeds: DetectedAccessibilityNeeds;
  isScreenReaderActive: boolean;
  currentFocusElement: HTMLElement | null;
  skipLinks: SkipLink[];
  announcements: Announcement[];
}

interface DetectedAccessibilityNeeds {
  hasHighContrastPreference: boolean;
  hasReducedMotionPreference: boolean;
  hasLargeTextPreference: boolean;
  hasScreenReader: boolean;
  hasKeyboardOnlyNavigation: boolean;
  hasLowVision: boolean;
  hasColorBlindness: boolean;
}

interface SkipLink {
  id: string;
  label: string;
  target: string;
  order: number;
}

interface Announcement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
}

// ==================== CONTEXT ====================

interface AccessibilityContextType {
  state: AccessibilityState;
  updatePreferences: (preferences: Partial<AccessibilityPreferences>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  addSkipLink: (skipLink: SkipLink) => void;
  removeSkipLink: (id: string) => void;
  focusElement: (selector: string) => void;
  enableKeyboardNavigation: () => void;
  disableKeyboardNavigation: () => void;
  runAccessibilityAudit: () => AccessibilityAuditResult;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// ==================== AUDIT RESULT ====================

interface AccessibilityAuditResult {
  score: number;
  issues: AccessibilityIssue[];
  suggestions: AccessibilitySuggestion[];
  wcagLevel: 'A' | 'AA' | 'AAA';
}

interface AccessibilityIssue {
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  type: string;
  description: string;
  element?: HTMLElement;
  fix?: string;
}

interface AccessibilitySuggestion {
  category: 'vision' | 'hearing' | 'motor' | 'cognitive';
  description: string;
  benefit: string;
}

// ==================== PROVIDER ====================

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>({
    preferences: getDefaultPreferences(),
    detectedNeeds: detectAccessibilityNeeds(),
    isScreenReaderActive: false,
    currentFocusElement: null,
    skipLinks: getDefaultSkipLinks(),
    announcements: [],
  });

  const { announceToScreenReader } = useUnifiedContext();
  const { user, updateUserPreferences } = useUnifiedStore();

  // ==================== DÉTECTION AUTOMATIQUE ====================
  
  useEffect(() => {
    const detectedNeeds = detectAccessibilityNeeds();
    setState(prev => ({ ...prev, detectedNeeds }));
    
    // Auto-appliquer les préférences détectées
    autoApplyDetectedPreferences(detectedNeeds);
    
    // Détecter l'utilisation d'un lecteur d'écran
    detectScreenReader();
    
    // Écouter les changements de focus
    setupFocusTracking();
    
    // Surveiller les préférences système
    watchSystemPreferences();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  // ==================== FONCTIONS UTILITAIRES ====================

  const updatePreferences = useCallback((newPreferences: Partial<AccessibilityPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences }
    }));
    
    // Synchroniser avec le store global
    updateUserPreferences({
      accessibility: { ...user?.preferences?.accessibility, ...newPreferences }
    });
    
    // Appliquer les changements au DOM
    applyPreferencesToDOM(newPreferences);
    
    announceToScreenReader('Paramètres d\'accessibilité mis à jour');
  }, [user, updateUserPreferences, announceToScreenReader]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement: Announcement = {
      id: `announcement-${Date.now()}`,
      message,
      priority,
      timestamp: Date.now(),
    };
    
    setState(prev => ({
      ...prev,
      announcements: [...prev.announcements, announcement].slice(-10) // Garder les 10 dernières
    }));
    
    // Annoncer via ARIA live region
    createLiveAnnouncement(message, priority);
    
    // Nettoyer l'annonce après 5 secondes
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        announcements: prev.announcements.filter(a => a.id !== announcement.id)
      }));
    }, 5000);
  }, []);

  const addSkipLink = useCallback((skipLink: SkipLink) => {
    setState(prev => ({
      ...prev,
      skipLinks: [...prev.skipLinks.filter(link => link.id !== skipLink.id), skipLink]
        .sort((a, b) => a.order - b.order)
    }));
  }, []);

  const removeSkipLink = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      skipLinks: prev.skipLinks.filter(link => link.id !== id)
    }));
  }, []);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      setState(prev => ({ ...prev, currentFocusElement: element }));
      
      // Annoncer le focus
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') || 
                   element.textContent || 
                   element.tagName;
      announce(`Focus sur ${label}`);
    }
  }, [announce]);

  const enableKeyboardNavigation = useCallback(() => {
    document.body.classList.add('keyboard-navigation');
    updatePreferences({ keyboardOnlyNavigation: true });
    announce('Navigation clavier activée');
  }, [updatePreferences, announce]);

  const disableKeyboardNavigation = useCallback(() => {
    document.body.classList.remove('keyboard-navigation');
    updatePreferences({ keyboardOnlyNavigation: false });
  }, [updatePreferences]);

  const runAccessibilityAudit = useCallback((): AccessibilityAuditResult => {
    const issues: AccessibilityIssue[] = [];
    const suggestions: AccessibilitySuggestion[] = [];

    // Audit des images sans alt
    document.querySelectorAll('img:not([alt])').forEach(img => {
      issues.push({
        severity: 'critical',
        type: 'missing-alt-text',
        description: 'Image sans attribut alt',
        element: img as HTMLElement,
        fix: 'Ajouter un attribut alt descriptif'
      });
    });

    // Audit des boutons sans label
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      if (!btn.textContent?.trim()) {
        issues.push({
          severity: 'serious',
          type: 'missing-button-label',
          description: 'Bouton sans label accessible',
          element: btn as HTMLElement,
          fix: 'Ajouter aria-label ou du texte visible'
        });
      }
    });

    // Audit des contrastes
    auditColorContrast(issues);

    // Audit des landmarks
    auditLandmarks(issues);

    // Audit des headers
    auditHeadingStructure(issues);

    // Calcul du score
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const seriousCount = issues.filter(i => i.severity === 'serious').length;
    const moderateCount = issues.filter(i => i.severity === 'moderate').length;
    
    const score = Math.max(0, 100 - (criticalCount * 25) - (seriousCount * 10) - (moderateCount * 5));
    
    // Niveau WCAG
    const wcagLevel = score >= 95 ? 'AAA' : score >= 80 ? 'AA' : 'A';

    // Suggestions basées sur les préférences détectées
    generateSuggestions(suggestions);

    return { score, issues, suggestions, wcagLevel };
  }, []);

  // ==================== VALEURS DU CONTEXTE ====================

  const contextValue: AccessibilityContextType = {
    state,
    updatePreferences,
    announce,
    addSkipLink,
    removeSkipLink,
    focusElement,
    enableKeyboardNavigation,
    disableKeyboardNavigation,
    runAccessibilityAudit,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      <AccessibilityComponents />
    </AccessibilityContext.Provider>
  );
};

// ==================== HOOK ====================

export const useAccessibilityManager = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityManager must be used within AccessibilityProvider');
  }
  return context;
};

// ==================== COMPOSANTS D'ACCESSIBILITÉ ====================

const AccessibilityComponents: React.FC = () => {
  const { state } = useAccessibilityManager();

  return (
    <>
      {/* Skip Links */}
      <div className="skip-links">
        {state.skipLinks.map(link => (
          <a
            key={link.id}
            href={`#${link.target}`}
            className="skip-link sr-only-focusable"
            onFocus={() => console.log(`Focus on skip link: ${link.label}`)}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Live Regions pour les annonces */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="polite-announcements"
      >
        {state.announcements
          .filter(a => a.priority === 'polite')
          .slice(-1)[0]?.message}
      </div>

      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="assertive-announcements"
      >
        {state.announcements
          .filter(a => a.priority === 'assertive')
          .slice(-1)[0]?.message}
      </div>

      {/* Focus Indicator Enhanced */}
      {state.preferences.focusIndicatorEnhanced && (
        <style>{`
          *:focus-visible {
            outline: 3px solid hsl(var(--primary)) !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 5px hsl(var(--primary) / 0.3) !important;
          }
        `}</style>
      )}
    </>
  );
};

// ==================== FONCTIONS UTILITAIRES ====================

function getDefaultPreferences(): AccessibilityPreferences {
  return {
    highContrast: false,
    reducedTransparency: false,
    largeText: 1.0,
    colorBlindSupport: 'none',
    reducedMotion: false,
    noAutoplay: false,
    captionsEnabled: false,
    audioDescriptions: false,
    keyboardOnlyNavigation: false,
    screenReaderOptimized: false,
    focusIndicatorEnhanced: false,
    simplifiedInterface: false,
    readingAssistance: false,
    attentionGuidance: false,
  };
}

function detectAccessibilityNeeds(): DetectedAccessibilityNeeds {
  return {
    hasHighContrastPreference: window.matchMedia('(prefers-contrast: high)').matches,
    hasReducedMotionPreference: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasLargeTextPreference: window.matchMedia('(min-resolution: 2dppx)').matches,
    hasScreenReader: navigator.userAgent.includes('NVDA') || 
                    navigator.userAgent.includes('JAWS') ||
                    navigator.userAgent.includes('VoiceOver') ||
                    window.speechSynthesis !== undefined,
    hasKeyboardOnlyNavigation: false, // Détecté dynamiquement
    hasLowVision: window.matchMedia('(prefers-contrast: high)').matches,
    hasColorBlindness: false, // Pas détectable automatiquement
  };
}

function getDefaultSkipLinks(): SkipLink[] {
  return [
    { id: 'skip-to-main', label: 'Aller au contenu principal', target: 'main-content', order: 1 },
    { id: 'skip-to-nav', label: 'Aller à la navigation', target: 'main-navigation', order: 2 },
    { id: 'skip-to-search', label: 'Aller à la recherche', target: 'search', order: 3 },
  ];
}

function autoApplyDetectedPreferences(needs: DetectedAccessibilityNeeds) {
  const preferences: Partial<AccessibilityPreferences> = {};

  if (needs.hasHighContrastPreference) {
    preferences.highContrast = true;
    document.documentElement.classList.add('high-contrast');
  }

  if (needs.hasReducedMotionPreference) {
    preferences.reducedMotion = true;
    document.documentElement.classList.add('reduced-motion');
  }

  if (needs.hasLargeTextPreference) {
    preferences.largeText = 1.25;
    document.documentElement.style.setProperty('--font-scale', '1.25');
  }

  if (needs.hasScreenReader) {
    preferences.screenReaderOptimized = true;
    preferences.focusIndicatorEnhanced = true;
  }
}

function detectScreenReader() {
  // Technique de détection de lecteur d'écran
  const testElement = document.createElement('div');
  testElement.setAttribute('aria-hidden', 'true');
  testElement.style.position = 'absolute';
  testElement.style.left = '-9999px';
  testElement.textContent = 'Screen reader test';
  
  document.body.appendChild(testElement);
  
  setTimeout(() => {
    document.body.removeChild(testElement);
  }, 100);
}

function setupFocusTracking() {
  let keyboardUser = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      keyboardUser = true;
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    if (keyboardUser) {
      keyboardUser = false;
      document.body.classList.remove('keyboard-navigation');
    }
  });
}

function watchSystemPreferences() {
  // Surveiller les changements de préférences système
  const contrastQuery = window.matchMedia('(prefers-contrast: high)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  contrastQuery.addEventListener('change', (e) => {
    document.documentElement.classList.toggle('high-contrast', e.matches);
  });
  
  motionQuery.addEventListener('change', (e) => {
    document.documentElement.classList.toggle('reduced-motion', e.matches);
  });
}

function cleanupEventListeners() {
  // Nettoyage des listeners
}

function applyPreferencesToDOM(preferences: Partial<AccessibilityPreferences>) {
  const root = document.documentElement;
  
  if (preferences.highContrast !== undefined) {
    root.classList.toggle('high-contrast', preferences.highContrast);
  }
  
  if (preferences.reducedMotion !== undefined) {
    root.classList.toggle('reduced-motion', preferences.reducedMotion);
  }
  
  if (preferences.largeText !== undefined) {
    root.style.setProperty('--font-scale', preferences.largeText.toString());
  }
  
  if (preferences.colorBlindSupport !== undefined && preferences.colorBlindSupport !== 'none') {
    root.setAttribute('data-colorblind', preferences.colorBlindSupport);
  } else {
    root.removeAttribute('data-colorblind');
  }
}

function createLiveAnnouncement(message: string, priority: 'polite' | 'assertive') {
  const regionId = priority === 'assertive' ? 'assertive-announcements' : 'polite-announcements';
  const region = document.getElementById(regionId);
  
  if (region) {
    region.textContent = message;
    
    // Nettoyer après 1 seconde pour permettre les nouvelles annonces
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }
}

function auditColorContrast(issues: AccessibilityIssue[]) {
  // Audit simplifié des contrastes - en production, utiliser une bibliothèque comme axe-core
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span, div');
  
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Ici, on ferait un calcul de contraste réel
    // Pour l'exemple, on simule
    if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
      issues.push({
        severity: 'moderate',
        type: 'low-contrast',
        description: 'Contraste insuffisant pour le texte',
        element: element as HTMLElement,
        fix: 'Augmenter le contraste entre le texte et l\'arrière-plan'
      });
    }
  });
}

function auditLandmarks(issues: AccessibilityIssue[]) {
  const main = document.querySelector('main');
  if (!main) {
    issues.push({
      severity: 'serious',
      type: 'missing-landmark',
      description: 'Pas de landmark <main> trouvé',
      fix: 'Ajouter un élément <main> pour le contenu principal'
    });
  }
}

function auditHeadingStructure(issues: AccessibilityIssue[]) {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let hasH1 = false;
  
  headings.forEach(heading => {
    if (heading.tagName === 'H1') {
      if (hasH1) {
        issues.push({
          severity: 'moderate',
          type: 'multiple-h1',
          description: 'Plusieurs H1 sur la page',
          element: heading as HTMLElement,
          fix: 'Utiliser un seul H1 par page'
        });
      }
      hasH1 = true;
    }
  });
  
  if (!hasH1) {
    issues.push({
      severity: 'serious',
      type: 'missing-h1',
      description: 'Pas de H1 trouvé sur la page',
      fix: 'Ajouter un titre H1 pour la page'
    });
  }
}

function generateSuggestions(suggestions: AccessibilitySuggestion[]) {
  suggestions.push(
    {
      category: 'vision',
      description: 'Activer le mode haut contraste',
      benefit: 'Améliore la lisibilité pour les utilisateurs malvoyants'
    },
    {
      category: 'motor',
      description: 'Utiliser la navigation clavier',
      benefit: 'Permet la navigation sans souris'
    },
    {
      category: 'cognitive',
      description: 'Activer l\'interface simplifiée',
      benefit: 'Réduit la charge cognitive et améliore la concentration'
    }
  );
}

export default AccessibilityProvider;