
import { useState } from 'react';
import { musicGen } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { AudioTrack } from '@/types/audio';

export function useMusicGen() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedTrack, setGeneratedTrack] = useState<AudioTrack | null>(null);
  
  /**
   * Génère une piste musicale basée sur une description
   */
  const generateMusic = async (options: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await musicGen.generateMusic(options);
      const track = musicGen.resultToAudioTrack(result, options.title);
      setGeneratedTrack(track);
      return track;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur lors de la génération de musique",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Génère une piste musicale basée sur une émotion
   */
  const generateMusicByEmotion = async (emotion: string, options: any = {}) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const track = await musicGen.generateMusicByEmotion(emotion, options);
      setGeneratedTrack(track);
      return track;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur lors de la génération de musique",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateMusic,
    generateMusicByEmotion,
    generatedTrack,
    isGenerating,
    error
  };
}

export default useMusicGen;
