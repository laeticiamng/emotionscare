
/**
 * Hook useMusicGen
 * 
 * Ce hook fournit une interface React pour utiliser les services de génération de musique
 * avec gestion d'état, chargement, et lecture.
 */
import { useState, useCallback } from 'react';
import { musicGen } from '@/services';
import { MusicGenOptions, MusicGenResult } from '@/services/musicgen';
import { AudioTrack } from '@/types/audio';
import { useAudio } from '@/contexts';
import { useToast } from '@/hooks/use-toast';

interface UseMusicGenOptions {
  autoPlay?: boolean;
  onGenerated?: (track: AudioTrack) => void;
  onError?: (error: Error) => void;
}

export function useMusicGen(options: UseMusicGenOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<AudioTrack | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { playTrack } = useAudio();
  const { toast } = useToast();
  
  const { 
    autoPlay = false,
    onGenerated,
    onError 
  } = options;
  
  /**
   * Génère une piste musicale avec les options spécifiées
   */
  const generateMusic = useCallback(async (options: MusicGenOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Génère la musique
      const result: MusicGenResult = await musicGen.generateMusic(options);
      
      // Convertit en AudioTrack
      const track = musicGen.resultToAudioTrack(result);
      setGeneratedTrack(track);
      
      // Lecture automatique si activée
      if (autoPlay && playTrack) {
        playTrack(track);
      }
      
      // Notification
      toast({
        title: "Musique générée",
        description: "Votre musique a été générée avec succès.",
      });
      
      // Callback utilisateur
      if (onGenerated) {
        onGenerated(track);
      }
      
      return track;
    } catch (err) {
      console.error('Error generating music:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [autoPlay, playTrack, onGenerated, onError, toast]);
  
  /**
   * Génère une piste musicale basée sur une émotion
   */
  const generateMusicByEmotion = useCallback(async (emotion: string, options: Partial<MusicGenOptions> = {}) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Génère la musique basée sur l'émotion
      const track = await musicGen.generateMusicByEmotion(emotion, options);
      setGeneratedTrack(track);
      
      // Lecture automatique si activée
      if (autoPlay && playTrack) {
        playTrack(track);
      }
      
      // Notification
      toast({
        title: "Musique générée",
        description: `Musique adaptée à l'émotion "${emotion}" générée avec succès.`,
      });
      
      // Callback utilisateur
      if (onGenerated) {
        onGenerated(track);
      }
      
      return track;
    } catch (err) {
      console.error('Error generating music by emotion:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique d'ambiance. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [autoPlay, playTrack, onGenerated, onError, toast]);
  
  /**
   * Joue la dernière piste générée
   */
  const playGeneratedTrack = useCallback(() => {
    if (generatedTrack && playTrack) {
      playTrack(generatedTrack);
    }
  }, [generatedTrack, playTrack]);
  
  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setGeneratedTrack(null);
    setError(null);
  }, []);
  
  return {
    isGenerating,
    generatedTrack,
    error,
    generateMusic,
    generateMusicByEmotion,
    playGeneratedTrack,
    reset
  };
}

export default useMusicGen;
