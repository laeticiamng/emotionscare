import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { TIME_OF_DAY } from '@/constants/defaults';

const audioFiles = {
  morning: '/audio/morning-ambient.mp3',
  afternoon: '/audio/afternoon-ambient.mp3',
  evening: '/audio/evening-ambient.mp3',
};

export const useAmbientSound = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    const newAudioFile = audioFiles[timeOfDay] || null;

    if (settings?.ambientSound && newAudioFile) {
      if (!audio) {
        const newAudio = new Audio(newAudioFile);
        newAudio.loop = true;
        setAudio(newAudio);
        setCurrentAudioFile(newAudioFile);
      } else if (newAudioFile !== currentAudioFile) {
        audio.pause();
        const newAudio = new Audio(newAudioFile);
        newAudio.loop = true;
        setAudio(newAudio);
        setCurrentAudioFile(newAudioFile);
        newAudio.play();
      } else {
        audio.play();
      }
    } else if (audio) {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [settings?.ambientSound]);

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return TIME_OF_DAY[0]; // morning
    } else if (hour >= 12 && hour < 17) {
      return TIME_OF_DAY[1]; // afternoon
    } else {
      return TIME_OF_DAY[2]; // evening
    }
  };
};

