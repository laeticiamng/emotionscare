/**
 * ♿ ACCESSIBILITY PROVIDER PREMIUM
 * Fournisseur d'accessibilité avancé pour EmotionsCare
 * Conformité WCAG AAA et optimisations spécifiques
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { announceToScreenReader } from '@/utils/accessibility';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
  colorBlindFriendly: boolean;
  
  // Audio
  audioDescriptions: boolean;
  soundEffects: boolean;
  voiceSpeed: number; // 0.5 to 2.0
  
  // Keyboard & Navigation
  keyboardNavigation: boolean;
  skipLinks: boolean;
  focusIndicators: boolean;
  
  // Cognitive
  simplifiedInterface: boolean;
  readingGuide: boolean;
  autoSummarize: boolean;
  
  // Motor
  stickyKeys: boolean;
  clickDelay: number; // ms
  dragDistance: number; // pixels
}

interface AccessibilityFeatures {
  // Screen Reader Support
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  
  // Keyboard Navigation
  trapFocus: (containerRef: React.RefObject<HTMLElement>) => () => void;
  skipToContent: (targetId: string) => void;
  
  // Visual Enhancements
  toggleHighContrast: () => void;
  adjustTextSize: (direction: 'increase' | 'decrease' | 'reset') => void;
  
  // Motor Assistance
  enableClickAssist: () => void;
  configureDragThreshold: (pixels: number) => void;
  
  // Cognitive Support
  simplifyInterface: (enable: boolean) => void;
  generateSummary: (content: string) => string;
  
  // Settings Management
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetToDefaults: () => void;
  importSettings: (settings: AccessibilitySettings) => void;
  exportSettings: () => AccessibilitySettings;
}

interface AccessibilityContextType extends AccessibilityFeatures {
  settings: AccessibilitySettings;
  isEnabled: boolean;
  capabilities: {
    screenReader: boolean;
    voiceControl: boolean;
    eyeTracking: boolean;
  };
}

const defaultSettings: AccessibilitySettings = {
  // Visual
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  dyslexicFont: false,
  colorBlindFriendly: false,
  
  // Audio
  audioDescriptions: true,
  soundEffects: true,
  voiceSpeed: 1.0,
  
  // Keyboard & Navigation
  keyboardNavigation: true,
  skipLinks: true,
  focusIndicators: true,
  
  // Cognitive
  simplifiedInterface: false,
  readingGuide: false,
  autoSummarize: false,
  
  // Motor
  stickyKeys: false,
  clickDelay: 0,
  dragDistance: 5
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: React.ReactNode;
  autoDetect?: boolean;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ 
  children, 
  autoDetect = true 
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  
  const [capabilities, setCapabilities] = useState({
    screenReader: false,
    voiceControl: false,
    eyeTracking: false
  });

  // Detect assistive technologies
  useEffect(() => {
    if (!autoDetect) return;

    const detectCapabilities = () => {
      setCapabilities({
        screenReader: !!(
          navigator.userAgent.includes('NVDA') ||
          navigator.userAgent.includes('JAWS') ||
          navigator.userAgent.includes('VoiceOver') ||
          window.speechSynthesis
        ),
        voiceControl: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        eyeTracking: false // Would require specific hardware detection
      });
    };

    detectCapabilities();
  }, [autoDetect]);

  // Apply visual settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // High Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large Text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced Motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Dyslexic Font
    if (settings.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
    
    // Color Blind Friendly
    if (settings.colorBlindFriendly) {
      root.classList.add('color-blind-friendly');
    } else {
      root.classList.remove('color-blind-friendly');
    }
    
    // Simplified Interface
    if (settings.simplifiedInterface) {
      root.classList.add('simplified-interface');
    } else {
      root.classList.remove('simplified-interface');
    }
  }, [settings]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      // Skip to main content (Alt + M)
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        skipToContent('main-content');
      }
      
      // Skip to navigation (Alt + N)
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        skipToContent('main-navigation');
      }
      
      // Open help dialog (Alt + H)
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        announceToScreenReader('Aide à l\'accessibilité ouverte', 'assertive');
      }
    };

    document.addEventListener('keydown', handleGlobalKeyboard);
    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  }, [settings.keyboardNavigation]);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const announceToScreenReaderWrapper = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.audioDescriptions) {
      announceToScreenReader(message, priority);
    }
  }, [settings.audioDescriptions]);

  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current || !settings.keyboardNavigation) return () => {};

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable?.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        const closeButton = containerRef.current?.querySelector('[data-close]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [settings.keyboardNavigation]);

  const skipToContent = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: settings.reducedMotion ? 'auto' : 'smooth' });
      announceToScreenReaderWrapper(`Navigation vers ${targetId}`, 'assertive');
    }
  }, [settings.reducedMotion, announceToScreenReaderWrapper]);

  const toggleHighContrast = useCallback(() => {
    updateSettings({ highContrast: !settings.highContrast });
    announceToScreenReaderWrapper(
      `Contraste élevé ${!settings.highContrast ? 'activé' : 'désactivé'}`,
      'assertive'
    );
  }, [settings.highContrast, updateSettings, announceToScreenReaderWrapper]);

  const adjustTextSize = useCallback((direction: 'increase' | 'decrease' | 'reset') => {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).fontSize);
    
    let newSize = currentSize;
    switch (direction) {
      case 'increase':
        newSize = Math.min(currentSize * 1.1, 24);
        break;
      case 'decrease':
        newSize = Math.max(currentSize * 0.9, 12);
        break;
      case 'reset':
        newSize = 16;
        break;
    }
    
    root.style.fontSize = `${newSize}px`;
    updateSettings({ largeText: newSize > 16 });
    announceToScreenReaderWrapper(`Taille du texte ${direction === 'reset' ? 'réinitialisée' : direction === 'increase' ? 'augmentée' : 'diminuée'}`, 'polite');
  }, [updateSettings, announceToScreenReaderWrapper]);

  const enableClickAssist = useCallback(() => {
    // Implement click assistance for motor disabilities
    const handleMouseDown = (e: MouseEvent) => {
      if (settings.clickDelay > 0) {
        e.preventDefault();
        setTimeout(() => {
          const target = e.target as HTMLElement;
          target.click();
        }, settings.clickDelay);
      }
    };

    if (settings.clickDelay > 0) {
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }
  }, [settings.clickDelay]);

  const configureDragThreshold = useCallback((pixels: number) => {
    updateSettings({ dragDistance: pixels });
  }, [updateSettings]);

  const simplifyInterface = useCallback((enable: boolean) => {
    updateSettings({ simplifiedInterface: enable });
    announceToScreenReaderWrapper(
      `Interface ${enable ? 'simplifiée' : 'complète'} activée`,
      'assertive'
    );
  }, [updateSettings, announceToScreenReaderWrapper]);

  const generateSummary = useCallback((content: string): string => {
    if (!settings.autoSummarize) return content;
    
    // Basic summarization - in production, use AI service
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    if (sentences.length <= 3) return content;
    
    return sentences.slice(0, 2).join('.') + '. [Résumé automatique - Contenu tronqué]';
  }, [settings.autoSummarize]);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
    announceToScreenReaderWrapper('Paramètres d\'accessibilité réinitialisés', 'assertive');
  }, [announceToScreenReaderWrapper]);

  const importSettings = useCallback((importedSettings: AccessibilitySettings) => {
    setSettings({ ...defaultSettings, ...importedSettings });
    announceToScreenReaderWrapper('Paramètres d\'accessibilité importés', 'assertive');
  }, [announceToScreenReaderWrapper]);

  const exportSettings = useCallback(() => {
    return settings;
  }, [settings]);

  const contextValue: AccessibilityContextType = {
    settings,
    isEnabled: Object.values(settings).some(value => value === true),
    capabilities,
    
    // Core functions
    announceToScreenReader: announceToScreenReaderWrapper,
    trapFocus,
    skipToContent,
    
    // Visual enhancements
    toggleHighContrast,
    adjustTextSize,
    
    // Motor assistance
    enableClickAssist,
    configureDragThreshold,
    
    // Cognitive support
    simplifyInterface,
    generateSummary,
    
    // Settings management
    updateSettings,
    resetToDefaults,
    importSettings,
    exportSettings
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Skip Links */}
      {settings.skipLinks && (
        <div className="sr-only focus:not-sr-only fixed top-0 left-0 z-50 bg-primary text-primary-foreground p-2 rounded-br">
          <button
            onClick={() => skipToContent('main-content')}
            className="mr-2 underline"
          >
            Aller au contenu principal
          </button>
          <button
            onClick={() => skipToContent('main-navigation')}
            className="underline"
          >
            Aller à la navigation
          </button>
        </div>
      )}
      
      {/* Live Region for Screen Reader Announcements */}
      <div
        id="accessibility-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <div
        id="accessibility-announcements-assertive"
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  }
  return context;
};

