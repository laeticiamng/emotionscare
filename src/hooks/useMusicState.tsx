
import { useState, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useMusicState() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { toast } = useToast();

  // Initialisation du système musical
  const initializeMusicSystem = useCallback(async () => {
    try {
      setError(null);
      console.log('Initialisation du système musical...');
      // Simuler un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitialized(true);
      toast({
        title: "Système musical initialisé",
        description: "Prêt à jouer de la musique"
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du système musical:', err);
      setError('Impossible d\'initialiser le système musical');
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser le système musical",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Fonctions pour le tiroir musical
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return {
    currentTrack,
    setCurrentTrack,
    currentEmotion,
    setCurrentEmotion,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    error,
    isInitialized,
    setIsInitialized,
    setError,
    initializeMusicSystem
  };
}

export default useMusicState;
