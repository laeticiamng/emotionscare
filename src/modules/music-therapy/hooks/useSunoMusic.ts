/**
 * Hook pour l'intégration Suno AI Music
 * Génération de musique thérapeutique personnalisée
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  SunoMusicService,
  type SunoGenerationRequest,
  type SunoGenerationResult,
  type SunoTrack,
  type TherapeuticPlaylistRequest
} from '../sunoIntegration';

export interface UseSunoMusicOptions {
  autoLoadUserTracks?: boolean;
}

export function useSunoMusic(options: UseSunoMusicOptions = {}) {
  const { autoLoadUserTracks = true } = options;
  const queryClient = useQueryClient();

  const [currentTrack, setCurrentTrack] = useState<SunoGenerationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Query: récupérer les pistes générées par l'utilisateur
  const {
    data: userTracks = [],
    isLoading: isLoadingTracks,
    refetch: refetchTracks
  } = useQuery({
    queryKey: ['suno-user-tracks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return SunoMusicService.getUserGeneratedTracks(user.id);
    },
    enabled: autoLoadUserTracks,
    staleTime: 60000
  });

  // Mutation: générer une piste
  const generateTrackMutation = useMutation({
    mutationFn: (request: SunoGenerationRequest) => 
      SunoMusicService.generateTrack(request),
    onMutate: () => {
      toast.loading('Génération de la musique en cours...', { id: 'suno-generate' });
    },
    onSuccess: (result) => {
      toast.success('Musique générée avec succès !', { id: 'suno-generate' });
      setCurrentTrack(result);
      queryClient.invalidateQueries({ queryKey: ['suno-user-tracks'] });
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`, { id: 'suno-generate' });
    }
  });

  // Mutation: générer une playlist thérapeutique
  const generatePlaylistMutation = useMutation({
    mutationFn: (request: TherapeuticPlaylistRequest) =>
      SunoMusicService.generateTherapeuticPlaylist(request),
    onMutate: () => {
      toast.loading('Création de la playlist...', { id: 'suno-playlist' });
    },
    onSuccess: (tracks) => {
      toast.success(`Playlist de ${tracks.length} pistes créée !`, { id: 'suno-playlist' });
      queryClient.invalidateQueries({ queryKey: ['suno-user-tracks'] });
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`, { id: 'suno-playlist' });
    }
  });

  // Mutation: adapter une piste à l'humeur
  const adaptTrackMutation = useMutation({
    mutationFn: ({ trackId, currentMood, targetMood }: {
      trackId: string;
      currentMood: number;
      targetMood: number;
    }) => SunoMusicService.adaptTrackToMood(trackId, currentMood, targetMood),
    onSuccess: (result) => {
      if (result.adaptations.length > 0) {
        toast.info(`Musique adaptée: ${result.adaptations.join(', ')}`);
      }
    }
  });

  // Générer une piste rapide basée sur l'émotion
  const generateQuickTrack = useCallback((emotion: string) => {
    const moodMapping: Record<string, SunoGenerationRequest> = {
      anxieux: {
        prompt: 'calming ambient music for anxiety relief',
        mood: 'calm',
        therapeuticGoal: 'relaxation',
        tempo: 'slow',
        instrumental: true
      },
      triste: {
        prompt: 'gentle uplifting music for emotional support',
        mood: 'hopeful',
        therapeuticGoal: 'emotional_release',
        tempo: 'slow',
        instrumental: true
      },
      stressé: {
        prompt: 'peaceful nature sounds with soft melodies',
        mood: 'peaceful',
        therapeuticGoal: 'relaxation',
        tempo: 'slow',
        instrumental: true
      },
      fatigué: {
        prompt: 'gently energizing ambient music',
        mood: 'refreshed',
        therapeuticGoal: 'energize',
        tempo: 'medium',
        instrumental: true
      },
      joyeux: {
        prompt: 'celebratory ambient music',
        mood: 'joyful',
        therapeuticGoal: 'energize',
        tempo: 'medium',
        instrumental: true
      },
      concentré: {
        prompt: 'focus-enhancing minimal electronic',
        mood: 'focused',
        therapeuticGoal: 'focus',
        tempo: 'medium',
        instrumental: true
      }
    };

    const request = moodMapping[emotion.toLowerCase()] || {
      prompt: `therapeutic music for ${emotion} mood`,
      mood: emotion,
      therapeuticGoal: 'relaxation' as const,
      tempo: 'medium' as const,
      instrumental: true
    };

    generateTrackMutation.mutate(request);
  }, [generateTrackMutation]);

  // Générer pour le sommeil
  const generateSleepMusic = useCallback(() => {
    generateTrackMutation.mutate({
      prompt: 'deep sleep inducing ambient soundscape with very slow fade',
      mood: 'sleepy',
      therapeuticGoal: 'sleep',
      tempo: 'slow',
      instrumental: true,
      duration: 600 // 10 minutes
    });
  }, [generateTrackMutation]);

  // Générer pour la méditation
  const generateMeditationMusic = useCallback((durationMinutes: number = 10) => {
    generateTrackMutation.mutate({
      prompt: 'deep meditation ambient music with tibetan bowls undertones',
      mood: 'meditative',
      therapeuticGoal: 'relaxation',
      tempo: 'slow',
      instrumental: true,
      duration: durationMinutes * 60
    });
  }, [generateTrackMutation]);

  // Jouer/Pause
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Sélectionner une piste
  const selectTrack = useCallback((track: SunoTrack) => {
    setCurrentTrack({
      id: track.id,
      audioUrl: track.audioUrl,
      title: track.title,
      style: track.style,
      duration: track.duration,
      metadata: {
        prompt: '',
        createdAt: track.createdAt,
        therapeuticProperties: {
          moodTarget: 'calm',
          energyLevel: 0.5,
          stressReduction: track.therapeuticScore
        }
      }
    });
    setIsPlaying(true);
  }, []);

  return {
    // État
    currentTrack,
    isPlaying,
    progress,
    userTracks,
    isLoadingTracks,

    // Actions de génération
    generateTrack: generateTrackMutation.mutate,
    generatePlaylist: generatePlaylistMutation.mutate,
    adaptTrack: adaptTrackMutation.mutate,
    generateQuickTrack,
    generateSleepMusic,
    generateMeditationMusic,

    // Actions de lecture
    togglePlayback,
    selectTrack,
    setProgress,
    refetchTracks,

    // États de chargement
    isGenerating: generateTrackMutation.isPending,
    isGeneratingPlaylist: generatePlaylistMutation.isPending,
    isAdapting: adaptTrackMutation.isPending
  };
}

export default useSunoMusic;
