
import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMusic } from '@/contexts/music/MusicProvider';

export const useAmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundType, setSoundType] = useState<'nature' | 'ambient' | 'space'>('ambient');
  const { preferences } = useUserPreferences();
  const music = useMusic();

  // Load user preferences
  useEffect(() => {
    if (preferences) {
      setVolume(preferences.soundVolume || 0.3);
      setSoundType(preferences.ambientSoundType || 'ambient');
      setIsPlaying(preferences.ambientSoundEnabled || false);
    }
  }, [preferences]);

  // Control playback
  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const changeSoundType = (type: 'nature' | 'ambient' | 'space') => {
    setSoundType(type);
  };

  return {
    isPlaying,
    volume,
    soundType,
    togglePlaying,
    changeVolume,
    changeSoundType
  };
};

export default useAmbientSound;
