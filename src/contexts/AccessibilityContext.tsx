
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusVisible: boolean;
  audioDescriptions: boolean;
  captionsEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string) => void;
  isAccessibilityEnabled: boolean;
  toggleAccessibility: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  colorBlindness: 'none',
  focusVisible: true,
  audioDescriptions: false,
  captionsEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
        setIsAccessibilityEnabled(true);
      } catch (error) {
        console.warn('Erreur lors du chargement des paramètres d\'accessibilité:', error);
      }
    }

    // Détecter les préférences système
    detectSystemPreferences();
  }, []);

  useEffect(() => {
    // Sauvegarder les paramètres
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Appliquer les paramètres au DOM
    applyAccessibilitySettings();
  }, [settings]);

  const detectSystemPreferences = () => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)'),
    };

    const systemSettings: Partial<AccessibilitySettings> = {};

    if (mediaQueries.reducedMotion.matches) {
      systemSettings.reducedMotion = true;
    }
    if (mediaQueries.highContrast.matches) {
      systemSettings.highContrast = true;
    }

    if (Object.keys(systemSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...systemSettings }));
    }
  };

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Contraste élevé
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Taille de police
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Mouvement réduit
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Daltonisme
    root.setAttribute('data-colorblind', settings.colorBlindness);
    
    // Focus visible
    root.classList.toggle('focus-visible-enabled', settings.focusVisible);

    // Styles CSS personnalisés
    const styleElement = document.getElementById('accessibility-styles') || document.createElement('style');
    styleElement.id = 'accessibility-styles';
    
    let css = '';
    
    if (settings.highContrast) {
      css += `
        :root.high-contrast {
          --background: #000000;
          --foreground: #ffffff;
          --primary: #ffff00;
          --primary-foreground: #000000;
          --secondary: #ffffff;
          --secondary-foreground: #000000;
          --muted: #333333;
          --muted-foreground: #ffffff;
          --border: #ffffff;
        }
      `;
    }
    
    if (settings.fontSize !== 'medium') {
      const fontSizes = {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        'extra-large': '1.5rem'
      };
      css += `
        :root[data-font-size="${settings.fontSize}"] {
          font-size: ${fontSizes[settings.fontSize]};
        }
      `;
    }
    
    if (settings.reducedMotion) {
      css += `
        :root.reduced-motion *,
        :root.reduced-motion *::before,
        :root.reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
    }

    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setIsAccessibilityEnabled(true);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const toggleAccessibility = () => {
    setIsAccessibilityEnabled(!isAccessibilityEnabled);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      announceToScreenReader,
      isAccessibilityEnabled,
      toggleAccessibility
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
