// @ts-nocheck
/**
 * Hook Focus Flow - Gestion des sessions de concentration profonde
 * avec progression tempo optimisée et timer Pomodoro
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmotionalMusicAI } from './useEmotionalMusicAI';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export type FocusMode = 'work' | 'study' | 'meditation';
export type FocusPhase = 'warmup' | 'peak' | 'sustain' | 'cooldown';

interface FocusSession {
  id: string;
  mode: FocusMode;
  duration_minutes: number;
  pomodoro_duration: number;
  break_duration: number;
  start_tempo: number;
  peak_tempo: number;
  end_tempo: number;
  tracks_generated: number;
  pomodoros_completed: number;
  started_at: string;
  completed_at?: string;
}

interface FocusTrack {
  id: string;
  session_id: string;
  track_title?: string;
  track_url?: string;
  suno_task_id?: string;
  sequence_order: number;
  target_tempo: number;
  phase: FocusPhase;
  pomodoro_index: number;
  duration_seconds: number;
  emotion?: string;
  generation_status: string;
}

const FOCUS_MODE_CONFIG = {
  work: {
    emotion: 'focused',
    start_tempo: 80,
    peak_tempo: 110,
    end_tempo: 75,
    description: 'Optimisé pour productivité et concentration'
  },
  study: {
    emotion: 'calm',
    start_tempo: 70,
    peak_tempo: 90,
    end_tempo: 65,
    description: 'Favorise mémorisation et apprentissage'
  },
  meditation: {
    emotion: 'healing',
    start_tempo: 60,
    peak_tempo: 70,
    end_tempo: 55,
    description: 'Apaise l\'esprit et réduit le stress'
  }
};

export const useFocusFlow = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [tracks, setTracks] = useState<FocusTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [pomodoroTimeRemaining, setPomodoroTimeRemaining] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pomodoroTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { generateMusic, checkGenerationStatus } = useEmotionalMusicAI();

  // Calculer la progression tempo scientifique
  const calculateTempoProgression = useCallback((
    mode: FocusMode,
    totalPomodoros: number
  ): number[] => {
    const config = FOCUS_MODE_CONFIG[mode];
    const { start_tempo, peak_tempo, end_tempo } = config;
    const tempos: number[] = [];

    for (let i = 0; i < totalPomodoros; i++) {
      const progress = i / (totalPomodoros - 1);
      
      if (progress < 0.2) {
        // Warmup: augmentation progressive
        tempos.push(Math.round(start_tempo + (peak_tempo - start_tempo) * (progress / 0.2)));
      } else if (progress < 0.7) {
        // Peak & Sustain: maintien du tempo optimal
        tempos.push(peak_tempo);
      } else {
        // Cooldown: diminution progressive
        const cooldownProgress = (progress - 0.7) / 0.3;
        tempos.push(Math.round(peak_tempo - (peak_tempo - end_tempo) * cooldownProgress));
      }
    }

    return tempos;
  }, []);

  // Démarrer une nouvelle session Focus Flow
  const startFocusSession = useCallback(async (
    mode: FocusMode,
    durationMinutes: number = 120,
    pomodoroDuration: number = 25
  ) => {
    try {
      setIsGenerating(true);
      const config = FOCUS_MODE_CONFIG[mode];
      const totalPomodoros = Math.ceil(durationMinutes / (pomodoroDuration + 5));
      
      // Créer la session
      const { data: session, error: sessionError } = await supabase
        .from('focus_sessions')
        .insert({
          mode,
          duration_minutes: durationMinutes,
          pomodoro_duration: pomodoroDuration,
          break_duration: 5,
          start_tempo: config.start_tempo,
          peak_tempo: config.peak_tempo,
          end_tempo: config.end_tempo
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setCurrentSession(session);
      setTimeRemaining(durationMinutes * 60);
      setPomodoroTimeRemaining(pomodoroDuration * 60);

      // Calculer la progression tempo
      const tempos = calculateTempoProgression(mode, totalPomodoros);
      
      // Créer les tracks avec progression tempo
      const tracksToCreate: Omit<FocusTrack, 'id' | 'created_at'>[] = [];
      
      for (let i = 0; i < totalPomodoros; i++) {
        const progress = i / (totalPomodoros - 1);
        let phase: FocusPhase;
        
        if (progress < 0.2) phase = 'warmup';
        else if (progress < 0.7) phase = 'peak';
        else if (progress < 0.9) phase = 'sustain';
        else phase = 'cooldown';

        tracksToCreate.push({
          session_id: session.id,
          sequence_order: i,
          target_tempo: tempos[i],
          phase,
          pomodoro_index: i,
          duration_seconds: 240,
          emotion: config.emotion,
          generation_status: 'pending'
        });
      }

      const { data: createdTracks, error: tracksError } = await supabase
        .from('focus_session_tracks')
        .insert(tracksToCreate)
        .select();

      if (tracksError) throw tracksError;

      setTracks(createdTracks);
      
      // Générer le premier track
      await generateNextTrack(session.id, createdTracks[0]);

      toast.success(`Session Focus ${mode} démarrée !`, {
        description: `${totalPomodoros} pomodoros planifiés avec progression tempo optimisée`
      });

      logger.info('Focus session started', { mode, totalPomodoros }, 'FOCUS');

    } catch (error) {
      logger.error('Error starting focus session', error as Error, 'FOCUS');
      toast.error('Erreur lors du démarrage de la session');
    } finally {
      setIsGenerating(false);
    }
  }, [calculateTempoProgression]);

  // Générer le track suivant
  const generateNextTrack = useCallback(async (
    sessionId: string,
    track: FocusTrack
  ) => {
    try {
      const result = await generateMusic({
        emotion: track.emotion || 'calm',
        intensity: 0.6,
        style: 'instrumental-focus',
        tempo: track.target_tempo,
        duration: track.duration_seconds
      });

      if (result?.sunoTaskId) {
        await supabase
          .from('focus_session_tracks')
          .update({
            suno_task_id: result.sunoTaskId,
            generation_status: 'generating'
          })
          .eq('id', track.id);

        // Polling pour vérifier le statut
        const pollInterval = setInterval(async () => {
          const status = await checkGenerationStatus(result.sunoTaskId, track.id);
          
          if (status?.audioUrl) {
            clearInterval(pollInterval);
            
            await supabase
              .from('focus_session_tracks')
              .update({
                track_url: status.audioUrl,
                track_title: status.title || `Focus Track ${track.sequence_order + 1}`,
                generation_status: 'completed'
              })
              .eq('id', track.id);

            // Mettre à jour l'état local
            setTracks(prev => prev.map(t => 
              t.id === track.id 
                ? { ...t, track_url: status.audioUrl, generation_status: 'completed' }
                : t
            ));

            // Incrémenter le compteur
            await supabase
              .from('focus_sessions')
              .update({ tracks_generated: track.sequence_order + 1 })
              .eq('id', sessionId);
          }
        }, 5000);
      }
    } catch (error) {
      logger.error('Error generating focus track', error as Error, 'FOCUS');
    }
  }, [generateMusic, checkGenerationStatus]);

  // Timer principal de session
  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, timeRemaining]);

  // Timer Pomodoro
  useEffect(() => {
    if (isPlaying && !isPaused && !isBreak && pomodoroTimeRemaining > 0) {
      pomodoroTimerRef.current = setInterval(() => {
        setPomodoroTimeRemaining(prev => {
          if (prev <= 1) {
            startBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (pomodoroTimerRef.current) clearInterval(pomodoroTimerRef.current);
    };
  }, [isPlaying, isPaused, isBreak, pomodoroTimeRemaining]);

  // Démarrer une pause
  const startBreak = useCallback(() => {
    setIsBreak(true);
    setPomodoroTimeRemaining(currentSession?.break_duration ? currentSession.break_duration * 60 : 300);
    
    toast.info('Temps de pause !', {
      description: '5 minutes de repos bien mérité 🌟'
    });

    if (currentSession) {
      supabase
        .from('focus_sessions')
        .update({ pomodoros_completed: (currentSession.pomodoros_completed || 0) + 1 })
        .eq('id', currentSession.id);
    }
  }, [currentSession]);

  // Reprendre après la pause
  const resumeFromBreak = useCallback(() => {
    setIsBreak(false);
    setPomodoroTimeRemaining(currentSession?.pomodoro_duration ? currentSession.pomodoro_duration * 60 : 1500);
    
    // Passer au track suivant
    if (currentTrackIndex < tracks.length - 1) {
      const nextTrack = tracks[currentTrackIndex + 1];
      setCurrentTrackIndex(currentTrackIndex + 1);
      
      // Générer le track suivant si pas encore fait
      if (nextTrack.generation_status === 'pending' && currentSession) {
        generateNextTrack(currentSession.id, nextTrack);
      }
    }

    toast.success('Reprise du travail !', {
      description: 'Restez concentré 💪'
    });
  }, [currentSession, currentTrackIndex, tracks, generateNextTrack]);

  // Compléter la session
  const completeSession = useCallback(async () => {
    if (!currentSession) return;

    await supabase
      .from('focus_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', currentSession.id);

    toast.success('Session Focus Flow terminée !', {
      description: `${currentSession.pomodoros_completed} pomodoros complétés 🎉`
    });

    setIsPlaying(false);
    logger.info('Focus session completed', { sessionId: currentSession.id }, 'FOCUS');
  }, [currentSession]);

  // Contrôles de lecture
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  
  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setPomodoroTimeRemaining(0);
  }, []);

  return {
    // État
    currentSession,
    tracks,
    currentTrack: tracks[currentTrackIndex],
    currentTrackIndex,
    isGenerating,
    isPlaying,
    isPaused,
    isBreak,
    timeRemaining,
    pomodoroTimeRemaining,
    
    // Actions
    startFocusSession,
    play,
    pause,
    resume,
    stop,
    resumeFromBreak,
    
    // Config
    FOCUS_MODE_CONFIG
  };
};
