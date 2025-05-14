
import { useCallback, useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext'; 
import { TimeOfDay } from '@/constants/defaults';

export function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentMood, setCurrentMood] = useState<string>('calm');
  const { preferences } = useUserPreferences?.() || { preferences: { ambientSound: true } };

  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const changeMood = useCallback((mood: string) => {
    setCurrentMood(mood);
  }, []);

  useEffect(() => {
    // Determine time of day to set appropriate mood
    const hour = new Date().getHours();
    let timeOfDay: TimeOfDay;
    
    if (hour >= 5 && hour < 12) timeOfDay = TimeOfDay.MORNING;
    else if (hour >= 12 && hour < 18) timeOfDay = TimeOfDay.AFTERNOON;
    else if (hour >= 18 && hour < 22) timeOfDay = TimeOfDay.EVENING;
    else timeOfDay = TimeOfDay.NIGHT;
    
    // Set default mood based on time of day
    switch(timeOfDay) {
      case TimeOfDay.MORNING:
        setCurrentMood('calm');
        break;
      case TimeOfDay.AFTERNOON:
        setCurrentMood('focus');
        break;
      case TimeOfDay.EVENING:
        setCurrentMood('relax');
        break;
      case TimeOfDay.NIGHT:
        setCurrentMood('sleep');
        break;
      default:
        setCurrentMood('calm');
    }

    // Auto-play based on user preferences
    if (preferences?.ambientSound) {
      setIsPlaying(true);
    }
  }, [preferences]);

  return {
    isPlaying,
    toggle,
    volume,
    changeVolume,
    currentMood,
    changeMood
  };
}

export default useAmbientSound;
