// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ParcoursRun, ParcoursSegment, ParcoursPlayerState } from '@/types/music/parcours';

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

  const loadSegment = useCallback((index: number) => {
    const segment = segments[index];
    if (!segment || !audioRef.current) return;

    currentSegmentRef.current = segment;
    
    // Use stream_url first for fast feedback, then audio_url for final quality
    const url = segment.audio_url || segment.stream_url;
    if (!url) {
      console.warn('No audio URL for segment', index);
      return;
    }

    audioRef.current.src = url;
    audioRef.current.volume = playerState.volume;
    
    if (playerState.isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Audio play error:', err);
      });
    }

    setPlayerState(prev => ({
      ...prev,
      currentSegmentIndex: index,
    }));
  }, [segments, playerState.volume, playerState.isPlaying]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    if (currentSegmentRef.current === null && segments.length > 0) {
      loadSegment(0);
    }
    
    audioRef.current.play().catch(err => {
      console.error('Play error:', err);
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
