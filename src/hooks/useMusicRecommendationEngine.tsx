
import { useState, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mapEmotionToMusicType, getEmotionDescription } from '@/services/music/emotion-music-mapping';
import { getPlaylistByEmotion, EMOTION_PLAYLISTS } from '@/services/music/playlist-data';

interface MusicRecommendation {
  tracks: MusicTrack[];
  musicType: string;
  description: string;
  playlist: MusicPlaylist | undefined;
}

export function useMusicRecommendationEngine() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  /**
   * Obtient des recommandations musicales basées sur une émotion
   */
  const getRecommendationsForEmotion = useCallback((emotion: string): MusicTrack[] => {
    try {
      const musicType = mapEmotionToMusicType(emotion);
      const playlist = getPlaylistByEmotion(musicType);
      
      if (playlist && playlist.tracks.length > 0) {
        return playlist.tracks;
      } else {
        // Fallback to neutral playlist if no matching playlist is found
        const neutralPlaylist = getPlaylistByEmotion('neutral');
        return neutralPlaylist?.tracks || [];
      }
    } catch (err) {
      console.error('Erreur lors de l\'obtention des recommandations:', err);
      setError('Impossible de charger les recommandations musicales');
      return [];
    }
  }, []);
  
  /**
   * Charge et prépare des recommandations musicales pour une émotion donnée
   */
  const loadMusicForMood = useCallback(async (mood: string): Promise<MusicRecommendation | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const musicType = mapEmotionToMusicType(mood);
      const playlist = getPlaylistByEmotion(musicType);
      const description = getEmotionDescription(mood);
      
      if (playlist && playlist.tracks.length > 0) {
        return {
          tracks: playlist.tracks,
          musicType,
          description,
          playlist
        };
      }
      
      // Fallback to neutral
      const neutralPlaylist = getPlaylistByEmotion('neutral');
      if (neutralPlaylist) {
        return {
          tracks: neutralPlaylist.tracks,
          musicType: 'neutral',
          description: getEmotionDescription('neutral'),
          playlist: neutralPlaylist
        };
      }
      
      throw new Error('Aucune playlist disponible');
    } catch (err) {
      console.error('Erreur lors du chargement de la musique:', err);
      setError('Impossible de charger les recommandations musicales');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Obtient les playlists recommandées pour toutes les émotions
   */
  const getAllEmotionPlaylists = useCallback((): MusicPlaylist[] => {
    return Object.values(EMOTION_PLAYLISTS);
  }, []);
  
  return {
    loading,
    error,
    getRecommendationsForEmotion,
    loadMusicForMood,
    getAllEmotionPlaylists
  };
}

export default useMusicRecommendationEngine;
