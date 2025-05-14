
import React, { useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useCoach } from '@/hooks/useCoach';
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
  const coach = useCoach();
  const { toast } = useToast();
  
  // Access lastEmotion from coach
  const emotionToUse = coach.lastEmotion || emotion;
  
  // Synchronisation automatique si activée
  useEffect(() => {
    if (autoSync && emotionToUse && emotionToUse !== 'neutral') {
      console.log(`Synchronisation automatique de la musique avec l'émotion: ${emotionToUse}`);
      loadPlaylistForEmotion(emotionToUse.toLowerCase());
      
      toast({
        title: "Musique adaptée",
        description: `L'ambiance musicale s'est adaptée automatiquement à votre humeur: ${emotionToUse}`
      });
    }
  }, [autoSync, emotionToUse, loadPlaylistForEmotion]);
  
  return null; // Composant sans rendu visuel
};

export default MusicEmotionSync;
