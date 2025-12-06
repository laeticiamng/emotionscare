// @ts-nocheck
import { useEffect, useState, useCallback, useRef } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardOnly: boolean;
  screenReader: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    keyboardOnly: false,
    screenReader: false
  });
  
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)')
    };

    const updateSettings = () => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches
      }));
    };

    updateSettings();
    
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updateSettings);
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updateSettings);
      });
    };
  }, []);

  const announce = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setAnnouncements(prev => [...prev.slice(-4), message]);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    const saved = localStorage.getItem('accessibility-settings');
    const currentSettings = saved ? JSON.parse(saved) : {};
    const newSettings = { ...currentSettings, [key]: value };
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));

    announce(`Paramètre ${key} ${value ? 'activé' : 'désactivé'}`);
  }, [announce]);

  return { settings, announcements, announce, updateSetting };
};

export const useFocusManagement = () => {
  const focusHistory = useRef<HTMLElement[]>([]);

  const saveFocus = useCallback((element?: HTMLElement) => {
    const activeElement = element || (document.activeElement as HTMLElement);
    if (activeElement && activeElement !== document.body) {
      focusHistory.current.push(activeElement);
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistory.current.pop();
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }, []);

  return { saveFocus, restoreFocus };
};

export default useAccessibility;