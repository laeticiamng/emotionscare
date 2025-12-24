// @ts-nocheck
import { useState, useEffect } from 'react';
import { MusicPlaylist } from '@/types/music';
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

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;

        if (targetUserId) {
          // Fetch listening history
          const { data: historyData } = await supabase
            .from('music_listening_history')
            .select('*')
            .eq('user_id', targetUserId);

          if (historyData && historyData.length > 0) {
            // Calculate total listening time
            const totalTime = historyData.reduce((acc, h) => acc + (h.listen_duration || 0), 0);

            // Count genres, tracks, artists
            const genreCounts: Record<string, number> = {};
            const trackCounts: Record<string, number> = {};
            const artistCounts: Record<string, number> = {};
            const emotionCounts: Record<string, number> = {};

            historyData.forEach(h => {
              if (h.genre) genreCounts[h.genre] = (genreCounts[h.genre] || 0) + 1;
              if (h.track_title) trackCounts[h.track_title] = (trackCounts[h.track_title] || 0) + 1;
              if (h.track_artist) artistCounts[h.track_artist] = (artistCounts[h.track_artist] || 0) + 1;
              if (h.mood) emotionCounts[h.mood] = (emotionCounts[h.mood] || 0) + 1;
            });

            // Get most played
            const getMostPlayed = (counts: Record<string, number>) => {
              const entries = Object.entries(counts);
              if (entries.length === 0) return '';
              return entries.sort((a, b) => b[1] - a[1])[0][0];
            };

            setStats({
              totalListeningTime: totalTime,
              mostPlayedGenre: getMostPlayed(genreCounts) || 'Ambient',
              mostPlayedTrack: getMostPlayed(trackCounts) || 'Inconnu',
              mostPlayedArtist: getMostPlayed(artistCounts) || 'Artiste inconnu',
              favoriteEmotion: getMostPlayed(emotionCounts) || 'Calm',
              listenedTracksCount: historyData.length
            });
            setHasData(true);
          } else {
            setHasData(false);
          }
        } else {
          setHasData(false);
        }
      } catch (error) {
        logger.error('Erreur lors de la récupération des statistiques musicales', error as Error, 'ANALYTICS');
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);
  
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
    formatListeningTime
  };
}
