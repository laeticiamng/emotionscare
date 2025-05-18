
import { useState, useEffect, useCallback } from 'react';
import { useMusicPlayer } from '@/contexts/music'; // Importation corrigée

export interface UseMusicGenOptions {
  autoPlay?: boolean;
  emotion?: string;
  duration?: number;
}

export const useMusicGen = (options: UseMusicGenOptions = {}) => {
  const { autoPlay = false, emotion = 'neutral', duration = 60 } = options;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrackUrl, setGeneratedTrackUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const musicContext = useMusicPlayer();
  
  const generateMusic = useCallback(async (emotionValue: string = emotion, durationValue: number = duration) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Dans une véritable application, nous appellerions une API de génération de musique
      // Pour cette simulation, nous utiliserons un délai pour simuler la génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // URL simulée pour un morceau généré
      const mockTrackUrl = `/api/music/generated/${emotionValue}_${Date.now()}.mp3`;
      setGeneratedTrackUrl(mockTrackUrl);
      
      if (autoPlay && musicContext) {
        // Simuler la lecture de la piste générée
        musicContext.playTrack({
          id: `generated-${Date.now()}`,
          title: `Musique générée pour ${emotionValue}`,
          artist: 'IA Musicien',
          duration: durationValue,
          audioUrl: mockTrackUrl
        });
      }
      
      return mockTrackUrl;
    } catch (e) {
      const errorObj = e instanceof Error ? e : new Error("Erreur lors de la génération de musique");
      setError(errorObj);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [autoPlay, emotion, duration, musicContext]);
  
  return {
    generateMusic,
    isGenerating,
    generatedTrackUrl,
    error,
    playGeneratedTrack: () => {
      if (generatedTrackUrl && musicContext) {
        musicContext.playTrack({
          id: `generated-${Date.now()}`,
          title: `Musique générée pour ${emotion}`,
          artist: 'IA Musicien',
          duration,
          audioUrl: generatedTrackUrl
        });
      }
    }
  };
};

export default useMusicGen;
