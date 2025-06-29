
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/components/ui/use-toast';

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMusic = async (emotion: string, customPrompt?: string): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('🎵 Generating music for emotion:', emotion, 'with prompt:', customPrompt);
      
      const { data, error: supabaseError } = await supabase.functions.invoke('generate-music', {
        body: {
          emotion,
          customPrompt: customPrompt || '',
          language: 'fr'
        }
      });

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        throw new Error(supabaseError.message || 'Erreur lors de la génération');
      }

      console.log('✅ Music generated successfully:', data);

      if (!data?.audioUrl) {
        throw new Error('Aucune URL audio reçue');
      }

      // Créer l'objet MusicTrack avec les données reçues
      const track: MusicTrack = {
        id: data.id || Date.now().toString(),
        title: data.title || `Musique ${emotion}`,
        artist: data.artist || 'Suno AI',
        url: data.audioUrl,
        duration: data.duration || 240, // 4 minutes par défaut
        emotion,
        coverUrl: data.coverUrl,
        genre: data.genre || 'ambient',
        bpm: data.bpm || 120,
        energy: data.energy || 0.5,
        valence: data.valence || 0.7
      };

      console.log('🎧 Track created:', track);

      toast({
        title: "Musique générée !",
        description: `"${track.title}" est prête à être écoutée.`,
        duration: 3000
      });

      return track;

    } catch (err: any) {
      console.error('❌ Error generating music:', err);
      const errorMessage = err.message || 'Erreur lors de la génération de musique';
      setError(errorMessage);
      
      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
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
