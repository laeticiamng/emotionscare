/**
 * State machine pour audio-studio
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AudioStudioState, RecordingConfig, AudioTrack } from './types';
import { AudioStudioService } from './audioStudioService';

export function useAudioStudioMachine() {
  const [state, setState] = useState<AudioStudioState>({
    recordingStatus: 'idle',
    playbackStatus: 'idle',
    tracks: [],
    currentTrack: null,
    elapsedTime: 0,
    error: null
  });

  const serviceRef = useRef<AudioStudioService>(new AudioStudioService());
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async (config: RecordingConfig) => {
    try {
      setState(prev => ({ ...prev, recordingStatus: 'recording', error: null, elapsedTime: 0 }));
      await serviceRef.current.startRecording(config);
      
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - startTimeRef.current) / 1000)
        }));
      }, 1000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        recordingStatus: 'idle',
        error: error instanceof Error ? error.message : 'Recording failed'
      }));
    }
  }, []);

  const pauseRecording = useCallback(() => {
    serviceRef.current.pauseRecording();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({ ...prev, recordingStatus: 'paused' }));
  }, []);

  const resumeRecording = useCallback(() => {
    serviceRef.current.resumeRecording();
    startTimeRef.current = Date.now() - (state.elapsedTime * 1000);
    intervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTimeRef.current) / 1000)
      }));
    }, 1000);
    setState(prev => ({ ...prev, recordingStatus: 'recording' }));
  }, [state.elapsedTime]);

  const stopRecording = useCallback(async (trackName: string = 'New Recording') => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const blob = await serviceRef.current.stopRecording();
      const duration = await AudioStudioService.calculateDuration(blob);

      const newTrack: AudioTrack = {
        id: crypto.randomUUID(),
        name: trackName,
        blob,
        duration,
        volume: 1.0,
        createdAt: new Date()
      };

      setState(prev => ({
        ...prev,
        recordingStatus: 'stopped',
        tracks: [...prev.tracks, newTrack],
        currentTrack: newTrack,
        elapsedTime: 0
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        recordingStatus: 'idle',
        error: error instanceof Error ? error.message : 'Failed to stop recording'
      }));
    }
  }, []);

  const deleteTrack = useCallback((trackId: string) => {
    setState(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t.id !== trackId),
      currentTrack: prev.currentTrack?.id === trackId ? null : prev.currentTrack
    }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState({
      recordingStatus: 'idle',
      playbackStatus: 'idle',
      tracks: [],
      currentTrack: null,
      elapsedTime: 0,
      error: null
    });
  }, []);

  return {
    state,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteTrack,
    reset
  };
}
