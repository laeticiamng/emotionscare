// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ParcoursRun, ParcoursSegment, ParcoursPlayerState } from '@/types/music/parcours';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export function useParcoursPlayer(run: ParcoursRun | null, segments: ParcoursSegment[]) {
  const [playerState, setPlayerState] = useState<ParcoursPlayerState>({
    isPlaying: false,
    currentSegmentIndex: 0,
    currentTime: 0,
    totalDuration: 0,
    volume: 0.8,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSegmentRef = useRef<ParcoursSegment | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleSegmentEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleSegmentEnded);
      }
    };
  }, []);

  useEffect(() => {
    if (segments.length > 0) {
      const total = segments.reduce((sum, seg) => sum + (seg.end_seconds - seg.start_seconds), 0);
      setPlayerState(prev => ({ ...prev, totalDuration: total }));
    }
  }, [segments]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: prev.currentTime + audioRef.current!.currentTime,
      }));
    }
  }, []);

  const handleSegmentEnded = useCallback(() => {
    const nextIndex = playerState.currentSegmentIndex + 1;
    if (nextIndex < segments.length) {
      loadSegment(nextIndex);
    } else {
      // Parcours completed
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [playerState.currentSegmentIndex, segments]);

  const loadSegment = useCallback(async (index: number) => {
    const segment = segments[index];
    if (!segment || !audioRef.current) return;

    currentSegmentRef.current = segment;
    
    let url: string | null = null;
    
    // Priorité 1 : storage_path → signer via edge function
    if (segment.storage_path) {
      try {
        const response = await supabase.functions.invoke('sign-track', {
          body: { segmentId: segment.id }
        });
        
        if (response.data?.url) {
          url = response.data.url;
        }
      } catch (error) {
        logger.error('Failed to sign storage URL', error as Error, 'MUSIC');
      }
    }
    
    // Fallback 2 : final_url (deprecated: peut expirer)
    if (!url && segment.final_url) {
      url = segment.final_url;
    }
    
    // Fallback 3 : preview_url (stream)
    if (!url && segment.preview_url) {
      url = segment.preview_url;
    }
    
    if (!url) {
      logger.warn('No audio URL for segment', { index }, 'MUSIC');
      return;
    }

    // Smooth crossfade pour éviter les pops
    await smoothReplace(audioRef.current, url, playerState.volume);

    setPlayerState(prev => ({
      ...prev,
      currentSegmentIndex: index,
    }));
  }, [segments, playerState.volume, playerState.isPlaying]);

  // Helper pour smooth crossfade
  const smoothReplace = async (audio: HTMLAudioElement, newUrl: string, targetVolume: number) => {
    const oldGain = audio.volume;
    const step = oldGain / 10;
    
    // Fade out
    for (let i = 0; i < 10; i++) {
      audio.volume = Math.max(0, audio.volume - step);
      await new Promise(r => setTimeout(r, 15));
    }
    
    // Replace source
    audio.src = newUrl;
    
    // Play and fade in
    if (playerState.isPlaying) {
      await audio.play().catch(err => logger.error('Play error', err as Error, 'MUSIC'));
    }
    
    for (let i = 0; i < 10; i++) {
      audio.volume = Math.min(targetVolume, audio.volume + step);
      await new Promise(r => setTimeout(r, 15));
    }
  };

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    if (currentSegmentRef.current === null && segments.length > 0) {
      loadSegment(0);
    }
    
    audioRef.current.play().catch(err => {
      logger.error('Play error', err as Error, 'MUSIC');
    });
    
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
  }, [segments, loadSegment]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    currentSegmentRef.current = null;
    
    setPlayerState({
      isPlaying: false,
      currentSegmentIndex: 0,
      currentTime: 0,
      totalDuration: playerState.totalDuration,
      volume: playerState.volume,
    });
  }, [playerState.totalDuration, playerState.volume]);

  const skipToSegment = useCallback((index: number) => {
    if (index >= 0 && index < segments.length) {
      loadSegment(index);
    }
  }, [segments, loadSegment]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const getCurrentSegment = useCallback(() => {
    return segments[playerState.currentSegmentIndex] || null;
  }, [segments, playerState.currentSegmentIndex]);

  return {
    playerState,
    play,
    pause,
    stop,
    skipToSegment,
    setVolume,
    getCurrentSegment,
  };
}
