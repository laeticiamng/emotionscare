
import { useEffect, useState } from 'react';
import { useMusic } from '@/contexts';

export const useAmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundType, setSoundType] = useState<'nature' | 'ambient' | 'space'>('ambient');
  const music = useMusic();

  // Load user preferences - à adapter avec des vraies préférences utilisateur
  useEffect(() => {
    // Exemple de chargement de préférences
    setVolume(0.3);
    setSoundType('ambient');
    setIsPlaying(false);
  }, []);

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
