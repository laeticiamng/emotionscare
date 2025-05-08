
import { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { getUserListeningHistory } from '@/services/music/user-service';

export const useMusicStats = (userId?: string) => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [mostPlayedGenre, setMostPlayedGenre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { playlists } = useMusic();

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        
        // Charger l'historique d'écoute
        const history = await getUserListeningHistory(userId);
        setListeningHistory(history);
        
        // Calculer le temps total d'écoute (simplifié)
        const totalTime = history.reduce((acc, track) => acc + (track.duration || 0), 0);
        setTotalListeningTime(totalTime);
        
        // Déterminer le genre le plus écouté (simplifié)
        // Dans une implémentation réelle, on analyserait les genres des pistes écoutées
        setMostPlayedGenre('Relaxation');
        
      } catch (error) {
        console.error('Error loading music stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [userId, playlists]);
  
  return {
    listeningHistory,
    totalListeningTime,
    mostPlayedGenre,
    isLoading
  };
};

export default useMusicStats;
