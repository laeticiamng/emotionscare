
import { useState, useCallback } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);

  const playEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to get emotion-based music
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTracks: MusicTrack[] = [
        {
          id: '1',
          title: 'Peaceful Mind',
          artist: 'Relaxation Sounds',
          url: '/sounds/ambient-calm.mp3',
          duration: 180,
          emotion,
        },
        {
          id: '2',
          title: 'Gentle Waves',
          artist: 'Nature Sounds',
          url: '/sounds/ambient-calm.mp3',
          duration: 240,
          emotion,
        }
      ];

      const playlist: MusicPlaylist = {
        id: Date.now().toString(),
        name: `Musique pour ${emotion}`,
        tracks: mockTracks,
        emotion,
        description: `Playlist adaptée à votre état émotionnel: ${emotion}`,
      };

      setCurrentPlaylist(playlist);
      return playlist;
    } catch (error) {
      console.error('Error loading emotion music:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEmotionMusicDescription = useCallback((emotion: string) => {
    const descriptions: Record<string, string> = {
      joie: 'Musique énergisante pour amplifier votre bonne humeur',
      tristesse: 'Mélodies apaisantes pour vous accompagner en douceur',
      colère: 'Sons relaxants pour retrouver votre calme intérieur',
      stress: 'Ambiances zen pour diminuer votre stress',
      anxiété: 'Harmonies rassurantes pour apaiser vos inquiétudes',
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique adaptée à votre état émotionnel';
  }, []);

  return {
    playEmotion,
    isLoading,
    currentPlaylist,
    getEmotionMusicDescription,
  };
};
