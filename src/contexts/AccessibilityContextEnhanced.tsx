import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  fontSize: number;
  lineHeight: number;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Audio
  screenReader: boolean;
  audioDescriptions: boolean;
  soundEnabled: boolean;
  voiceControl: boolean;
  
  // Motor
  focusIndicators: boolean;
  stickyKeys: boolean;
  oneHandMode: boolean;
  dwellTime: number;
  
  // Cognitive
  simplifiedInterface: boolean;
  readingGuide: boolean;
  autoScroll: boolean;
  contentPausing: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string) => void;
  checkColorContrast: (foreground: string, background: string) => { ratio: number; isValid: boolean };
  isHighContrastMode: boolean;
  isLargeTextMode: boolean;
  isReducedMotionMode: boolean;
}

const defaultSettings: AccessibilitySettings = {
  // Visual
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  fontSize: 16,
  lineHeight: 1.5,
  colorBlindMode: 'none',
  
  // Audio
  screenReader: false,
  audioDescriptions: false,
  soundEnabled: true,
  voiceControl: false,
  
  // Motor
  focusIndicators: true,
  stickyKeys: false,
  oneHandMode: false,
  dwellTime: 1000,
  
  // Cognitive
  simplifiedInterface: false,
  readingGuide: false,
  autoScroll: false,
  contentPausing: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
      
      // Detect system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      return {
        ...defaultSettings,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
      };
    }
    return defaultSettings;
  });

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Apply settings immediately
      if (typeof window !== 'undefined') {
        applyAccessibilitySettings(newSettings);
        localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
      }
      
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessibility-settings');
      applyAccessibilitySettings(defaultSettings);
    }
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    if (typeof window !== 'undefined') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-9999px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, []);

  const checkColorContrast = useCallback((foreground: string, background: string) => {
    // Simplified contrast ratio calculation
    // In production, use a proper color contrast library
    const getLuminance = (color: string) => {
      // This is a simplified version - use a proper color library in production
      return 0.5; // Placeholder
    };
    
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    return {
      ratio,
      isValid: ratio >= 4.5 // WCAG AA standard
    };
  }, []);

  const applyAccessibilitySettings = useCallback((settingsToApply: AccessibilitySettings) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Apply visual settings
    root.classList.toggle('high-contrast', settingsToApply.highContrast);
    root.classList.toggle('large-text', settingsToApply.largeText);
    root.classList.toggle('reduced-motion', settingsToApply.reducedMotion);
    root.classList.toggle('enhanced-focus', settingsToApply.focusIndicators);
    root.classList.toggle('simplified-ui', settingsToApply.simplifiedInterface);
    
    // Apply font size
    root.style.setProperty('--accessibility-font-size', `${settingsToApply.fontSize}px`);
    root.style.setProperty('--accessibility-line-height', settingsToApply.lineHeight.toString());
    
    // Apply color blind mode
    root.setAttribute('data-colorblind-mode', settingsToApply.colorBlindMode);
    
    // Apply dwell time for motor accessibility
    root.style.setProperty('--accessibility-dwell-time', `${settingsToApply.dwellTime}ms`);
  }, []);

  // Apply settings on mount and when settings change
  useEffect(() => {
    applyAccessibilitySettings(settings);
  }, [settings, applyAccessibilitySettings]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (!settings.reducedMotion) { // Only update if user hasn't manually set it
        updateSetting('reducedMotion', e.matches);
      }
    };
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (!settings.highContrast) { // Only update if user hasn't manually set it
        updateSetting('highContrast', e.matches);
      }
    };
    
    mediaQueryMotion.addEventListener('change', handleMotionChange);
    mediaQueryContrast.addEventListener('change', handleContrastChange);
    
    return () => {
      mediaQueryMotion.removeEventListener('change', handleMotionChange);
      mediaQueryContrast.removeEventListener('change', handleContrastChange);
    };
  }, [settings.reducedMotion, settings.highContrast, updateSetting]);

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    announceToScreenReader,
    checkColorContrast,
    isHighContrastMode: settings.highContrast,
    isLargeTextMode: settings.largeText,
    isReducedMotionMode: settings.reducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;