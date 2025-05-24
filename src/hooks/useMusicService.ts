
import { useState, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockMusicTracks, mockMusicPlaylists } from '@/mocks/musicTracks';
import { useToast } from '@/hooks/use-toast';

export const useMusicService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchTracks = useCallback(async (query: string): Promise<MusicTrack[]> => {
    setIsLoading(true);
    try {
      // Simuler une recherche dans les données mock
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = mockMusicTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      );

      return results;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const matchingPlaylist = mockMusicPlaylists.find(playlist => 
        playlist.name?.toLowerCase().includes(emotion.toLowerCase())
      );

      return matchingPlaylist || null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer une playlist basée sur l'émotion
      const emotionTracks = mockMusicTracks.filter(track => 
        track.emotion === params.emotion
      );

      if (emotionTracks.length === 0) {
        // Fallback sur la première playlist disponible
        return mockMusicPlaylists[0] || null;
      }

      const generatedPlaylist: MusicPlaylist = {
        id: `generated-${Date.now()}`,
        name: `Musique pour ${params.emotion}`,
        tracks: emotionTracks,
        description: `Playlist générée automatiquement pour l'émotion: ${params.emotion}`,
        tags: [params.emotion, 'generated'],
      };

      toast({
        title: "Playlist générée",
        description: `Une playlist a été créée pour l'émotion "${params.emotion}"`,
      });

      return generatedPlaylist;
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique pour cette émotion",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getRecommendations = useCallback(async (): Promise<MusicTrack[]> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Retourner les 3 premiers morceaux comme recommandations
      return mockMusicTracks.slice(0, 3);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    searchTracks,
    getPlaylistForEmotion,
    generateMusicForEmotion,
    getRecommendations,
  };
};

export default useMusicService;
