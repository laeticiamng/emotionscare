// @ts-nocheck
/**
 * Hook Web Audio API native - Architecture minimale
 * Remplace les libs audio externes pour lecteur/mix/guidage
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  volume: number;
  loop: boolean;
}

export interface WebAudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export const useWebAudio = () => {
  const [state, setState] = useState<WebAudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Initialiser AudioContext
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Charger un fichier audio
  const loadAudio = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await initAudioContext();
      
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
      
      audioBufferRef.current = audioBuffer;
      
      setState(prev => ({
        ...prev,
        duration: audioBuffer.duration,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur de chargement audio',
        isLoading: false
      }));
    }
  }, [initAudioContext]);

  // Lire l'audio
  const play = useCallback(async () => {
    if (!audioBufferRef.current || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      await initAudioContext();
      
      // Arrêter la source précédente
      if (sourceRef.current) {
        sourceRef.current.stop();
      }

      // Créer nouvelle source
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(gainNodeRef.current);
      
      sourceRef.current = source;
      
      // Démarrer depuis la position de pause ou 0
      const offset = pauseTimeRef.current;
      source.start(0, offset);
      
      startTimeRef.current = audioContextRef.current.currentTime - offset;
      
      setState(prev => ({ ...prev, isPlaying: true }));
      
      // Mettre à jour le temps courant
      const updateTime = () => {
        if (audioContextRef.current && state.isPlaying) {
          const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
          setState(prev => ({ ...prev, currentTime }));
          
          if (currentTime < audioBufferRef.current!.duration) {
            animationFrameRef.current = requestAnimationFrame(updateTime);
          } else {
            setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
            pauseTimeRef.current = 0;
          }
        }
      };
      updateTime();

      // Gérer la fin de lecture
      source.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur de lecture',
        isPlaying: false
      }));
    }
  }, [initAudioContext, state.isPlaying]);

  // Mettre en pause
  const pause = useCallback(() => {
    if (sourceRef.current && audioContextRef.current) {
      sourceRef.current.stop();
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setState(prev => ({ ...prev, isPlaying: false }));
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, []);

  // Arrêter complètement
  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    
    pauseTimeRef.current = 0;
    startTimeRef.current = 0;
    
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Changer le volume
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current!.currentTime);
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  // Aller à une position spécifique
  const seekTo = useCallback((time: number) => {
    if (!audioBufferRef.current) return;
    
    const wasPlaying = state.isPlaying;
    
    if (wasPlaying) {
      pause();
    }
    
    pauseTimeRef.current = Math.max(0, Math.min(time, audioBufferRef.current.duration));
    setState(prev => ({ ...prev, currentTime: pauseTimeRef.current }));
    
    if (wasPlaying) {
      play();
    }
  }, [state.isPlaying, pause, play]);

  // Crossfade entre deux pistes
  const crossfade = useCallback(async (newUrl: string, duration: number = 2) => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const currentGain = gainNodeRef.current;
    const fadeOutDuration = duration / 2;
    
    // Fade out actuel
    currentGain.gain.setValueAtTime(state.volume, audioContextRef.current.currentTime);
    currentGain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + fadeOutDuration);
    
    // Charger nouveau fichier après fade out
    setTimeout(async () => {
      await loadAudio(newUrl);
      await play();
      
      // Fade in nouveau
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(state.volume, audioContextRef.current.currentTime + fadeOutDuration);
      }
    }, fadeOutDuration * 1000);
  }, [state.volume, loadAudio, play]);

  // Jouer une tonalité pure (pour guidage respiratoire)
  const playTone = useCallback(async (
    frequency: number, 
    duration: number = 0.3, 
    volume: number = 0.3
  ) => {
    try {
      await initAudioContext();
      if (!audioContextRef.current) return;
      
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration);
      
      oscillator.connect(envelope);
      envelope.connect(audioContextRef.current.destination);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      // Silencieux en cas d'échec (non bloquant)
    }
  }, [initAudioContext]);

  // Arrêter tous les sons
  const stopAll = useCallback(() => {
    stop();
  }, [stop]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
    };
  }, []);

  return {
    ...state,
    loadAudio,
    play,
    pause,
    stop,
    stopAll,
    setVolume,
    seekTo,
    crossfade,
    playTone,
    isSupported: !!(window.AudioContext || (window as any).webkitAudioContext)
  };
};

// Hook simplifié pour guidage respiratoire
export const useBreathingAudio = () => {
  const { play, stop, setVolume, isSupported } = useWebAudio();
  
  const playBreathingGuide = useCallback(async (
    pattern: 'box' | '4-7-8' | 'coherence',
    duration: number = 300 // secondes
  ) => {
    // URLs des guides respiratoires pré-générés
    const guides = {
      box: '/audio/breathing/box-breathing.mp3',
      '4-7-8': '/audio/breathing/4-7-8-breathing.mp3',
      coherence: '/audio/breathing/coherence-breathing.mp3'
    };
    
    // Charger et jouer le guide approprié
    // Implementation avec Web Audio API pour générer les tons
    // ou fallback vers fichiers pré-enregistrés
    
  }, [play]);
  
  return {
    playBreathingGuide,
    stop,
    setVolume,
    isSupported
  };
};