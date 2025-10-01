// @ts-nocheck

import { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  genre?: string;
}

export function useMusicGen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Générer une musique basée sur une émotion
   */
  const generateMusicByEmotion = async (emotion: string): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // En production, appel via Edge Function Supabase vers MusicGen
      // const { data, error } = await supabase.functions.invoke('music-generation', {
      //   body: { emotion, prompt: `Generate calming music for ${emotion} emotion` }
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Générer une piste simulée basée sur l'émotion
      const musicStyles = {
        joy: { genre: 'Pop Joyeux', tempo: 'Énergique' },
        calm: { genre: 'Ambient', tempo: 'Lent' },
        sadness: { genre: 'Mélancolique', tempo: 'Modéré' },
        anger: { genre: 'Rock', tempo: 'Intense' },
        fear: { genre: 'Atmosphérique', tempo: 'Tendu' },
        surprise: { genre: 'Électronique', tempo: 'Dynamique' },
        love: { genre: 'Romantique', tempo: 'Doux' }
      };
      
      const style = musicStyles[emotion] || musicStyles.calm;
      
      // URLs d'exemple de musiques libres de droits
      const sampleTracks = [
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'
      ];
      
      const track: GeneratedTrack = {
        id: `generated-${Date.now()}`,
        title: `Musique ${style.genre} pour ${emotion}`,
        artist: 'IA Compositeur',
        duration: Math.floor(Math.random() * 180 + 120), // 2-5 minutes
        audioUrl: sampleTracks[Math.floor(Math.random() * sampleTracks.length)],
        coverUrl: `https://source.unsplash.com/300x300/?music,${emotion}`,
        genre: style.genre
      };
      
      setGeneratedTrack(track);
      return track;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur de génération musicale: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Générer une musique avec un prompt personnalisé
   */
  const generateMusicByPrompt = async (prompt: string, duration: number = 30): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // En production, appel via Edge Function Supabase
      // const { data, error } = await supabase.functions.invoke('music-generation', {
      //   body: { prompt, duration }
      // });
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const track: GeneratedTrack = {
        id: `custom-${Date.now()}`,
        title: `Composition personnalisée`,
        artist: 'IA Compositeur',
        duration,
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        coverUrl: 'https://source.unsplash.com/300x300/?music,composition',
        genre: 'Personnalisé'
      };
      
      setGeneratedTrack(track);
      return track;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur de génération: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Créer une playlist basée sur l'humeur
   */
  const generatePlaylistByMood = async (mood: string, trackCount: number = 5): Promise<GeneratedTrack[]> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Générer plusieurs pistes
      const tracks: GeneratedTrack[] = [];
      for (let i = 0; i < trackCount; i++) {
        tracks.push({
          id: `playlist-${Date.now()}-${i}`,
          title: `Piste ${i + 1} - ${mood}`,
          artist: 'IA Compositeur',
          duration: Math.floor(Math.random() * 180 + 120),
          audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
          coverUrl: `https://source.unsplash.com/300x300/?music,${mood}`,
          genre: mood
        });
      }
      
      return tracks;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur de génération de playlist: ${error.message}`);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateMusicByEmotion,
    generateMusicByPrompt,
    generatePlaylistByMood,
    generatedTrack,
    isGenerating,
    error
  };
}

export default useMusicGen;
