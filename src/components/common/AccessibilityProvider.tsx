import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';
import { logger } from '@/lib/logger';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 1,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  focusIndicators: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('accessibility-settings');
        if (saved) {
          return { ...defaultSettings, ...JSON.parse(saved) };
        }
      } catch (error) {
        logger.warn('[AccessibilityProvider] Failed to read settings from localStorage', { error });
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion && !settings.reducedMotion) {
      updateSetting('reducedMotion', true);
    }
    
    if (prefersHighContrast && !settings.highContrast) {
      updateSetting('highContrast', true);
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = safeGetDocumentRoot();

    // Font size
    root.style.setProperty('--font-scale', settings.fontSize.toString());

    // High contrast
    if (settings.highContrast) {
      safeClassAdd(root, 'high-contrast');
    } else {
      safeClassRemove(root, 'high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      safeClassAdd(root, 'reduced-motion');
    } else {
      safeClassRemove(root, 'reduced-motion');
    }

    // Focus indicators
    if (settings.focusIndicators) {
      safeClassAdd(root, 'enhanced-focus');
    } else {
      safeClassRemove(root, 'enhanced-focus');
    }

    // Save to localStorage
    try {
      window.localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      logger.warn('[AccessibilityProvider] Failed to persist settings', { error });
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      window.localStorage.removeItem('accessibility-settings');
    } catch (error) {
      logger.warn('[AccessibilityProvider] Failed to clear settings', { error });
    }
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSetting, 
        resetSettings 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};