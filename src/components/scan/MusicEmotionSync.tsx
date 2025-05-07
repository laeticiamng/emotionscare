
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import useCoach from '@/hooks/useCoach';
import { useToast } from '@/hooks/use-toast';

interface MusicEmotionSyncProps {
  emotion?: string;
  intensity?: number;
  autoSync?: boolean;
}

/**
 * Composant permettant de synchroniser l'état émotionnel avec l'ambiance musicale
 * Peut fonctionner en mode automatique ou sur demande
 */
const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({
  emotion = 'neutral',
  intensity = 50,
  autoSync = false
}) => {
  const { loadPlaylistForEmotion } = useMusic();
  const { lastEmotion } = useCoach();
  const { toast } = useToast();
  
  // Synchronisation automatique si activée
  useEffect(() => {
    if (autoSync && emotion && emotion !== 'neutral') {
      console.log(`Synchronisation automatique de la musique avec l'émotion: ${emotion}`);
      loadPlaylistForEmotion(emotion.toLowerCase());
      
      toast({
        title: "Musique adaptée",
        description: `L'ambiance musicale s'est adaptée automatiquement à votre humeur: ${emotion}`
      });
    }
  }, [autoSync, emotion, loadPlaylistForEmotion]);
  
  return null; // Composant sans rendu visuel
};

export default MusicEmotionSync;
