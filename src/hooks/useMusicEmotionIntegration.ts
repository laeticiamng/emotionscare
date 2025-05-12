
import { useCallback, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';

interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

interface MusicEmotionMapping {
  emotion: string;
  description: string;
  intensity: number;
}

export function useMusicEmotionIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    loadPlaylistForEmotion, 
    currentPlaylist,
    setOpenDrawer 
  } = useMusic();

  const emotionToMusicMap: Record<string, MusicEmotionMapping> = {
    happy: {
      emotion: 'happy',
      description: 'Musique joyeuse et légère pour accompagner votre bonne humeur',
      intensity: 70
    },
    calm: {
      emotion: 'calm',
      description: 'Sons apaisants pour maintenir votre tranquillité d\'esprit',
      intensity: 30
    },
    focused: {
      emotion: 'focused',
      description: 'Rythmes doux et réguliers pour soutenir votre concentration',
      intensity: 50
    },
    energetic: {
      emotion: 'energetic',
      description: 'Mélodies dynamiques pour amplifier votre énergie',
      intensity: 80
    },
    tired: {
      emotion: 'calm',
      description: 'Sons relaxants pour vous aider à vous ressourcer',
      intensity: 20
    },
    stressed: {
      emotion: 'calm',
      description: 'Musique apaisante pour diminuer votre niveau de stress',
      intensity: 40
    },
    sad: {
      emotion: 'melancholic',
      description: 'Mélodies douces et compréhensives pour accompagner vos émotions',
      intensity: 40
    },
    melancholic: {
      emotion: 'melancholic',
      description: 'Ambiances sonores réconfortantes pour la réflexion et l\'introspection',
      intensity: 30
    }
  };

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams) => {
    const { emotion, intensity = 50 } = params;
    
    setIsLoading(true);
    
    try {
      const mappedEmotion = emotionToMusicMap[emotion]?.emotion || emotion;
      const playlist = await loadPlaylistForEmotion(mappedEmotion);
      
      if (playlist) {
        // Open the music drawer
        setOpenDrawer(true);
      }
      
      return playlist;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, setOpenDrawer, emotionToMusicMap]);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    return emotionToMusicMap[emotion]?.description || 
      'Musique adaptée à votre humeur actuelle';
  }, [emotionToMusicMap]);

  return {
    activateMusicForEmotion,
    isLoading,
    currentPlaylist,
    getEmotionMusicDescription,
    emotionMusicMappings: emotionToMusicMap
  };
}
