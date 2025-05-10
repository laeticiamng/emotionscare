
// Create a new file for AudioPreference types
import { useState, useEffect } from 'react';

export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  currentEqualizer: string;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
}

export default function useAudioPreferences() {
  const [preferences, setPreferences] = useState<AudioPreference>({
    volume: 0.8,
    autoplay: true,
    currentEqualizer: 'default',
    equalizerEnabled: false,
    equalizerPresets: ['default', 'bass', 'vocal', 'ambient']
  });

  const setVolume = (volume: number) => {
    setPreferences(prev => ({ ...prev, volume }));
  };

  const setAutoplay = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, autoplay: enabled }));
  };

  const toggleEqualizer = () => {
    setPreferences(prev => ({ ...prev, equalizerEnabled: !prev.equalizerEnabled }));
  };

  const setEqualizerPreset = (preset: string) => {
    setPreferences(prev => ({ ...prev, currentEqualizer: preset }));
  };

  return {
    preferences,
    setVolume,
    setAutoplay,
    toggleEqualizer,
    setEqualizerPreset
  };
}
