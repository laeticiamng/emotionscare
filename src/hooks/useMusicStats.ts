
import { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';

interface MusicStats {
  mostPlayedTrack: string | null;
  mostPlayedArtist: string | null;
  totalListeningTime: number; // en minutes
  favoriteEmotion: string | null;
}

export function useMusicStats() {
  const { currentPlaylist, playlists, currentEmotion } = useMusic();
  const [stats, setStats] = useState<MusicStats>({
    mostPlayedTrack: null,
    mostPlayedArtist: null,
    totalListeningTime: 0,
    favoriteEmotion: null
  });

  useEffect(() => {
    // Cette fonction simule la récupération des statistiques
    // Dans une implémentation réelle, vous feriez une requête à l'API
    const fetchStats = () => {
      // Simuler des données d'écoute
      const mockStats: MusicStats = {
        mostPlayedTrack: currentPlaylist?.tracks[0]?.title || "Sérenité",
        mostPlayedArtist: currentPlaylist?.tracks[0]?.artist || "Nature Sounds",
        totalListeningTime: Math.floor(Math.random() * 300) + 60, // Entre 60 et 360 minutes
        favoriteEmotion: currentEmotion || "calm"
      };
      
      setStats(mockStats);
    };

    fetchStats();
  }, [currentPlaylist, currentEmotion]);

  const formatListeningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  return {
    stats,
    formatListeningTime,
    hasData: Boolean(stats.mostPlayedTrack)
  };
}

export default useMusicStats;
