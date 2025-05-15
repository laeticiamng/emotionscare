
import { useState, useEffect } from 'react';
import { EmotionMusicParams, MusicTrack, MusicPlaylist } from '@/types/music';

export const useEmotionMusic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendedPlaylist, setRecommendedPlaylist] = useState<MusicPlaylist | null>(null);
  
  const getRecommendationsByEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist> => {
    setLoading(true);
    
    try {
      // Simulate API call - this would be real API in production
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock returned playlist
      const playlist: MusicPlaylist = {
        id: 'emotion-' + params.emotion,
        title: `${capitalize(params.emotion)} Music`,
        name: `${capitalize(params.emotion)} Music`,
        tracks: [
          {
            id: '101',
            title: `${capitalize(params.emotion)} Melody`,
            artist: 'EmotionsCare Music',
            duration: 240,
            url: '/audio/sample1.mp3',
            audioUrl: '/audio/sample1.mp3',
            coverUrl: '/images/covers/sample1.jpg'
          },
          {
            id: '102',
            title: `${capitalize(params.emotion)} Harmony`,
            artist: 'EmotionsCare Orchestra',
            duration: 180,
            url: '/audio/sample2.mp3',
            audioUrl: '/audio/sample2.mp3',
            coverUrl: '/images/covers/sample2.jpg'
          },
          {
            id: '103',
            title: `${capitalize(params.emotion)} Ambience`,
            artist: 'EmotionsCare Ambient',
            duration: 320,
            url: '/audio/sample3.mp3',
            audioUrl: '/audio/sample3.mp3',
            coverUrl: '/images/covers/sample3.jpg'
          }
        ]
      };
      
      setRecommendedPlaylist(playlist);
      setLoading(false);
      return playlist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get music recommendations');
      setError(error);
      setLoading(false);
      throw error;
    }
  };
  
  // Helper to capitalize the first letter
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  return {
    loading,
    error,
    recommendedPlaylist,
    getRecommendationsByEmotion
  };
};

export default useEmotionMusic;
