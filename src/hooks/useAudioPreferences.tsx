// @ts-nocheck

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface AudioPreference {
  equalizerEnabled: boolean;
  equalizerPresets: Record<string, number[]>;
  currentEqualizer: string;
  volume: number;
  autoplay: boolean;
}

export function useAudioPreferences() {
  const [preferences, setPreferences] = useState<AudioPreference>({
    equalizerEnabled: false,
    equalizerPresets: {
      flat: [0, 0, 0, 0, 0],
      bass: [8, 4, 0, 0, 0],
      vocal: [0, 0, 6, 4, 0],
      treble: [0, 0, 0, 4, 8],
      electronic: [4, 0, -2, 0, 6],
      acoustic: [2, 3, 0, 2, 0],
      custom: [0, 0, 0, 0, 0]
    },
    currentEqualizer: 'flat',
    volume: 0.7,
    autoplay: false
  });
  
  // Charger les préférences depuis le localStorage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('audioPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      logger.error('Error loading audio preferences', error as Error, 'SYSTEM');
    }
  }, []);
  
  // Sauvegarder les préférences
  const savePreferences = (newPreferences: Partial<AudioPreference>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('audioPreferences', JSON.stringify(updatedPreferences));
      return updatedPreferences;
    } catch (error) {
      logger.error('Error saving audio preferences', error as Error, 'SYSTEM');
      return preferences;
    }
  };
  
  // Activer/désactiver l'équaliseur
  const toggleEqualizer = (enabled?: boolean) => {
    const newValue = enabled !== undefined ? enabled : !preferences.equalizerEnabled;
    return savePreferences({ equalizerEnabled: newValue });
  };
  
  // Changer le preset de l'équaliseur
  const setEqualizerPreset = (preset: string) => {
    if (preset in preferences.equalizerPresets) {
      return savePreferences({ currentEqualizer: preset });
    }
    return preferences;
  };
  
  // Mettre à jour un preset personnalisé
  const updateCustomPreset = (values: number[]) => {
    const newPresets = {
      ...preferences.equalizerPresets,
      custom: values
    };
    return savePreferences({ 
      equalizerPresets: newPresets,
      currentEqualizer: 'custom'
    });
  };
  
  // Définir le volume
  const setVolume = (volume: number) => {
    return savePreferences({ volume });
  };
  
  // Définir l'autoplay
  const setAutoplay = (autoplay: boolean) => {
    return savePreferences({ autoplay });
  };
  
  return {
    preferences,
    toggleEqualizer,
    setEqualizerPreset,
    updateCustomPreset,
    setVolume,
    setAutoplay
  };
}

export default useAudioPreferences;
