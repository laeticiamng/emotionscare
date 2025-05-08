
import { useState, useEffect, useMemo } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { getUserListeningHistory } from '@/services/music/user-service';
import { MusicTrack } from '@/types/music';

export const useMusicStats = (userId?: string) => {
  const [listeningHistory, setListeningHistory] = useState<MusicTrack[]>([]);
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [mostPlayedGenre, setMostPlayedGenre] = useState('');
  const [mostPlayedTrack, setMostPlayedTrack] = useState('');
  const [mostPlayedArtist, setMostPlayedArtist] = useState('');
  const [favoriteEmotion, setFavoriteEmotion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { playlists } = useMusic();

  const hasData = useMemo(() => {
    return listeningHistory.length > 0;
  }, [listeningHistory]);

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        
        // Charger l'historique d'écoute
        const history = await getUserListeningHistory(userId);
        setListeningHistory(history);
        
        // Calculer le temps total d'écoute
        const totalTime = history.reduce((acc, track) => acc + (track.duration || 0), 0);
        setTotalListeningTime(totalTime);
        
        // Déterminer le genre le plus écouté (simplifié)
        setMostPlayedGenre('Relaxation');
        
        // Définir le titre le plus écouté (simulé)
        setMostPlayedTrack('Ocean Waves');
        
        // Définir l'artiste préféré (simulé)
        setMostPlayedArtist('Nature Sounds');
        
        // Définir l'émotion favorite (simulée)
        setFavoriteEmotion('calm');
        
      } catch (error) {
        console.error('Error loading music stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [userId, playlists]);

  // Format time in minutes and seconds
  const formatListeningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutes`;
  };
  
  // Compile stats into a single object for easy access
  const stats = {
    totalListeningTime,
    mostPlayedGenre,
    mostPlayedTrack,
    mostPlayedArtist,
    favoriteEmotion
  };
  
  return {
    listeningHistory,
    totalListeningTime,
    mostPlayedGenre,
    isLoading,
    stats,
    formatListeningTime,
    hasData
  };
};

export default useMusicStats;
