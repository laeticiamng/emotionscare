
import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMusic } from '@/contexts/music/MusicProvider';

export const useAmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundType, setSoundType] = useState<'nature' | 'ambient' | 'space'>('ambient');
  const { userPreferences } = useUserPreferences();
  const music = useMusic();

  // Charger les préférences utilisateur
  useEffect(() => {
    if (userPreferences) {
      setVolume(userPreferences.soundVolume || 0.3);
      setSoundType(userPreferences.ambientSoundType || 'ambient');
      setIsPlaying(userPreferences.ambientSoundEnabled || false);
    }
  }, [userPreferences]);

  // Contrôler la lecture
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
