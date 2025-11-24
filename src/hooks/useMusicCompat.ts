/**
 * useMusicCompat - Hook de Compatibilité pour Migration Progressive
 *
 * Fournit la même API que MusicContext mais utilise useMusicStore + useMusicAudio
 * Permet de migrer les composants un par un sans breaking changes
 */

import { useCallback } from 'react';
import { useMusicStore } from '@/store/music.store';
import { useMusicAudio } from './useMusicAudio';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import type { MusicTrack } from '@/types/music';

// ============================================================================
// EMOTION DESCRIPTIONS (copié depuis useMusicGeneration)
// ============================================================================

const EMOTION_DESCRIPTIONS: Record<string, string> = {
  calm: 'Musique douce et apaisante avec des mélodies fluides',
  joy: 'Rythmes enjoués et harmonies positives',
  sad: 'Mélodies mélancoliques et réconfortantes',
  energetic: 'Beats dynamiques et motivants',
  anxious: 'Sons apaisants pour réduire l\'anxiété',
  creative: 'Ambiances inspirantes et stimulantes',
  healing: 'Fréquences thérapeutiques harmonisantes',
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useMusicCompat = () => {
  // Store access
  const store = useMusicStore();

  // Audio controls
  const audio = useMusicAudio();

  // ============================================================================
  // PLAYLIST METHODS
  // ============================================================================

  const setPlaylist = useCallback((tracks: MusicTrack[]) => {
    store.setPlaylist(tracks);
  }, [store]);

  const addToPlaylist = useCallback((track: MusicTrack) => {
    store.addToPlaylist(track);
  }, [store]);

  const removeFromPlaylist = useCallback((trackId: string) => {
    store.removeFromPlaylist(trackId);
  }, [store]);

  const shufflePlaylist = useCallback(() => {
    store.toggleShuffle();
  }, [store]);

  const toggleFavorite = useCallback((trackId: string) => {
    store.toggleFavorite(trackId);
  }, [store]);

  const getRecommendationsForEmotion = useCallback(
    async (emotion: string, intensity: number = 5): Promise<MusicTrack[]> => {
      try {
        // Get current session for auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          logger.warn('No session - cannot fetch music recommendations', {}, 'MUSIC');
          return [];
        }

        // Construct URL with query params
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const url = new URL(`${supabaseUrl}/functions/v1/adaptive-music/recommendations`);
        url.searchParams.set('emotion', emotion);
        url.searchParams.set('intensity', intensity.toString());

        // Call edge function directly with fetch
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          logger.error('Failed to get music recommendations', { status: response.status }, 'MUSIC');
          return [];
        }

        const data = await response.json();

        // Transform edge function response to MusicTrack format
        const tracks: MusicTrack[] = (data?.recommendations || []).map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          url: track.url,
          emotion_tags: track.emotion_tags,
          bpm: track.bpm,
          energy_level: track.energy_level,
        }));

        logger.info('Music recommendations fetched', {
          emotion,
          intensity,
          count: tracks.length
        }, 'MUSIC');

        return tracks;
      } catch (error) {
        logger.error('Exception fetching music recommendations', error as Error, 'MUSIC');
        return [];
      }
    },
    []
  );

  // ============================================================================
  // GENERATION METHODS (Suno AI)
  // ============================================================================

  const generateMusicForEmotion = useCallback(
    async (emotion: string, prompt?: string): Promise<MusicTrack | null> => {
      try {
        store.setGenerating(true);
        store.setGenerationError(null);

        logger.info('Music generation requested', { emotion, prompt }, 'MUSIC');

        // Étape 1: Générer le prompt Suno via edge function
        const generatePromptRes = await supabase.functions.invoke('generate-suno-prompt', {
          body: {
            emotion,
            intensity: 75,
            userContext: prompt,
            mood: emotion,
          },
        });

        if (generatePromptRes.error) {
          throw new Error(`Failed to generate prompt: ${generatePromptRes.error}`);
        }

        const { prompt: sunoPrompt } = generatePromptRes.data;

        // Étape 2: Appeler Suno API pour générer la musique
        const musicRes = await supabase.functions.invoke('suno-music', {
          body: {
            action: 'start',
            prompt: sunoPrompt.style,
            mood: emotion,
            sessionId: Date.now().toString(),
          },
        });

        if (musicRes.error) {
          throw new Error(`Failed to start music generation: ${musicRes.error}`);
        }

        const { data } = musicRes.data;

        // Retourner le track générée
        const track: MusicTrack = {
          id: data?.id || `track-${Date.now()}`,
          title: `Musique ${emotion}`,
          artist: 'EmotionsCare AI',
          emotion,
          url: data?.audio_url || '',
          audioUrl: data?.audio_url || '',
          duration: data?.duration || 0,
          status: 'generating',
        };

        logger.info('Music generation started', { trackId: track.id, emotion }, 'MUSIC');

        return track;
      } catch (error) {
        logger.error('Music generation failed', error as Error, 'MUSIC');
        store.setGenerationError((error as Error).message);
        return null;
      } finally {
        store.setGenerating(false);
      }
    },
    [store]
  );

  const checkGenerationStatus = useCallback(
    async (trackId: string): Promise<MusicTrack | null> => {
      try {
        // Vérifier le statut via Suno API
        const statusRes = await supabase.functions.invoke('suno-music', {
          body: {
            action: 'status',
            trackIds: [trackId],
          },
        });

        if (statusRes.error) {
          throw new Error(`Failed to check status: ${statusRes.error}`);
        }

        const { data } = statusRes.data;

        // Retourner le track avec son statut mis à jour
        const track: MusicTrack = {
          id: data?.id || trackId,
          title: data?.title || 'Generated Track',
          artist: 'EmotionsCare AI',
          emotion: 'neutral',
          url: data?.audio_url || '',
          audioUrl: data?.audio_url || '',
          duration: data?.duration || 0,
          status: data?.status || 'pending',
        };

        logger.info('Music generation status checked', { trackId, status: track.status }, 'MUSIC');

        return track;
      } catch (error) {
        logger.error('Generation status check failed', error as Error, 'MUSIC');
        return null;
      }
    },
    []
  );

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    return EMOTION_DESCRIPTIONS[emotion] || EMOTION_DESCRIPTIONS.calm;
  }, []);

  // ============================================================================
  // THERAPEUTIC MODE METHODS
  // ============================================================================

  const enableTherapeuticMode = useCallback(
    (emotion: string) => {
      store.setTherapeuticMode(true);
      store.setEmotionTarget(emotion);
    },
    [store]
  );

  const disableTherapeuticMode = useCallback(() => {
    store.setTherapeuticMode(false);
    store.setEmotionTarget(null);
  }, [store]);

  const adaptVolumeToEmotion = useCallback(
    (emotion: string, intensity: number) => {
      // Ajustement du volume selon l'émotion et l'intensité
      let volumeMultiplier = 1;

      switch (emotion.toLowerCase()) {
        case 'calm':
        case 'sérénité':
          volumeMultiplier = 0.6; // Plus doux
          break;
        case 'anxious':
        case 'stress':
          volumeMultiplier = 0.5; // Très doux
          break;
        case 'energetic':
        case 'joie':
          volumeMultiplier = 0.9; // Plus fort
          break;
        default:
          volumeMultiplier = 0.7;
      }

      const adaptedVolume = volumeMultiplier * (intensity / 10); // Normalize intensity 0-10 to 0-1
      store.setVolume(adaptedVolume);
    },
    [store]
  );

  // ============================================================================
  // RETURN API COMPATIBLE WITH MusicContext
  // ============================================================================

  return {
    // State (compatible avec MusicContext.state)
    state: {
      currentTrack: store.currentTrack,
      isPlaying: store.isPlaying,
      isPaused: store.isPaused,
      volume: store.volume,
      currentTime: store.currentTime,
      duration: store.duration,
      progress: store.progress,
      activePreset: store.activePreset,
      lastPresetChange: store.lastPresetChange,
      playlist: store.playlist,
      currentPlaylistIndex: store.currentPlaylistIndex,
      shuffleMode: store.shuffleMode,
      repeatMode: store.repeatMode,
      isGenerating: store.isGenerating,
      generationProgress: store.generationProgress,
      generationError: store.generationError,
      playHistory: store.playHistory,
      favorites: store.favorites,
      therapeuticMode: store.therapeuticMode,
      emotionTarget: store.emotionTarget,
      adaptiveVolume: store.adaptiveVolume,
    },

    // Playback controls (from useMusicAudio)
    play: audio.play,
    pause: audio.pause,
    stop: audio.stop,
    next: audio.next,
    previous: audio.previous,
    seek: audio.seek,
    setVolume: audio.setVolume,

    // Playlist management
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    shufflePlaylist,
    toggleFavorite,
    getRecommendationsForEmotion,

    // Generation (Suno AI)
    generateMusicForEmotion,
    checkGenerationStatus,
    getEmotionMusicDescription,

    // Therapeutic mode
    enableTherapeuticMode,
    disableTherapeuticMode,
    adaptVolumeToEmotion,
  };
};

export default useMusicCompat;
