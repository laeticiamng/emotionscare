
import { useState } from 'react';
import { useMusicGeneration } from './useMusicGeneration';
import { useMusicControls } from './useMusicControls';
import { MusicTrack, MusicPlaylist } from '@/types/music';

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  customPrompt?: string;
}

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateMusic } = useMusicGeneration();
  const { playTrack } = useMusicControls();

  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      const track = await generateMusic(params.emotion, params.customPrompt);
      
      if (track) {
        // Créer une playlist avec le track généré
        const playlist: MusicPlaylist = {
          id: crypto.randomUUID(),
          name: `Playlist ${params.emotion}`,
          tracks: [track],
          emotion: params.emotion
        };
        
        // Jouer automatiquement le track
        await playTrack(track);
        
        return playlist;
      }
      
      return null;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const playEmotion = async (emotion: string, customPrompt?: string): Promise<MusicPlaylist | null> => {
    return activateMusicForEmotion({ emotion, customPrompt });
  };

  const getMusicRecommendationForEmotion = async (emotionResult: any): Promise<MusicPlaylist | null> => {
    if (!emotionResult?.emotion) return null;
    
    return activateMusicForEmotion({
      emotion: emotionResult.emotion,
      intensity: emotionResult.confidence || 0.5
    });
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions = {
      'calm': 'Musique apaisante pour la détente et la méditation',
      'energetic': 'Rythmes énergiques pour vous motiver',
      'happy': 'Mélodies joyeuses pour égayer votre journée',
      'focused': 'Sons concentrés pour optimiser votre productivité',
      'relaxed': 'Ambiances douces pour vous relaxer',
      'motivated': 'Musiques inspirantes pour vous booster',
      'joy': 'Harmonies pleines de joie et de positivité',
      'sadness': 'Mélodies douces pour accompagner vos émotions'
    };
    
    return descriptions[emotion as keyof typeof descriptions] || 'Musique adaptée à votre état émotionnel';
  };

  return {
    activateMusicForEmotion,
    playEmotion,
    getMusicRecommendationForEmotion,
    getEmotionMusicDescription,
    isLoading
  };
};

// Types additionnels pour la compatibilité
export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion: string;
  description?: string;
}
