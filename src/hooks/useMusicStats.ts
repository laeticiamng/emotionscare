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
        // Simuler un appel d'API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées
        if (userId) {
          setStats({
            totalListeningTime: 7823, // 2h10m23s
            mostPlayedGenre: 'Ambient',
            mostPlayedTrack: 'Ocean Waves at Sunset',
            mostPlayedArtist: 'Nature Sounds',
            favoriteEmotion: 'Calm',
            listenedTracksCount: 42
          });
          setHasData(true);
        } else {
          // Si pas d'utilisateur, pas de données
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
