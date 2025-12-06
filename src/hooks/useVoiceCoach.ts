// @ts-nocheck
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

type CoachingPhase = 'idle' | 'session_start' | 'pomodoro_active' | 'break_time' | 'session_end';

interface VoiceCoachConfig {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  language?: string;
}

const COACHING_MESSAGES = {
  session_start: [
    "Bienvenue dans votre session Focus Flow. Concentrons-nous sur vos objectifs.",
    "Prêt à exceller ? Commençons cette session avec détermination.",
    "Respirez profondément. Votre session Focus Flow démarre maintenant."
  ],
  pomodoro_encouragement: [
    "Excellent travail ! Gardez ce rythme, vous êtes dans la zone.",
    "Votre concentration est impressionnante. Continuez comme ça.",
    "La moitié est faite ! Maintenez cet effort, vous assurez."
  ],
  break_reflection: [
    "Pause bien méritée. Comment vous sentez-vous après cette session ?",
    "Prenez un moment pour réfléchir : qu'avez-vous accompli ?",
    "Respirez, hydratez-vous. Qu'est-ce qui a bien fonctionné pour vous ?"
  ],
  session_end: [
    "Session terminée ! Analysons ensemble vos performances.",
    "Bravo ! Vous avez complété votre Focus Flow. Voyons vos résultats.",
    "Félicitations pour cette session productive. Voici votre bilan."
  ]
};

export const useVoiceCoach = (config: VoiceCoachConfig = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<CoachingPhase>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voice = config.voice || 'nova';

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!text || isSpeaking) return;

    try {
      setIsSpeaking(true);
      logger.info('Voice coach speaking', { text }, 'COACH');

      const { data, error } = await supabase.functions.invoke('openai-tts', {
        body: { text, voice }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Create and play new audio
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
          logger.error('Audio playback error', new Error('Failed to play audio'), 'COACH');
        };

        await audio.play();
      }
    } catch (error) {
      logger.error('Voice coach error', error as Error, 'COACH');
      toast.error('Erreur du coach vocal');
      setIsSpeaking(false);
    }
  }, [isSpeaking, voice]);

  const getRandomMessage = useCallback((messageType: keyof typeof COACHING_MESSAGES): string => {
    const messages = COACHING_MESSAGES[messageType];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const startSession = useCallback(async () => {
    setCurrentPhase('session_start');
    await speak(getRandomMessage('session_start'));
  }, [speak, getRandomMessage]);

  const encourageDuringPomodoro = useCallback(async () => {
    setCurrentPhase('pomodoro_active');
    await speak(getRandomMessage('pomodoro_encouragement'));
  }, [speak, getRandomMessage]);

  const startBreakReflection = useCallback(async () => {
    setCurrentPhase('break_time');
    await speak(getRandomMessage('break_reflection'));
  }, [speak, getRandomMessage]);

  const endSession = useCallback(async (summary?: string) => {
    setCurrentPhase('session_end');
    const message = summary || getRandomMessage('session_end');
    await speak(message);
  }, [speak, getRandomMessage]);

  const generatePerformanceSummary = useCallback(async (stats: {
    duration: number;
    focusScore: number;
    tasksCompleted: number;
  }): Promise<void> => {
    const summaryText = `Votre session de ${Math.round(stats.duration / 60)} minutes est terminée. 
    Score de concentration : ${stats.focusScore} sur 100. 
    Tâches complétées : ${stats.tasksCompleted}. 
    ${stats.focusScore >= 80 ? 'Performance exceptionnelle !' : stats.focusScore >= 60 ? 'Bon travail, continuez comme ça.' : 'Essayez de minimiser les distractions la prochaine fois.'}`;
    
    await speak(summaryText);
  }, [speak]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentPhase('idle');
  }, []);

  return {
    isSpeaking,
    currentPhase,
    speak,
    startSession,
    encourageDuringPomodoro,
    startBreakReflection,
    endSession,
    generatePerformanceSummary,
    stop
  };
};
