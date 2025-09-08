
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MusicPlaylist } from '@/types/music';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const activateMusicForEmotion = async (params: { emotion: string; intensity?: number }) => {
    setIsLoading(true);
    
    try {
      console.log('🎵 Appel de la fonction emotionscare-music-generator avec:', params);
      
      const { data, error } = await supabase.functions.invoke('emotionscare-music-generator', {
        body: {
          emotion: params.emotion,
          intensity: params.intensity || 0.7
        }
      });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée reçue de la fonction');
      }

      console.log('✅ Playlist générée:', data);
      
      toast({
        title: "Playlist générée",
        description: `Playlist pour l'émotion "${params.emotion}" créée avec succès`,
      });

      return data as MusicPlaylist;
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de générer la playlist. Vérifiez votre connexion.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      calm: "Une musique apaisante pour vous détendre et retrouver votre sérénité.",
      energetic: "Des rythmes dynamiques pour vous donner de l'énergie et de la motivation.",
      happy: "Des mélodies joyeuses pour amplifier votre bonne humeur.",
      sad: "Des sons réconfortants pour vous accompagner dans vos moments difficiles.",
      focused: "Une ambiance sonore parfaite pour la concentration et la productivité.",
      relaxed: "Des sonorités douces pour un moment de détente absolu.",
    };
    
    return descriptions[emotion.toLowerCase()] || "Une playlist personnalisée selon votre état émotionnel.";
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading
  };
};
