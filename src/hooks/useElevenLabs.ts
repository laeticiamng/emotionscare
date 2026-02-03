/**
 * Hook pour ElevenLabs Text-to-Speech
 * Voix ultra-réalistes pour le coach et les méditations
 */

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  generateSpeech, 
  generateBreathingInstructions,
  generateMeditationGuide,
  selectVoiceForMood,
  type TTSOptions,
  type WellnessVoice,
} from '@/services/elevenlabs';
import { toast } from 'sonner';

interface UseElevenLabsOptions {
  autoPlay?: boolean;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function useElevenLabs(options: UseElevenLabsOptions = {}) {
  const { autoPlay = true, onComplete, onError } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mutation pour générer la parole
  const speechMutation = useMutation({
    mutationFn: async ({ text, ttsOptions }: { text: string; ttsOptions?: TTSOptions }) => {
      return generateSpeech(text, ttsOptions);
    },
    onSuccess: (result) => {
      setCurrentAudioUrl(result.audioUrl);
      if (autoPlay) {
        playAudio(result.audioUrl);
      }
    },
    onError: (error: Error) => {
      toast.error('Erreur de synthèse vocale');
      onError?.(error);
    },
  });

  // Jouer l'audio
  const playAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      onComplete?.();
    };
    audio.onerror = () => {
      setIsPlaying(false);
      toast.error('Erreur de lecture audio');
    };

    audio.play().catch((error) => {
      console.error('Audio play error:', error);
      setIsPlaying(false);
    });
  }, [onComplete]);

  // Mettre en pause
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Reprendre la lecture
  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  // Arrêter
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Générer et lire du texte
  const speak = useCallback((text: string, voice?: WellnessVoice) => {
    speechMutation.mutate({ 
      text, 
      ttsOptions: voice ? { voice } : undefined 
    });
  }, [speechMutation]);

  // Parler avec une voix adaptée à l'humeur
  const speakWithMood = useCallback((
    text: string, 
    mood: 'calm' | 'stressed' | 'anxious' | 'motivated' | 'neutral',
    gender: 'male' | 'female' = 'female'
  ) => {
    const voice = selectVoiceForMood(mood, gender);
    speak(text, voice);
  }, [speak]);

  // Instructions de respiration
  const breathingMutation = useMutation({
    mutationFn: async ({ phase, duration }: { 
      phase: 'inhale' | 'hold' | 'exhale' | 'rest'; 
      duration: number 
    }) => {
      return generateBreathingInstructions(phase, duration);
    },
    onSuccess: (result) => {
      setCurrentAudioUrl(result.audioUrl);
      if (autoPlay) {
        playAudio(result.audioUrl);
      }
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Méditation guidée
  const meditationMutation = useMutation({
    mutationFn: async (script: string) => {
      return generateMeditationGuide(script);
    },
    onSuccess: (result) => {
      setCurrentAudioUrl(result.audioUrl);
      if (autoPlay) {
        playAudio(result.audioUrl);
      }
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    // État
    isPlaying,
    isLoading: speechMutation.isPending || breathingMutation.isPending || meditationMutation.isPending,
    currentAudioUrl,
    
    // Actions
    speak,
    speakWithMood,
    speakBreathingInstruction: (phase: 'inhale' | 'hold' | 'exhale' | 'rest', duration: number) => 
      breathingMutation.mutate({ phase, duration }),
    speakMeditationGuide: (script: string) => meditationMutation.mutate(script),
    
    // Contrôles audio
    play: () => currentAudioUrl && playAudio(currentAudioUrl),
    pause,
    resume,
    stop,
  };
}

export default useElevenLabs;
