
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MixTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  mood: string;
  energy: number; // 0-100
  valence: number; // 0-100
  generated: boolean;
}

interface MoodMix {
  id: string;
  name: string;
  tracks: MixTrack[];
  totalDuration: number;
  targetMood: string;
  fadeTime: number; // seconds between tracks
}

export const useMoodMixer = () => {
  const [currentMix, setCurrentMix] = useState<MoodMix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createMoodMix = useCallback(async (
    targetMood: string,
    userMood: { valence: number; arousal: number },
    preferences: string[] = []
  ): Promise<MoodMix | null> => {
    try {
      setIsGenerating(true);
      setError(null);

      toast.info('Création de votre mix personnalisé...', {
        description: 'Analyse de votre humeur en cours'
      });

      const { data, error } = await supabase.functions.invoke('create-mood-mix', {
        body: {
          targetMood,
          currentMood: userMood,
          preferences,
          duration: 20, // 20 minutes mix
          includeGenerated: true
        }
      });

      if (error) throw error;

      const mix: MoodMix = {
        id: data.id || Date.now().toString(),
        name: data.name || `Mix ${targetMood}`,
        tracks: data.tracks || [],
        totalDuration: data.totalDuration || 1200, // 20 minutes
        targetMood,
        fadeTime: data.fadeTime || 3
      };

      // Add some fallback tracks for development
      if (mix.tracks.length === 0) {
        mix.tracks = [
          {
            id: '1',
            title: 'Ambient Serenity',
            artist: 'AI Generated',
            url: '/sounds/ambient-calm.mp3',
            duration: 180,
            mood: targetMood,
            energy: userMood.arousal,
            valence: userMood.valence,
            generated: true
          },
          {
            id: '2',
            title: 'Gentle Flow',
            artist: 'MusicGen',
            url: '/sounds/ambient-calm.mp3',
            duration: 240,
            mood: targetMood,
            energy: Math.min(userMood.arousal + 10, 100),
            valence: Math.min(userMood.valence + 15, 100),
            generated: true
          }
        ];
      }

      setCurrentMix(mix);
      setCurrentTrackIndex(0);
      
      toast.success(`Mix "${mix.name}" créé !`, {
        description: `${mix.tracks.length} morceaux • ${Math.round(mix.totalDuration / 60)} min`
      });

      return mix;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du mix';
      setError(errorMessage);
      console.error('Error creating mood mix:', err);
      
      toast.error('Mode développement : mix simulé');
      
      // Fallback mix
      const fallbackMix: MoodMix = {
        id: Date.now().toString(),
        name: `Mix ${targetMood} (Demo)`,
        tracks: [
          {
            id: '1',
            title: 'Demo Track 1',
            artist: 'Demo Artist',
            url: '/sounds/ambient-calm.mp3',
            duration: 180,
            mood: targetMood,
            energy: 50,
            valence: 70,
            generated: false
          }
        ],
        totalDuration: 180,
        targetMood,
        fadeTime: 3
      };
      
      setCurrentMix(fallbackMix);
      return fallbackMix;

    } finally {
      setIsGenerating(false);
    }
  }, []);

  const playMix = useCallback(async () => {
    if (!currentMix || currentMix.tracks.length === 0) return;

    try {
      // Start playing from current track
      setIsPlaying(true);
      
      toast.success('Lecture du mix démarrée', {
        description: currentMix.tracks[currentTrackIndex]?.title
      });

      // Simulate track progression (in real app, use audio events)
      const track = currentMix.tracks[currentTrackIndex];
      if (track) {
        // Track progress simulation
        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 1;
          setProgress((elapsed / track.duration) * 100);
          
          if (elapsed >= track.duration) {
            clearInterval(interval);
            nextTrack();
          }
        }, 1000);
      }

    } catch (err) {
      console.error('Error playing mix:', err);
      setError('Erreur lors de la lecture');
    }
  }, [currentMix, currentTrackIndex]);

  const pauseMix = useCallback(() => {
    setIsPlaying(false);
    toast.info('Mix en pause');
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentMix) return;
    
    const nextIndex = (currentTrackIndex + 1) % currentMix.tracks.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    
    if (isPlaying) {
      toast.info('Morceau suivant', {
        description: currentMix.tracks[nextIndex]?.title
      });
    }
  }, [currentMix, currentTrackIndex, isPlaying]);

  const previousTrack = useCallback(() => {
    if (!currentMix) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? currentMix.tracks.length - 1 
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    
    if (isPlaying) {
      toast.info('Morceau précédent', {
        description: currentMix.tracks[prevIndex]?.title
      });
    }
  }, [currentMix, currentTrackIndex, isPlaying]);

  const addTrackToMix = useCallback(async (trackId: string) => {
    if (!currentMix) return;

    try {
      const { data, error } = await supabase.functions.invoke('add-track-to-mix', {
        body: {
          mixId: currentMix.id,
          trackId
        }
      });

      if (error) throw error;

      // Update current mix with new track
      setCurrentMix(prev => prev ? {
        ...prev,
        tracks: [...prev.tracks, data.track],
        totalDuration: prev.totalDuration + data.track.duration
      } : null);

      toast.success('Morceau ajouté au mix');

    } catch (err) {
      console.error('Error adding track to mix:', err);
      toast.error('Erreur lors de l\'ajout du morceau');
    }
  }, [currentMix]);

  return {
    currentMix,
    isPlaying,
    currentTrackIndex,
    isGenerating,
    progress,
    error,
    createMoodMix,
    playMix,
    pauseMix,
    nextTrack,
    previousTrack,
    addTrackToMix,
    currentTrack: currentMix?.tracks[currentTrackIndex] || null,
    remainingTracks: currentMix ? currentMix.tracks.length - currentTrackIndex - 1 : 0
  };
};
