import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  mood: string;
  url: string;
  duration: number;
  generated: boolean;
}

interface MusicGenSession {
  id: string;
  tracks: MusicTrack[];
  currentTrack: number;
  isPlaying: boolean;
  mood: string;
}

export const useMusicGen = () => {
  const [session, setSession] = useState<MusicGenSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateMusic = useCallback(async (
    prompt: string,
    mood: string = 'neutral',
    genre: string = 'ambient'
  ): Promise<MusicTrack | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      toast.info('Génération musicale en cours...', {
        description: 'Cela peut prendre quelques secondes'
      });

      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt,
          mood,
          genre,
          duration: 30 // 30 seconds for quick generation
        }
      });

      if (error) throw error;

      const track: MusicTrack = {
        id: data.id || Date.now().toString(),
        title: data.title || `${genre} - ${mood}`,
        genre,
        mood,
        url: data.audioUrl || '',
        duration: data.duration || 30,
        generated: true
      };

      toast.success('Musique générée !', {
        description: `Nouveau morceau: ${track.title}`
      });

      return track;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération musicale';
      setError(errorMessage);
      logger.error('Error generating music', err as Error, 'MUSIC');
      
      // Fallback mock track for development
      const mockTrack: MusicTrack = {
        id: Date.now().toString(),
        title: `${genre} généré - ${mood}`,
        genre,
        mood,
        url: '/sounds/ambient-calm.mp3', // Fallback to existing audio
        duration: 30,
        generated: true
      };

      toast.error('Mode développement : piste audio simulée');
      return mockTrack;

    } finally {
      setIsGenerating(false);
    }
  }, []);

  const startSession = useCallback(async (mood: string = 'calm') => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate initial track
      const initialTrack = await generateMusic(
        `Create a relaxing ${mood} ambient track for meditation`,
        mood,
        'ambient'
      );

      if (initialTrack) {
        const newSession: MusicGenSession = {
          id: Date.now().toString(),
          tracks: [initialTrack],
          currentTrack: 0,
          isPlaying: false,
          mood
        };

        setSession(newSession);
        toast.success('Session musicothérapie démarrée');
      }

    } catch (err) {
      logger.error('Error starting music session', err as Error, 'MUSIC');
      setError('Erreur lors du démarrage de la session');
    } finally {
      setIsLoading(false);
    }
  }, [generateMusic]);

  const playTrack = useCallback((trackIndex: number = 0) => {
    if (!session || !session.tracks[trackIndex]) return;

    const track = session.tracks[trackIndex];
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().catch(err => {
        logger.error('Error playing track', err as Error, 'MUSIC');
        toast.error('Erreur de lecture audio');
      });
    }

    setSession(prev => prev ? {
      ...prev,
      currentTrack: trackIndex,
      isPlaying: true
    } : null);

    toast.success(`Lecture: ${track.title}`);
  }, [session]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setSession(prev => prev ? {
      ...prev,
      isPlaying: false
    } : null);
  }, []);

  const addTrackToSession = useCallback(async (prompt: string) => {
    if (!session) return;

    const newTrack = await generateMusic(prompt, session.mood, 'ambient');
    
    if (newTrack) {
      setSession(prev => prev ? {
        ...prev,
        tracks: [...prev.tracks, newTrack]
      } : null);
    }
  }, [session, generateMusic]);

  const endSession = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    setSession(null);
    toast.info('Session terminée');
  }, []);

  return {
    session,
    isGenerating,
    isLoading,
    error,
    audioRef,
    generateMusic,
    startSession,
    playTrack,
    pauseTrack,
    addTrackToSession,
    endSession,
    currentTrack: session?.tracks[session.currentTrack] || null,
    isPlaying: session?.isPlaying || false
  };
};
