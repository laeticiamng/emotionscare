/**
 * useWebAudioContext - Hook pour Web Audio API avec Equalizer et Analyser
 * Fournit un contexte audio partagé pour visualisation et égalisation réelles
 */

import { useRef, useCallback, useEffect, useState } from 'react';

const EQUALIZER_FREQUENCIES = [60, 250, 1000, 4000, 16000];

export interface UseWebAudioContextReturn {
  connectAudioElement: (audio: HTMLAudioElement) => void;
  disconnectAudioElement: () => void;
  getAnalyserData: () => Uint8Array;
  setEqualizerBand: (index: number, gain: number) => void;
  getEqualizerValues: () => number[];
  isConnected: boolean;
}

export function useWebAudioContext(): UseWebAudioContextReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const equalizerFiltersRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context on first use
  const initContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      // Create analyser
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create gain node
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1;
      gainNodeRef.current = gainNode;

      // Create equalizer filters
      const filters: BiquadFilterNode[] = EQUALIZER_FREQUENCIES.map((freq, index) => {
        const filter = ctx.createBiquadFilter();
        filter.type = index === 0 ? 'lowshelf' : index === 4 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1;
        return filter;
      });
      equalizerFiltersRef.current = filters;

      return ctx;
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return null;
    }
  }, []);

  const connectAudioElement = useCallback((audio: HTMLAudioElement) => {
    // Prevent double connection
    if (connectedElementRef.current === audio && isConnected) {
      return;
    }

    // Disconnect previous if any
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        // Already disconnected
      }
      sourceRef.current = null;
    }

    const ctx = initContext();
    if (!ctx) return;

    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      // Create source from audio element
      const source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;
      connectedElementRef.current = audio;

      const analyser = analyserRef.current!;
      const gainNode = gainNodeRef.current!;
      const filters = equalizerFiltersRef.current;

      // Connect chain: source -> filters -> gain -> analyser -> destination
      let lastNode: AudioNode = source;

      // Connect through equalizer filters
      filters.forEach(filter => {
        lastNode.connect(filter);
        lastNode = filter;
      });

      // Connect to gain, then analyser, then output
      lastNode.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      setIsConnected(true);
    } catch (error) {
      // Element might already be connected to a context
      console.warn('Audio element connection warning:', error);
      setIsConnected(false);
    }
  }, [initContext, isConnected]);

  const disconnectAudioElement = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        // Already disconnected
      }
      sourceRef.current = null;
    }
    connectedElementRef.current = null;
    setIsConnected(false);
  }, []);

  const getAnalyserData = useCallback((): Uint8Array => {
    const analyser = analyserRef.current;
    if (!analyser) {
      return new Uint8Array(32);
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  const setEqualizerBand = useCallback((index: number, gain: number) => {
    const filters = equalizerFiltersRef.current;
    if (filters[index]) {
      // Clamp gain between -12 and +12 dB
      const clampedGain = Math.max(-12, Math.min(12, gain));
      filters[index].gain.value = clampedGain;
    }
  }, []);

  const getEqualizerValues = useCallback((): number[] => {
    return equalizerFiltersRef.current.map(f => f?.gain?.value || 0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectAudioElement();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [disconnectAudioElement]);

  return {
    connectAudioElement,
    disconnectAudioElement,
    getAnalyserData,
    setEqualizerBand,
    getEqualizerValues,
    isConnected,
  };
}

export default useWebAudioContext;
