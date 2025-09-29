import { useState, useEffect, useRef, useCallback } from 'react';
import { useVRBreathStore } from '@/store/vrbreath.store';

const AMBIENT_TRACKS = [
  '/sounds/ambient-calm.mp3',
  '/sounds/nature-calm.mp3',
  '/sounds/focus-ambient.mp3'
];

export const useAmbientAudio = () => {
  const { audioEnabled, setAudioEnabled } = useVRBreathStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const nextSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Initialize Web Audio API
  useEffect(() => {
    if (!audioEnabled) return;

    const initAudio = async () => {
      try {
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        // Start muted for smooth fade-in
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (nextSourceRef.current) {
        nextSourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioEnabled]);

  // Load and decode audio buffer
  const loadAudioBuffer = async (url: string): Promise<AudioBuffer | null> => {
    if (!audioContextRef.current) return null;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContextRef.current.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio:', error);
      return null;
    }
  };

  // Play audio with crossfade
  const playTrack = useCallback(async (trackIndex: number) => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    const audioBuffer = await loadAudioBuffer(AMBIENT_TRACKS[trackIndex]);
    if (!audioBuffer) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(gainNodeRef.current);

    // Crossfade if there's a current track playing
    if (sourceNodeRef.current && isPlaying) {
      // Fade out current track
      gainNodeRef.current.gain.linearRampToValueAtTime(
        0, 
        audioContextRef.current.currentTime + 0.3
      );

      // Stop current track after fade out
      setTimeout(() => {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
        }
      }, 300);
    }

    sourceNodeRef.current = source;
    source.start(0);
    setIsPlaying(true);

    // Fade in new track
    gainNodeRef.current.gain.linearRampToValueAtTime(
      0.3, // Lower volume for ambient background
      audioContextRef.current.currentTime + 0.3
    );

    // Auto-advance to next track when current ends (shouldn't happen due to loop)
    source.onended = () => {
      const nextTrack = (trackIndex + 1) % AMBIENT_TRACKS.length;
      setCurrentTrack(nextTrack);
      playTrack(nextTrack);
    };
  }, [audioEnabled, isPlaying]);

  // Start ambient audio
  const start = useCallback(() => {
    if (audioEnabled && !isPlaying) {
      playTrack(currentTrack);
    }
  }, [audioEnabled, isPlaying, currentTrack, playTrack]);

  // Stop ambient audio
  const stop = useCallback(() => {
    if (sourceNodeRef.current && gainNodeRef.current && audioContextRef.current) {
      // Fade out
      gainNodeRef.current.gain.linearRampToValueAtTime(
        0, 
        audioContextRef.current.currentTime + 0.3
      );
      
      setTimeout(() => {
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
          sourceNodeRef.current = null;
        }
        setIsPlaying(false);
      }, 300);
    }
  }, []);

  // Toggle audio enabled state
  const toggle = useCallback(() => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    
    if (!newState) {
      stop();
    }
  }, [audioEnabled, setAudioEnabled, stop]);

  // Auto-start when enabled
  useEffect(() => {
    if (audioEnabled && !isPlaying) {
      // Small delay to allow audio context to initialize
      const timer = setTimeout(() => {
        start();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!audioEnabled && isPlaying) {
      stop();
    }
  }, [audioEnabled, isPlaying, start, stop]);

  return {
    enabled: audioEnabled,
    isPlaying,
    currentTrack,
    start,
    stop,
    toggle,
    setTrack: (index: number) => {
      setCurrentTrack(index);
      if (isPlaying) {
        playTrack(index);
      }
    },
  };
};