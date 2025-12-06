
import { useState, useEffect } from 'react';

export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  currentEqualizer: string;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
  setVolume: (volume: number) => void;
  setAutoplay: (enabled: boolean) => void;
  toggleEqualizer: (enabled?: boolean) => void;
  setEqualizerPreset: (preset: string) => void;
}

export default function useAudioPreferences() {
  const [preferences, setPreferences] = useState<AudioPreference>({
    volume: 0.8,
    autoplay: true,
    currentEqualizer: 'default',
    equalizerEnabled: false,
    equalizerPresets: ['default', 'bass', 'vocal', 'ambient'],
    setVolume: () => {}, // Initial dummy functions, will be replaced below
    setAutoplay: () => {},
    toggleEqualizer: () => {},
    setEqualizerPreset: () => {}
  });

  const setVolume = (volume: number) => {
    setPreferences(prev => ({ ...prev, volume }));
  };

  const setAutoplay = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, autoplay: enabled }));
  };

  const toggleEqualizer = (enabled?: boolean) => {
    setPreferences(prev => ({ 
      ...prev, 
      equalizerEnabled: enabled !== undefined ? enabled : !prev.equalizerEnabled 
    }));
  };

  const setEqualizerPreset = (preset: string) => {
    setPreferences(prev => ({ ...prev, currentEqualizer: preset }));
  };
  
  // Update preferences with the actual implementations
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      setVolume,
      setAutoplay,
      toggleEqualizer,
      setEqualizerPreset
    }));
  }, []);

  return {
    preferences,
    setVolume,
    setAutoplay,
    toggleEqualizer,
    setEqualizerPreset,
    // Also expose these properties directly for backward compatibility
    volume: preferences.volume,
    autoplay: preferences.autoplay,
    currentEqualizer: preferences.currentEqualizer,
    equalizerEnabled: preferences.equalizerEnabled,
    equalizerPresets: preferences.equalizerPresets
  };
}
