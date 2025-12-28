/**
 * useAudioEqualizer - Hook pour égaliseur audio réel avec Web Audio API
 * Fournit des filtres biquad pour modifier le son en temps réel
 */

import { useRef, useCallback, useEffect, useState } from 'react';

// Fréquences centrales pour l'égaliseur 5 bandes
const EQ_FREQUENCIES = [60, 250, 1000, 4000, 16000];
const EQ_LABELS = ['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'];

export interface EqualizerBand {
  frequency: number;
  label: string;
  gain: number; // -12 to +12 dB
}

export interface EqualizerPreset {
  name: string;
  gains: number[];
}

export const EQUALIZER_PRESETS: Record<string, EqualizerPreset> = {
  flat: { name: 'Flat', gains: [0, 0, 0, 0, 0] },
  bass: { name: 'Bass Boost', gains: [6, 4, 0, -1, -2] },
  treble: { name: 'Treble Boost', gains: [-2, -1, 0, 4, 6] },
  vocal: { name: 'Vocal', gains: [-2, 2, 4, 2, -1] },
  rock: { name: 'Rock', gains: [4, 2, -1, 3, 5] },
  electronic: { name: 'Electronic', gains: [5, 3, 0, 2, 4] },
  acoustic: { name: 'Acoustic', gains: [3, 1, 2, 3, 2] },
  night: { name: 'Night Mode', gains: [4, 2, 0, -2, -4] },
};

interface UseAudioEqualizerReturn {
  // État
  bands: EqualizerBand[];
  isConnected: boolean;
  analyserData: Uint8Array | null;
  
  // Actions
  connectToAudio: (audioElement: HTMLAudioElement) => void;
  disconnect: () => void;
  setBandGain: (bandIndex: number, gain: number) => void;
  setAllBands: (gains: number[]) => void;
  applyPreset: (presetName: keyof typeof EQUALIZER_PRESETS) => void;
  resetToFlat: () => void;
  
  // Pour visualizer
  getAnalyserNode: () => AnalyserNode | null;
}

export function useAudioEqualizer(): UseAudioEqualizerReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);
  
  const [bands, setBands] = useState<EqualizerBand[]>(
    EQ_FREQUENCIES.map((freq, i) => ({
      frequency: freq,
      label: EQ_LABELS[i],
      gain: 0
    }))
  );
  const [isConnected, setIsConnected] = useState(false);
  const [analyserData, setAnalyserData] = useState<Uint8Array | null>(null);

  // Créer le contexte audio et les filtres
  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Créer l'analyseur pour le visualizer
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Créer le gain node principal
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 1;

      // Créer les filtres pour chaque bande
      filtersRef.current = EQ_FREQUENCIES.map((freq, index) => {
        const filter = audioContextRef.current!.createBiquadFilter();
        
        // Premier = lowshelf, dernier = highshelf, autres = peaking
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.0;
        }
        
        filter.frequency.value = freq;
        filter.gain.value = 0;
        
        return filter;
      });

      // Chaîner les filtres: source -> filters -> analyser -> gain -> destination
      for (let i = 0; i < filtersRef.current.length - 1; i++) {
        filtersRef.current[i].connect(filtersRef.current[i + 1]);
      }
      
      // Dernier filtre -> analyseur -> gain -> destination
      const lastFilter = filtersRef.current[filtersRef.current.length - 1];
      lastFilter.connect(analyserRef.current);
      analyserRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error);
    }
  }, []);

  // Connecter un élément audio
  const connectToAudio = useCallback((audioElement: HTMLAudioElement) => {
    // Ne pas reconnecter le même élément
    if (connectedElementRef.current === audioElement && isConnected) {
      return;
    }

    initializeAudioContext();
    
    if (!audioContextRef.current) {
      console.warn('AudioContext not available');
      return;
    }

    // Déconnecter l'ancien source si existe
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }

    try {
      // Resume context si suspendu (requis par les navigateurs modernes)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Créer le source node depuis l'élément audio
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      
      // Connecter au premier filtre
      sourceNodeRef.current.connect(filtersRef.current[0]);
      
      connectedElementRef.current = audioElement;
      setIsConnected(true);
      
      console.log('Audio equalizer connected successfully');
    } catch (error) {
      // L'élément audio est peut-être déjà connecté à un autre contexte
      console.warn('Could not connect audio element:', error);
      setIsConnected(false);
    }
  }, [initializeAudioContext, isConnected]);

  // Déconnecter
  const disconnect = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore
      }
      sourceNodeRef.current = null;
    }
    connectedElementRef.current = null;
    setIsConnected(false);
  }, []);

  // Modifier le gain d'une bande
  const setBandGain = useCallback((bandIndex: number, gain: number) => {
    if (bandIndex < 0 || bandIndex >= filtersRef.current.length) return;
    
    const clampedGain = Math.max(-12, Math.min(12, gain));
    
    if (filtersRef.current[bandIndex]) {
      filtersRef.current[bandIndex].gain.value = clampedGain;
    }
    
    setBands(prev => prev.map((band, i) => 
      i === bandIndex ? { ...band, gain: clampedGain } : band
    ));
  }, []);

  // Modifier toutes les bandes
  const setAllBands = useCallback((gains: number[]) => {
    gains.forEach((gain, index) => {
      if (index < filtersRef.current.length) {
        const clampedGain = Math.max(-12, Math.min(12, gain));
        filtersRef.current[index].gain.value = clampedGain;
      }
    });
    
    setBands(prev => prev.map((band, i) => ({
      ...band,
      gain: gains[i] !== undefined ? Math.max(-12, Math.min(12, gains[i])) : band.gain
    })));
  }, []);

  // Appliquer un preset
  const applyPreset = useCallback((presetName: keyof typeof EQUALIZER_PRESETS) => {
    const preset = EQUALIZER_PRESETS[presetName];
    if (preset) {
      setAllBands(preset.gains);
    }
  }, [setAllBands]);

  // Reset à plat
  const resetToFlat = useCallback(() => {
    applyPreset('flat');
  }, [applyPreset]);

  // Obtenir l'analyseur pour le visualizer externe
  const getAnalyserNode = useCallback(() => {
    return analyserRef.current;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [disconnect]);

  return {
    bands,
    isConnected,
    analyserData,
    connectToAudio,
    disconnect,
    setBandGain,
    setAllBands,
    applyPreset,
    resetToFlat,
    getAnalyserNode,
  };
}

export default useAudioEqualizer;
