
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { normalizeMusicTrack, createMusicPlaylist } from '@/utils/musicCompatibility';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const { toast } = useToast();

  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      console.log('🎵 Activation de la musique pour:', params);
      
      const { data, error } = await supabase.functions.invoke('emotionscare-music-generator', {
        body: {
          emotion: params.emotion,
          intensity: params.intensity || 0.5,
          preferences: params.preferences || {}
        }
      });

      if (error) {
        console.error('❌ Erreur lors de la génération musicale:', error);
        throw error;
      }

      if (data?.playlist) {
        console.log('✅ Playlist générée avec succès:', data.playlist);
        
        // Normaliser les morceaux
        const normalizedTracks = data.playlist.tracks.map(normalizeMusicTrack);
        
        // Créer la playlist
        const playlist = createMusicPlaylist(
          normalizedTracks,
          params.emotion,
          data.playlist.name
        );

        setCurrentPlaylist(playlist);

        toast({
          title: "🎵 Musique générée !",
          description: `Une playlist de ${playlist.tracks.length} morceaux adaptée à votre émotion "${params.emotion}" est prête.`
        });

        return playlist;
      }

      throw new Error('Pas de playlist dans la réponse');

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      
      toast({
        title: "❌ Erreur musicale",
        description: "Impossible de générer la musique. Réessayez.",
        variant: "destructive"
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMusicRecommendationForEmotion = async (emotionResult: any): Promise<MusicPlaylist | null> => {
    return await activateMusicForEmotion({
      emotion: emotionResult.emotion.toLowerCase(),
      intensity: emotionResult.confidence || 0.7
    });
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions = {
      calm: 'Musique apaisante pour maintenir votre sérénité',
      happy: 'Musique joyeuse pour amplifier votre bonheur',
      sad: 'Musique douce pour vous accompagner',
      anxious: 'Musique relaxante pour réduire le stress',
      angry: 'Musique calmante pour apaiser les tensions',
      energetic: 'Musique dynamique pour votre énergie',
      focused: 'Musique de concentration pour votre productivité',
      relaxed: 'Musique détendue pour votre bien-être'
    };
    
    return descriptions[emotion as keyof typeof descriptions] || 
           'Musique adaptée à votre état émotionnel';
  };

  return {
    activateMusicForEmotion,
    getMusicRecommendationForEmotion,
    getEmotionMusicDescription,
    isLoading,
    currentPlaylist
  };
};
