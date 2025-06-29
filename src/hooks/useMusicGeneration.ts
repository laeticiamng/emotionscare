
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';
import { toast } from '@/hooks/use-toast';

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMusic = async (emotion: string, customPrompt?: string): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Mapper l'émotion vers un style musical
      const emotionToStyle = {
        'calm': 'ambient, relaxing, peaceful',
        'energetic': 'upbeat, electronic, energizing',
        'happy': 'pop, uplifting, cheerful',
        'focused': 'lo-fi, minimal, concentration',
        'relaxed': 'chill, soft, soothing',
        'motivated': 'inspiring, dynamic, powerful',
        'joy': 'joyful, bright, positive',
        'sadness': 'melancholic, gentle, reflective'
      };

      const style = emotionToStyle[emotion as keyof typeof emotionToStyle] || 'ambient, peaceful';
      
      // Générer des paroles basées sur l'émotion et le prompt personnalisé
      const lyrics = customPrompt 
        ? `Une mélodie ${emotion} avec ${customPrompt}`
        : `Une mélodie ${emotion} apaisante et harmonieuse`;

      console.log('🎵 Génération musique avec:', { emotion, style, lyrics });

      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          lyrics,
          style,
          rang: 'A', // Qualité haute
          duration: 240, // 4 minutes
          language: 'fr',
          fastMode: true
        }
      });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw new Error(error.message);
      }

      if (!data || !data.audio_url) {
        throw new Error('Aucune URL audio reçue');
      }

      console.log('✅ Musique générée:', data);

      // Créer l'objet MusicTrack
      const track: MusicTrack = {
        id: crypto.randomUUID(),
        title: data.title || `Musique ${emotion}`,
        artist: 'Suno AI',
        duration: 240,
        url: data.audio_url,
        coverUrl: data.image_url,
        emotion,
        genre: style,
        energy: emotion === 'energetic' ? 0.9 : emotion === 'calm' ? 0.3 : 0.6,
        valence: emotion === 'happy' ? 0.9 : emotion === 'sadness' ? 0.2 : 0.6
      };

      toast({
        title: "🎵 Musique générée !",
        description: `"${track.title}" est prête à être écoutée`,
      });

      return track;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ Erreur génération:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMusic,
    isGenerating,
    error
  };
};
