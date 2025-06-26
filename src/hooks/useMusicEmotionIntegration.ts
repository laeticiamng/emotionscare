
import { useState } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';
import { mockMusicTracks, mockMusicPlaylists } from '@/mocks/musicTracks';

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPlaylist, play } = useMusic();

  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trouver une playlist adaptée à l'émotion
      const matchingPlaylist = mockMusicPlaylists.find(
        playlist => playlist.emotion === params.emotion
      ) || mockMusicPlaylists[0];
      
      if (matchingPlaylist) {
        setPlaylist(matchingPlaylist.tracks);
        console.log(`Playlist activée pour l'émotion: ${params.emotion}`);
        return matchingPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur activation musique:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const playEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    const result = await activateMusicForEmotion({ emotion });
    if (result && result.tracks.length > 0) {
      play(result.tracks[0]);
    }
    return result;
  };

  const getMusicRecommendationForEmotion = async (emotionResult: any): Promise<MusicPlaylist | null> => {
    if (!emotionResult?.emotion) return null;
    return await activateMusicForEmotion({ emotion: emotionResult.emotion });
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      calm: 'Musique apaisante pour maintenir votre sérénité',
      happy: 'Musique joyeuse pour amplifier votre bonheur',
      energetic: 'Musique dynamique pour votre énergie',
      focused: 'Musique de concentration pour optimiser votre focus',
      sad: 'Musique douce pour vous accompagner',
      relaxed: 'Musique relaxante pour votre détente'
    };
    
    return descriptions[emotion] || 'Musique adaptée à votre état émotionnel';
  };

  return {
    activateMusicForEmotion,
    playEmotion,
    getMusicRecommendationForEmotion,
    getEmotionMusicDescription,
    isLoading
  };
};
