/**
 * Hook pour gérer les paramètres VR utilisateur
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface VRSettings {
  defaultScene: 'galaxy' | 'ocean' | 'forest' | 'space' | 'aurora' | 'cosmos';
  defaultPattern: 'box' | 'coherence' | 'relax' | 'energize' | 'calm';
  defaultDuration: number; // minutes
  vrModeEnabled: boolean;
  audioEnabled: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
  weeklyGoalMinutes: number;
  reminderEnabled: boolean;
  reminderTime: string;
}

const DEFAULT_SETTINGS: VRSettings = {
  defaultScene: 'galaxy',
  defaultPattern: 'coherence',
  defaultDuration: 10,
  vrModeEnabled: true,
  audioEnabled: true,
  hapticFeedback: true,
  reducedMotion: false,
  weeklyGoalMinutes: 60,
  reminderEnabled: false,
  reminderTime: '09:00',
};

const STORAGE_KEY = 'emotionscare-vr-settings';

export function useVRSettings() {
  const [settings, setSettings] = useState<VRSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      logger.error('Error loading VR settings:', err, 'VR');
    }
    setIsLoaded(true);
  }, []);

  // Save settings
  const saveSettings = useCallback((newSettings: Partial<VRSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        logger.error('Error saving VR settings:', err, 'VR');
      }
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      logger.error('Error resetting VR settings:', err, 'VR');
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
  };
}
