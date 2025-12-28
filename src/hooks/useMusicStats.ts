/**
 * useMusicStats - Statistiques musicales réelles depuis Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface MusicStats {
  totalListeningTime: number; // en secondes
  mostPlayedGenre: string;
  mostPlayedTrack: string;
  mostPlayedArtist: string;
  favoriteEmotion: string;
  listenedTracksCount: number;
}

export default function useMusicStats(userId?: string) {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  const [stats, setStats] = useState<MusicStats>({
    totalListeningTime: 0,
    mostPlayedGenre: '',
    mostPlayedTrack: '',
    mostPlayedArtist: '',
    favoriteEmotion: '',
    listenedTracksCount: 0
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasData, setHasData] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    if (!effectiveUserId) {
      setHasData(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Récupérer l'historique d'écoute
      const { data: history, error } = await supabase
        .from('music_history')
        .select('*')
        .eq('user_id', effectiveUserId)
        .order('played_at', { ascending: false });

      if (error) throw error;

      if (!history || history.length === 0) {
        setHasData(false);
        setIsLoading(false);
        return;
      }

      // Calculer le temps total d'écoute
      const totalListeningTime = history.reduce((sum, entry) => {
        return sum + (entry.listen_duration_seconds || 0);
      }, 0);

      // Compter les genres
      const genreCounts: Record<string, number> = {};
      const artistCounts: Record<string, number> = {};
      const trackCounts: Record<string, { title: string; count: number }> = {};
      const emotionCounts: Record<string, number> = {};

      history.forEach(entry => {
        // Genre
        const genre = entry.genre || 'Unknown';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;

        // Artiste
        const artist = entry.artist || 'Unknown';
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;

        // Track
        const trackId = entry.track_id;
        const title = entry.track_title || 'Unknown';
        if (!trackCounts[trackId]) {
          trackCounts[trackId] = { title, count: 0 };
        }
        trackCounts[trackId].count++;

        // Emotion
        const emotion = entry.emotion || 'neutral';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });

      // Trouver les plus populaires
      const mostPlayedGenre = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      const mostPlayedArtist = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      const mostPlayedTrack = Object.values(trackCounts)
        .sort((a, b) => b.count - a.count)[0]?.title || '';

      const favoriteEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      setStats({
        totalListeningTime,
        mostPlayedGenre,
        mostPlayedTrack,
        mostPlayedArtist,
        favoriteEmotion,
        listenedTracksCount: history.length
      });
      setHasData(true);

      logger.info('Music stats loaded', { tracksCount: history.length }, 'MUSIC_STATS');

    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques musicales', error as Error, 'ANALYTICS');
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  // Formater le temps d'écoute pour l'affichage
  const formatListeningTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };
  
  return {
    stats,
    isLoading,
    hasData,
    formatListeningTime,
    refresh: fetchStats
  };
}
