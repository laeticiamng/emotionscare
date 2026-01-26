/**
 * Hook Focus Flow - Gestion des sessions de concentration profonde
 * avec progression tempo optimisée, timer Pomodoro et persistence DB
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  suno_audio_url?: string;
  audio_url?: string;
  sequence_order: number;
  target_tempo: number;
  phase: FocusPhase;
  pomodoro_index: number;
  duration_seconds: number;
  emotion?: string;
  generation_status: string;
}

export const FOCUS_MODE_CONFIG = {
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
  const { user } = useAuth();
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

  useEmotionalMusicAI();

  useEffect(() => {
    if (user) loadActiveSession();
  }, [user]);

  const loadActiveSession = async () => {
    if (!user) return;
    try {
      const { data: session } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!session) return;

      const { data: sessionTracks } = await supabase
        .from('focus_session_tracks')
        .select('*')
        .eq('session_id', session.id)
        .order('sequence_order', { ascending: true });

      setCurrentSession(session as FocusSession);
      setTracks((sessionTracks || []) as FocusTrack[]);
      
      const elapsed = Date.now() - new Date(session.started_at).getTime();
      const remaining = Math.max(0, session.duration_minutes * 60 - Math.floor(elapsed / 1000));
      setTimeRemaining(remaining);
      setPomodoroTimeRemaining(session.pomodoro_duration * 60);
    } catch (error) {
      logger.error('Error loading active session', error as Error, 'FOCUS');
    }
  };

  const calculateTempoProgression = useCallback((mode: FocusMode, totalPomodoros: number): number[] => {
    const config = FOCUS_MODE_CONFIG[mode];
    const { start_tempo, peak_tempo, end_tempo } = config;
    const tempos: number[] = [];

    for (let i = 0; i < totalPomodoros; i++) {
      const progress = i / (totalPomodoros - 1 || 1);
      if (progress < 0.2) tempos.push(Math.round(start_tempo + (peak_tempo - start_tempo) * (progress / 0.2)));
      else if (progress < 0.7) tempos.push(peak_tempo);
      else tempos.push(Math.round(peak_tempo - (peak_tempo - end_tempo) * ((progress - 0.7) / 0.3)));
    }
    return tempos;
  }, []);

  const startFocusSession = useCallback(async (mode: FocusMode, durationMinutes = 120, pomodoroDuration = 25) => {
    if (!user) { toast.error('Vous devez être connecté'); return; }

    try {
      setIsGenerating(true);
      const config = FOCUS_MODE_CONFIG[mode];
      const totalPomodoros = Math.ceil(durationMinutes / (pomodoroDuration + 5));

      const { data: session, error } = await supabase
        .from('focus_sessions')
        .insert({ user_id: user.id, mode, duration_minutes: durationMinutes, pomodoro_duration: pomodoroDuration, break_duration: 5, start_tempo: config.start_tempo, peak_tempo: config.peak_tempo, end_tempo: config.end_tempo, started_at: new Date().toISOString() })
        .select().single();

      if (error) throw error;

      setCurrentSession(session as FocusSession);
      setTimeRemaining(durationMinutes * 60);
      setPomodoroTimeRemaining(pomodoroDuration * 60);

      const tempos = calculateTempoProgression(mode, totalPomodoros);
      const tracksToCreate = tempos.map((tempo, i) => ({
        session_id: session.id, sequence_order: i, target_tempo: tempo,
        phase: i / (totalPomodoros - 1 || 1) < 0.2 ? 'warmup' : i / (totalPomodoros - 1 || 1) < 0.7 ? 'peak' : i / (totalPomodoros - 1 || 1) < 0.9 ? 'sustain' : 'cooldown',
        pomodoro_index: i, duration_seconds: 240, emotion: config.emotion, generation_status: 'pending'
      }));

      const { data: createdTracks } = await supabase.from('focus_session_tracks').insert(tracksToCreate).select();
      setTracks(createdTracks as FocusTrack[]);

      toast.success(`Session Focus ${mode} démarrée !`);
    } catch (error) {
      logger.error('Error starting focus session', error as Error, 'FOCUS');
      toast.error('Erreur lors du démarrage');
    } finally {
      setIsGenerating(false);
    }
  }, [user, calculateTempoProgression]);

  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => setTimeRemaining(prev => prev <= 1 ? (completeSession(), 0) : prev - 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, isPaused, timeRemaining]);

  useEffect(() => {
    if (isPlaying && !isPaused && !isBreak && pomodoroTimeRemaining > 0) {
      pomodoroTimerRef.current = setInterval(() => setPomodoroTimeRemaining(prev => prev <= 1 ? (startBreak(), 0) : prev - 1), 1000);
    }
    return () => { if (pomodoroTimerRef.current) clearInterval(pomodoroTimerRef.current); };
  }, [isPlaying, isPaused, isBreak, pomodoroTimeRemaining]);

  const startBreak = useCallback(async () => {
    setIsBreak(true);
    setPomodoroTimeRemaining(currentSession?.break_duration ? currentSession.break_duration * 60 : 300);
    toast.info('Temps de pause !');
    if (currentSession) {
      await supabase.from('focus_sessions').update({ pomodoros_completed: (currentSession.pomodoros_completed || 0) + 1 }).eq('id', currentSession.id);
      setCurrentSession(prev => prev ? { ...prev, pomodoros_completed: (prev.pomodoros_completed || 0) + 1 } : null);
    }
  }, [currentSession]);

  const resumeFromBreak = useCallback(() => {
    setIsBreak(false);
    setPomodoroTimeRemaining(currentSession?.pomodoro_duration ? currentSession.pomodoro_duration * 60 : 1500);
    if (currentTrackIndex < tracks.length - 1) setCurrentTrackIndex(currentTrackIndex + 1);
    toast.success('Reprise du travail !');
  }, [currentSession, currentTrackIndex, tracks]);

  const completeSession = useCallback(async () => {
    if (!currentSession) return;
    await supabase.from('focus_sessions').update({ completed_at: new Date().toISOString() }).eq('id', currentSession.id);
    toast.success('Session Focus Flow terminée !');
    setIsPlaying(false);
  }, [currentSession]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const stop = useCallback(async () => {
    setIsPlaying(false); setIsPaused(false); setTimeRemaining(0); setPomodoroTimeRemaining(0);
    if (currentSession) await supabase.from('focus_sessions').update({ completed_at: new Date().toISOString() }).eq('id', currentSession.id);
  }, [currentSession]);

  return {
    currentSession, tracks, currentTrack: tracks[currentTrackIndex], currentTrackIndex,
    isGenerating, isPlaying, isPaused, isBreak, timeRemaining, pomodoroTimeRemaining,
    startFocusSession, play, pause, resume, stop, resumeFromBreak, FOCUS_MODE_CONFIG
  };
};
