/**
 * useMeditationEnriched - Hook enrichi pour la méditation avec audio et guidance
 * Ajoute des sons ambiants, guidance vocale et persistance Supabase
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { useHaptics } from './useHaptics';

export type MeditationPhase = 'idle' | 'preparing' | 'inhale' | 'hold' | 'exhale' | 'pause' | 'complete';
export type AmbientSound = 'none' | 'rain' | 'forest' | 'ocean' | 'fire' | 'wind' | 'birds' | 'tibetan-bowl';

export interface MeditationProgram {
  id: string;
  title: string;
  description: string;
  duration: number[];
  icon: string;
  color: string;
  breathPattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
  guidanceType: 'silent' | 'breathing' | 'body-scan' | 'visualization';
}

export interface MeditationSession {
  id: string;
  user_id: string;
  program_id: string;
  duration_seconds: number;
  completed: boolean;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  started_at: string;
  completed_at?: string;
  breath_cycles?: number;
  ambient_sound?: AmbientSound;
}

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  longestSession: number;
  lastSession: string | null;
  currentStreak: number;
  averageMoodImprovement: number;
  favoriteProgram?: string;
  weeklyMinutes: number;
}

const STORAGE_KEY = 'meditation_stats';
const SESSIONS_KEY = 'meditation_sessions';

// Sons ambiants (URLs de fichiers audio)
const AMBIENT_SOUNDS: Record<AmbientSound, string | null> = {
  none: null,
  rain: 'https://cdn.freesound.org/previews/531/531947_6766445-lq.mp3',
  forest: 'https://cdn.freesound.org/previews/527/527602_11106818-lq.mp3',
  ocean: 'https://cdn.freesound.org/previews/462/462096_3602984-lq.mp3',
  fire: 'https://cdn.freesound.org/previews/370/370012_4397472-lq.mp3',
  wind: 'https://cdn.freesound.org/previews/613/613602_7556030-lq.mp3',
  birds: 'https://cdn.freesound.org/previews/526/526424_5919389-lq.mp3',
  'tibetan-bowl': 'https://cdn.freesound.org/previews/411/411474_6311908-lq.mp3',
};

// Messages de guidance
const GUIDANCE_MESSAGES: Record<MeditationPhase, string> = {
  idle: 'Prêt à commencer votre session de méditation',
  preparing: 'Installez-vous confortablement, fermez les yeux...',
  inhale: 'Inspirez lentement par le nez...',
  hold: 'Retenez votre souffle...',
  exhale: 'Expirez doucement par la bouche...',
  pause: 'Pause naturelle...',
  complete: 'Session terminée. Prenez un moment pour revenir à vous.',
};

export const useMeditationEnriched = () => {
  const { user } = useAuth();
  const haptics = useHaptics();

  // État de la session
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [phase, setPhase] = useState<MeditationPhase>('idle');
  const [breathCycle, setBreathCycle] = useState(0);
  
  // Configuration
  const [selectedProgram, setSelectedProgram] = useState<MeditationProgram | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [enableGuidance, setEnableGuidance] = useState(true);
  
  // Humeur
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  
  // Stats et historique
  const [stats, setStats] = useState<MeditationStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      totalMinutes: 0,
      longestSession: 0,
      lastSession: null,
      currentStreak: 0,
      averageMoodImprovement: 0,
      weeklyMinutes: 0,
    };
  });
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs pour les timers et audio
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionStartRef = useRef<string | null>(null);

  // Programmes de méditation
  const programs: MeditationProgram[] = [
    {
      id: 'calm',
      title: 'Méditation Calme',
      description: 'Apaiser votre esprit et réduire le stress',
      duration: [5, 10, 15, 20],
      icon: '🧘',
      color: 'bg-blue-500/10 text-blue-600',
      breathPattern: { inhale: 4, hold: 4, exhale: 4, pause: 2 },
      guidanceType: 'breathing',
    },
    {
      id: 'focus',
      title: 'Concentration',
      description: 'Améliorer votre focus et clarté mentale',
      duration: [5, 10, 15],
      icon: '🎯',
      color: 'bg-purple-500/10 text-purple-600',
      breathPattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
      guidanceType: 'breathing',
    },
    {
      id: 'sleep',
      title: 'Sommeil Profond',
      description: 'Préparer votre corps et esprit au repos',
      duration: [10, 15, 20, 30],
      icon: '🌙',
      color: 'bg-indigo-500/10 text-indigo-600',
      breathPattern: { inhale: 4, hold: 2, exhale: 6, pause: 2 },
      guidanceType: 'body-scan',
    },
    {
      id: 'energy',
      title: 'Boost Énergie',
      description: 'Revitaliser votre corps et votre esprit',
      duration: [5, 10],
      icon: '⚡',
      color: 'bg-amber-500/10 text-amber-600',
      breathPattern: { inhale: 2, hold: 0, exhale: 2, pause: 0 },
      guidanceType: 'breathing',
    },
    {
      id: 'gratitude',
      title: 'Gratitude',
      description: 'Cultiver la reconnaissance et la positivité',
      duration: [5, 10, 15],
      icon: '🙏',
      color: 'bg-rose-500/10 text-rose-600',
      guidanceType: 'visualization',
    },
  ];

  // Charger les sessions depuis Supabase
  const loadSessions = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setSessions(data as MeditationSession[]);
        
        // Recalculer les stats
        const newStats = calculateStats(data as MeditationSession[]);
        setStats(newStats);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      }
    } catch (err) {
      logger.error('Failed to load meditation sessions', err as Error, 'MEDITATION');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Calculer les statistiques
  const calculateStats = (sessionList: MeditationSession[]): MeditationStats => {
    const completed = sessionList.filter(s => s.completed);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyMinutes = completed
      .filter(s => new Date(s.started_at) >= weekAgo)
      .reduce((sum, s) => sum + Math.floor(s.duration_seconds / 60), 0);

    const programCounts: Record<string, number> = {};
    for (const s of completed) {
      programCounts[s.program_id] = (programCounts[s.program_id] || 0) + 1;
    }
    const favoriteProgram = Object.entries(programCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    const moodImprovements = completed
      .filter(s => s.mood_before && s.mood_after)
      .map(s => (s.mood_after! - s.mood_before!));
    const avgMoodImprovement = moodImprovements.length > 0
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length
      : 0;

    // Calculer la série actuelle
    let streak = 0;
    const sortedSessions = [...completed].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.started_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return {
      totalSessions: completed.length,
      totalMinutes: completed.reduce((sum, s) => sum + Math.floor(s.duration_seconds / 60), 0),
      longestSession: Math.max(...completed.map(s => Math.floor(s.duration_seconds / 60)), 0),
      lastSession: completed[0]?.started_at || null,
      currentStreak: streak,
      averageMoodImprovement: avgMoodImprovement,
      favoriteProgram,
      weeklyMinutes,
    };
  };

  // Gérer l'audio ambiant
  useEffect(() => {
    if (ambientSound !== 'none' && isPlaying && !isPaused) {
      const soundUrl = AMBIENT_SOUNDS[ambientSound];
      if (soundUrl) {
        audioRef.current = new Audio(soundUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = ambientVolume;
        audioRef.current.play().catch(() => {
          logger.warn('Failed to play ambient sound', undefined, 'MEDITATION');
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [ambientSound, isPlaying, isPaused, ambientVolume]);

  // Timer principal
  useEffect(() => {
    if (isPlaying && !isPaused && currentTime < selectedDuration * 60) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= selectedDuration * 60) {
            completeSession();
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, selectedDuration, currentTime]);

  // Timer de respiration
  useEffect(() => {
    if (!isPlaying || isPaused || !selectedProgram?.breathPattern) {
      setPhase('idle');
      return;
    }

    const pattern = selectedProgram.breathPattern;
    const cycleTime = pattern.inhale + pattern.hold + pattern.exhale + pattern.pause;
    
    const runBreathCycle = () => {
      let elapsed = 0;

      const tick = () => {
        if (!isPlaying || isPaused) return;

        if (elapsed < pattern.inhale) {
          setPhase('inhale');
          if (enableHaptics && elapsed === 0) haptics.breathing();
        } else if (elapsed < pattern.inhale + pattern.hold) {
          setPhase('hold');
        } else if (elapsed < pattern.inhale + pattern.hold + pattern.exhale) {
          setPhase('exhale');
        } else if (elapsed < cycleTime) {
          setPhase('pause');
        }

        elapsed++;

        if (elapsed >= cycleTime) {
          setBreathCycle(prev => prev + 1);
          elapsed = 0;
        }

        breathTimerRef.current = setTimeout(tick, 1000);
      };

      tick();
    };

    setPhase('preparing');
    setTimeout(runBreathCycle, 3000);

    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, [isPlaying, isPaused, selectedProgram, enableHaptics]);

  // Actions
  const startSession = useCallback(() => {
    if (!selectedProgram) return;

    sessionStartRef.current = new Date().toISOString();
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentTime(0);
    setBreathCycle(0);
    setPhase('preparing');
    
    if (enableHaptics) haptics.tap();
    
    logger.info('Meditation session started', { 
      program: selectedProgram.id, 
      duration: selectedDuration 
    }, 'MEDITATION');
  }, [selectedProgram, selectedDuration, enableHaptics, haptics]);

  const pauseSession = useCallback(() => {
    setIsPaused(true);
    if (audioRef.current) audioRef.current.pause();
    if (enableHaptics) haptics.tap();
  }, [enableHaptics, haptics]);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
    if (audioRef.current) audioRef.current.play();
    if (enableHaptics) haptics.tap();
  }, [enableHaptics, haptics]);

  const resetSession = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setBreathCycle(0);
    setPhase('idle');
    setMoodAfter(null);
    sessionStartRef.current = null;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const completeSession = useCallback(async () => {
    setIsPlaying(false);
    setPhase('complete');
    
    if (enableHaptics) haptics.success();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Créer la session
    const session: MeditationSession = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'anonymous',
      program_id: selectedProgram?.id || 'unknown',
      duration_seconds: currentTime,
      completed: true,
      mood_before: moodBefore || undefined,
      mood_after: moodAfter || undefined,
      started_at: sessionStartRef.current || new Date().toISOString(),
      completed_at: new Date().toISOString(),
      breath_cycles: breathCycle,
      ambient_sound: ambientSound !== 'none' ? ambientSound : undefined,
    };

    // Mettre à jour localement
    setSessions(prev => [session, ...prev]);
    const newStats = calculateStats([session, ...sessions]);
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));

    // Persister dans Supabase
    if (user?.id) {
      try {
        await supabase.from('meditation_sessions').insert(session);
      } catch (err) {
        logger.error('Failed to save meditation session', err as Error, 'MEDITATION');
      }
    }

    logger.info('Meditation session completed', {
      duration: currentTime,
      breathCycles: breathCycle,
    }, 'MEDITATION');
  }, [user?.id, selectedProgram, currentTime, moodBefore, moodAfter, breathCycle, ambientSound, sessions, enableHaptics, haptics]);

  // Calculer la progression
  const progress = (currentTime / (selectedDuration * 60)) * 100;
  const guidanceMessage = GUIDANCE_MESSAGES[phase];

  return {
    // État
    isPlaying,
    isPaused,
    currentTime,
    phase,
    breathCycle,
    progress,
    guidanceMessage,
    loading,
    
    // Configuration
    programs,
    selectedProgram,
    selectedDuration,
    ambientSound,
    ambientVolume,
    enableHaptics,
    enableGuidance,
    moodBefore,
    moodAfter,
    
    // Stats
    stats,
    sessions,
    
    // Setters
    setSelectedProgram,
    setSelectedDuration,
    setAmbientSound,
    setAmbientVolume,
    setEnableHaptics,
    setEnableGuidance,
    setMoodBefore,
    setMoodAfter,
    
    // Actions
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    completeSession,
    refreshSessions: loadSessions,
  };
};

export default useMeditationEnriched;