// Accessibility Quick Settings Component
export const AccessibilityQuickSettings: React.FC = () => {
  const {
    settings,
    toggleHighContrast,
    adjustTextSize,
    simplifyInterface,
    updateSettings
  } = useAccessibilityContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 space-y-2">
      <h3 className="font-semibold text-sm mb-3">Accessibilité</h3>
      
      <button
        onClick={toggleHighContrast}
        className={`block w-full text-left text-sm p-2 rounded ${
          settings.highContrast ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
      >
        Contraste élevé
      </button>
      
      <div className="flex gap-1">
        <button
          onClick={() => adjustTextSize('decrease')}
          className="text-xs px-2 py-1 border rounded"
          title="Diminuer le texte"
        >
          A-
        </button>
        <button
          onClick={() => adjustTextSize('reset')}
          className="text-xs px-2 py-1 border rounded"
          title="Taille normale"
        >
          A
        </button>
        <button
          onClick={() => adjustTextSize('increase')}
          className="text-xs px-2 py-1 border rounded"
          title="Augmenter le texte"
        >
          A+
        </button>
      </div>
      
      <button
        onClick={() => simplifyInterface(!settings.simplifiedInterface)}
        className={`block w-full text-left text-sm p-2 rounded ${
          settings.simplifiedInterface ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
      >
        Mode simplifié
      </button>
      
      <button
        onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
        className={`block w-full text-left text-sm p-2 rounded ${
          settings.reducedMotion ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
      >
        Réduire animations
      </button>
    </div>
  );
};