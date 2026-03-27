// @ts-nocheck
import { useCallback, useMemo, useRef, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { logger } from '@/lib/logger';

import type { MusicBpmProfile, MusicIntensityKey, MusicTextureKey } from '@/features/orchestration/music.orchestrator';

interface QueueItem {
  trackId: string;
  crossfadeMs: number;
}

interface EngineState {
  texture: MusicTextureKey;
  intensity: MusicIntensityKey;
  bpmProfile: MusicBpmProfile;
  crossfadeMs: number;
}

const DEFAULT_STATE: EngineState = {
  texture: 'calm_low',
  intensity: 'low',
  bpmProfile: 'slow',
  crossfadeMs: 12000,
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const logBreadcrumb = (message: string, data?: Record<string, unknown>) => {
  logger.info(message, data, 'MUSIC');
};

export function useMusicEngine() {
  const [state, setState] = useState<EngineState>(DEFAULT_STATE);
  const queueRef = useRef<QueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);

  const queue = useCallback((trackId: string, opts?: { crossfadeMs?: number }) => {
    const crossfadeMs = typeof opts?.crossfadeMs === 'number' ? Math.max(0, opts.crossfadeMs) : state.crossfadeMs;
    queueRef.current = [...queueRef.current, { trackId, crossfadeMs }];
    logBreadcrumb('music:engine:queue', { trackId, crossfade_ms: crossfadeMs });
  }, [state.crossfadeMs]);

  const setTexture = useCallback((key: MusicTextureKey) => {
    setState((prev) => {
      if (prev.texture === key) return prev;
      logBreadcrumb('music:engine:set_texture', { texture: key });
      return { ...prev, texture: key };
    });
  }, []);

  const setIntensity = useCallback((key: MusicIntensityKey) => {
    setState((prev) => {
      if (prev.intensity === key) return prev;
      logBreadcrumb('music:engine:set_intensity', { intensity: key });
      return { ...prev, intensity: key };
    });
  }, []);

  const setBpmProfile = useCallback((key: MusicBpmProfile) => {
    setState((prev) => {
      if (prev.bpmProfile === key) return prev;
      logBreadcrumb('music:engine:set_bpm', { bpm_profile: key });
      return { ...prev, bpmProfile: key };
    });
  }, []);

  const setCrossfade = useCallback((ms: number) => {
    const sanitized = Number.isFinite(ms) ? Math.max(0, Math.round(ms)) : state.crossfadeMs;
    setState((prev) => {
      if (prev.crossfadeMs === sanitized) return prev;
      logBreadcrumb('music:engine:set_crossfade', { crossfade_ms: sanitized });
      return { ...prev, crossfadeMs: sanitized };
    });
  }, [state.crossfadeMs]);

  const playRecommended = useCallback(async (seed?: string) => {
    const next = queueRef.current.shift();
    if (!next) {
      logBreadcrumb('music:engine:play_recommended:idle', seed ? { seed } : undefined);
      return;
    }

    logBreadcrumb('music:engine:play_recommended:start', { trackId: next.trackId, seed, crossfade_ms: next.crossfadeMs });
    setNowPlaying(next.trackId);

    // Simulate a gentle ramp for integration tests – avoid abrupt transitions.
    await wait(Math.min(400, next.crossfadeMs));

    logBreadcrumb('music:engine:play_recommended:ready', { trackId: next.trackId });
  }, []);

  const value = useMemo(() => ({
    queue,
    setTexture,
    setIntensity,
    setBpmProfile,
    setCrossfade,
    playRecommended,
    state,
    nowPlaying,
  }), [queue, setTexture, setIntensity, setBpmProfile, setCrossfade, playRecommended, state, nowPlaying]);

  return value;
}

export type UseMusicEngine = ReturnType<typeof useMusicEngine>;
