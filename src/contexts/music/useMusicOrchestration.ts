/**
 * Music Orchestration Hook - Gestion des presets et orchestration clinique
 */

import { useCallback, useRef, useEffect, MutableRefObject, Dispatch } from 'react';
import { MusicState, MusicAction, MusicOrchestrationPreset } from './types';
import { musicOrchestrationService } from '@/services/music/orchestration';
import { logger } from '@/lib/logger';

export const useMusicOrchestration = (
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  state: MusicState,
  dispatch: Dispatch<MusicAction>,
  setVolume: (volume: number) => void
) => {
  const crossfadeFrameRef = useRef<number>();
  const isPlayingRef = useRef(state.isPlaying);

  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);

  const applyPresetProfile = useCallback(
    (preset: MusicOrchestrationPreset, options?: { immediate?: boolean }) => {
      const timestamp = new Date().toISOString();
      dispatch({ type: 'SET_ACTIVE_PRESET', payload: { preset, timestamp } });

      const audio = audioRef.current;
      const clampedVolume = Math.max(0, Math.min(1, preset.volume));

      if (!audio) {
        dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
        return;
      }

      audio.playbackRate = preset.playbackRate;

      try {
        (audio as any).preservesPitch = true;
        (audio as any).mozPreservesPitch = true;
      } catch (_) {
        // Ignore unsupported properties
      }

      const shouldFade = isPlayingRef.current && !options?.immediate && preset.crossfadeMs > 0;

      if (!shouldFade) {
        setVolume(clampedVolume);
        return;
      }

      if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
        setVolume(clampedVolume);
        return;
      }

      if (crossfadeFrameRef.current) {
        window.cancelAnimationFrame(crossfadeFrameRef.current);
        crossfadeFrameRef.current = undefined;
      }

      const startVolume = audio.volume;
      const startTime = window.performance?.now?.() ?? Date.now();
      const duration = preset.crossfadeMs;

      const step = (time: number) => {
        const now = time ?? (window.performance?.now?.() ?? Date.now());
        const progress = Math.min(1, (now - startTime) / duration);
        const interpolated = startVolume + (clampedVolume - startVolume) * progress;
        audio.volume = Math.max(0, Math.min(1, interpolated));

        if (progress < 1) {
          crossfadeFrameRef.current = window.requestAnimationFrame(step);
        } else {
          crossfadeFrameRef.current = undefined;
          setVolume(clampedVolume);
        }
      };

      crossfadeFrameRef.current = window.requestAnimationFrame(step);
    },
    [dispatch, setVolume, audioRef]
  );

  // Bootstrap orchestration on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let mounted = true;

    const bootstrap = async () => {
      const resumePreset = musicOrchestrationService.getActivePreset();
      applyPresetProfile(resumePreset, { immediate: true });

      const evaluation = await musicOrchestrationService.refreshFromClinicalSignals();
      if (!mounted) return;

      applyPresetProfile(evaluation.preset, { immediate: !evaluation.changed });
    };

    bootstrap().catch(error => {
      logger.error('Failed to initialize music orchestration preset', error as Error, 'MUSIC');
    });

    const handleMoodUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ valence?: number; arousal?: number; timestamp?: string }>;
      if (!customEvent.detail) return;

      const { valence, arousal, timestamp } = customEvent.detail;
      const parsedValence = Number(valence);
      const parsedArousal = Number(arousal);
      const safeValence = Number.isFinite(parsedValence)
        ? Math.max(0, Math.min(100, parsedValence))
        : 50;
      const safeArousal = Number.isFinite(parsedArousal)
        ? Math.max(0, Math.min(100, parsedArousal))
        : 50;
      const evaluation = musicOrchestrationService.handleMoodUpdate({
        valence: safeValence,
        arousal: safeArousal,
        timestamp: timestamp || new Date().toISOString(),
      });

      applyPresetProfile(evaluation.preset, { immediate: !evaluation.changed });
    };

    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
      if (crossfadeFrameRef.current) {
        window.cancelAnimationFrame(crossfadeFrameRef.current);
        crossfadeFrameRef.current = undefined;
      }
    };
  }, [applyPresetProfile]);

  return {
    applyPresetProfile,
  };
};
