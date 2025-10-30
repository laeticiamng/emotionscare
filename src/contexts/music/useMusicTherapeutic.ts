/**
 * Music Therapeutic Hook - Mode thérapeutique
 */

import { useCallback, Dispatch } from 'react';
import { MusicAction } from './types';

export const useMusicTherapeutic = (dispatch: Dispatch<MusicAction>) => {
  const enableTherapeuticMode = useCallback((emotion: string) => {
    dispatch({ type: 'SET_THERAPEUTIC_MODE', payload: true });
    dispatch({ type: 'SET_EMOTION_TARGET', payload: emotion });
  }, [dispatch]);

  const disableTherapeuticMode = useCallback(() => {
    dispatch({ type: 'SET_THERAPEUTIC_MODE', payload: false });
    dispatch({ type: 'SET_EMOTION_TARGET', payload: null });
  }, [dispatch]);

  const adaptVolumeToEmotion = useCallback((emotion: string, intensity: number) => {
    // Ajustement du volume selon l'émotion et l'intensité
    let volumeMultiplier = 1;

    switch (emotion.toLowerCase()) {
      case 'calm':
      case 'sérénité':
        volumeMultiplier = 0.6; // Plus doux
        break;
      case 'anxious':
      case 'stress':
        volumeMultiplier = 0.5; // Très doux
        break;
      case 'energetic':
      case 'joie':
        volumeMultiplier = 0.9; // Plus fort
        break;
      default:
        volumeMultiplier = 0.7;
    }

    const adaptedVolume = volumeMultiplier * intensity;
    dispatch({ type: 'SET_VOLUME', payload: adaptedVolume });
  }, [dispatch]);

  return {
    enableTherapeuticMode,
    disableTherapeuticMode,
    adaptVolumeToEmotion,
  };
};
