/**
 * Hook pour gérer les paramètres de méditation utilisateur
 */

import { useState, useEffect, useCallback } from 'react';

export interface MeditationSettings {
  defaultTechnique: 'mindfulness' | 'body-scan' | 'loving-kindness' | 'breath-focus' | 'visualization' | 'mantra';
  defaultDuration: number; // minutes
  withGuidance: boolean;
  withMusic: boolean;
  ambientSound: 'none' | 'rain' | 'forest' | 'ocean' | 'fire' | 'wind';
  volume: number;
  weeklyGoalMinutes: number;
  reminderEnabled: boolean;
  reminderTime: string;
  hapticFeedback: boolean;
  reducedAnimations: boolean;
}

const DEFAULT_SETTINGS: MeditationSettings = {
  defaultTechnique: 'mindfulness',
  defaultDuration: 10,
  withGuidance: true,
  withMusic: true,
  ambientSound: 'none',
  volume: 50,
  weeklyGoalMinutes: 60,
  reminderEnabled: false,
  reminderTime: '08:00',
  hapticFeedback: true,
  reducedAnimations: false,
};

const STORAGE_KEY = 'emotionscare-meditation-settings';

export function useMeditationSettings() {
  const [settings, setSettings] = useState<MeditationSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.error('Error loading meditation settings:', err);
    }
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: Partial<MeditationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving meditation settings:', err);
      }
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error resetting meditation settings:', err);
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
  };
}
