/**
 * useAccessibility ENRICHED - Hook d'accessibilité complet
 * Version enrichie avec profils, export, analytics, préférences persistées
 */

import { useEffect, useState, useCallback, useRef } from 'react';

const PREFERENCES_KEY = 'accessibility-preferences';
const PROFILES_KEY = 'accessibility-profiles';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardOnly: boolean;
  screenReader: boolean;
  dyslexiaFont: boolean;
  focusHighlight: boolean;
  textSpacing: number;
  cursorSize: 'normal' | 'large' | 'extra-large';
}

interface AccessibilityProfile {
  id: string;
  name: string;
  settings: AccessibilitySettings;
  isDefault: boolean;
  createdAt: string;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  keyboardOnly: false,
  screenReader: false,
  dyslexiaFont: false,
  focusHighlight: true,
  textSpacing: 1,
  cursorSize: 'normal',
};

function getStoredSettings(): AccessibilitySettings {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}') };
  } catch { return defaultSettings; }
}

function getProfiles(): AccessibilityProfile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch { return []; }
}

export const useAccessibilityEnriched = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => getStoredSettings());
  const [profiles, setProfiles] = useState<AccessibilityProfile[]>(() => getProfiles());
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const focusHistory = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)')
    };

    const updateFromMedia = () => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches
      }));
    };

    updateFromMedia();
    Object.values(mediaQueries).forEach(mq => mq.addEventListener('change', updateFromMedia));
    return () => Object.values(mediaQueries).forEach(mq => mq.removeEventListener('change', updateFromMedia));
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const announce = useCallback((message: string) => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.className = 'sr-only';
    el.textContent = message;
    document.body.appendChild(el);
    setAnnouncements(prev => [...prev.slice(-4), message]);
    setTimeout(() => el.remove(), 1000);
  }, []);

  const createProfile = useCallback((name: string) => {
    const profile: AccessibilityProfile = {
      id: crypto.randomUUID(),
      name,
      settings: { ...settings },
      isDefault: profiles.length === 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...profiles, profile];
    setProfiles(updated);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    return profile;
  }, [settings, profiles]);

  const applyProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSettings(profile.settings);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(profile.settings));
    }
  }, [profiles]);

  const deleteProfile = useCallback((profileId: string) => {
    const updated = profiles.filter(p => p.id !== profileId);
    setProfiles(updated);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  }, [profiles]);

  const saveFocus = useCallback((element?: HTMLElement) => {
    const el = element || (document.activeElement as HTMLElement);
    if (el && el !== document.body) focusHistory.current.push(el);
  }, []);

  const restoreFocus = useCallback(() => {
    const last = focusHistory.current.pop();
    if (last?.focus) last.focus();
  }, []);

  const exportData = useCallback(() => ({
    settings,
    profiles,
    exportedAt: new Date().toISOString(),
  }), [settings, profiles]);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(defaultSettings));
  }, []);

  return {
    settings,
    updateSetting,
    announcements,
    announce,
    profiles,
    createProfile,
    applyProfile,
    deleteProfile,
    saveFocus,
    restoreFocus,
    exportData,
    resetToDefaults,
  };
};

export default useAccessibilityEnriched;
