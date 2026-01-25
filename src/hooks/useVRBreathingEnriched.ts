/**
 * useVRBreathingEnriched - Hook enrichi pour VR Breathing avec WebXR, analytics et audio immersif
 * Combine respiration guidée, feedback haptique, et suivi de performance
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

// Patterns valides selon la contrainte DB: ['box', 'calm', '478', 'energy', 'coherence']
const VALID_DB_PATTERNS = ['box', 'calm', '478', 'energy', 'coherence'] as const;
type ValidDbPattern = typeof VALID_DB_PATTERNS[number];

const mapPatternToDb = (pattern: BreathingPattern): ValidDbPattern => {
  const patternMap: Record<BreathingPattern, ValidDbPattern> = {
    'box': 'box',
    '4-7-8': '478',
    'coherence': 'coherence',
    'wim-hof': 'energy',
    'calm': 'calm',
    'energize': 'energy',
    'sleep': 'calm',
  };
  return patternMap[pattern] || 'box';
};

export type BreathingPattern = 'box' | '4-7-8' | 'coherence' | 'wim-hof' | 'calm' | 'energize' | 'sleep';
export type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
export type SessionStatus = 'idle' | 'preparing' | 'active' | 'paused' | 'completed';

export interface BreathingPatternConfig {
  name: string;
  description: string;
  phases: { phase: BreathingPhase; duration: number }[];
  totalCycleDuration: number;
  recommendedCycles: number;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface BreathingSession {
  id: string;
  pattern: BreathingPattern;
  status: SessionStatus;
  currentPhase: BreathingPhase;
  phaseProgress: number; // 0-100
  currentCycle: number;
  totalCycles: number;
  elapsedTime: number; // seconds
  vrMode: boolean;
  moodBefore: number | null;
  moodAfter: number | null;
  heartRateData: number[];
  coherenceScore: number | null;
}

export interface BreathingStats {
  totalSessions: number;
  totalMinutes: number;
  avgCoherence: number;
  longestStreak: number;
  currentStreak: number;
  favoritePattern: BreathingPattern | null;
  moodImprovement: number; // percentage
}

const PATTERNS: Record<BreathingPattern, BreathingPatternConfig> = {
  'box': {
    name: 'Respiration Carrée',
    description: 'Équilibre parfait pour réduire le stress',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold-in', duration: 4 },
      { phase: 'exhale', duration: 4 },
      { phase: 'hold-out', duration: 4 },
    ],
    totalCycleDuration: 16,
    recommendedCycles: 4,
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Calme le système nerveux'],
    difficulty: 'beginner',
  },
  '4-7-8': {
    name: 'Respiration 4-7-8',
    description: 'Technique du Dr. Weil pour l\'endormissement',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold-in', duration: 7 },
      { phase: 'exhale', duration: 8 },
    ],
    totalCycleDuration: 19,
    recommendedCycles: 4,
    benefits: ['Facilite l\'endormissement', 'Réduit l\'anxiété', 'Favorise le calme'],
    difficulty: 'intermediate',
  },
  'coherence': {
    name: 'Cohérence Cardiaque',
    description: '5 respirations par minute pour synchroniser cœur et cerveau',
    phases: [
      { phase: 'inhale', duration: 5 },
      { phase: 'exhale', duration: 5 },
    ],
    totalCycleDuration: 10,
    recommendedCycles: 30,
    benefits: ['Équilibre le système nerveux', 'Améliore la variabilité cardiaque', 'Réduit la tension'],
    difficulty: 'beginner',
  },
  'wim-hof': {
    name: 'Méthode Wim Hof',
    description: 'Technique énergisante et revigorante',
    phases: [
      { phase: 'inhale', duration: 2 },
      { phase: 'exhale', duration: 2 },
    ],
    totalCycleDuration: 4,
    recommendedCycles: 30,
    benefits: ['Booste l\'énergie', 'Renforce le système immunitaire', 'Améliore la résistance au froid'],
    difficulty: 'advanced',
  },
  'calm': {
    name: 'Respiration Calmante',
    description: 'Expiration longue pour activer le parasympathique',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'exhale', duration: 8 },
    ],
    totalCycleDuration: 12,
    recommendedCycles: 8,
    benefits: ['Calme profond', 'Réduit le rythme cardiaque', 'Apaise le mental'],
    difficulty: 'beginner',
  },
  'energize': {
    name: 'Respiration Dynamisante',
    description: 'Technique Kapalabhati modifiée pour l\'énergie',
    phases: [
      { phase: 'inhale', duration: 1 },
      { phase: 'exhale', duration: 1 },
    ],
    totalCycleDuration: 2,
    recommendedCycles: 30,
    benefits: ['Énergie immédiate', 'Clarté mentale', 'Réveil du corps'],
    difficulty: 'intermediate',
  },
  'sleep': {
    name: 'Respiration du Sommeil',
    description: 'Ralentissement progressif pour le sommeil profond',
    phases: [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold-in', duration: 2 },
      { phase: 'exhale', duration: 6 },
      { phase: 'hold-out', duration: 2 },
    ],
    totalCycleDuration: 14,
    recommendedCycles: 10,
    benefits: ['Préparation au sommeil', 'Détente profonde', 'Libération des tensions'],
    difficulty: 'beginner',
  },
};

const AUDIO_FILES = {
  inhale: '/audio/breathing/inhale.mp3',
  exhale: '/audio/breathing/exhale.mp3',
  hold: '/audio/breathing/hold.mp3',
  complete: '/audio/breathing/complete.mp3',
  ambient: '/audio/breathing/ambient.mp3',
};

export function useVRBreathingEnriched() {
  const { user } = useAuth();
  
  // Session state
  const [session, setSession] = useState<BreathingSession>({
    id: '',
    pattern: 'coherence',
    status: 'idle',
    currentPhase: 'inhale',
    phaseProgress: 0,
    currentCycle: 0,
    totalCycles: 0,
    elapsedTime: 0,
    vrMode: false,
    moodBefore: null,
    moodAfter: null,
    heartRateData: [],
    coherenceScore: null,
  });

  const [stats, setStats] = useState<BreathingStats | null>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Refs for timing
  const intervalRef = useRef<NodeJS.Timeout>();
  const phaseStartRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const _audioContextRef = useRef<AudioContext | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check VR support
  useEffect(() => {
    const checkVR = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr?.isSessionSupported('immersive-vr');
          setIsVRSupported(!!supported);
        } catch {
          setIsVRSupported(false);
        }
      }
    };
    checkVR();
  }, []);

  // Load stats
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const { data, error } = await supabase
          .from('breathing_vr_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        if (data && data.length > 0) {
          const totalSessions = data.length;
          const totalMinutes = data.reduce((sum, s) => sum + ((s.duration_seconds || 0) / 60), 0);
          const coherenceScores = data.filter(s => s.average_pace).map(s => s.average_pace);
          const avgCoherence = coherenceScores.length > 0
            ? coherenceScores.reduce((a, b) => a + b, 0) / coherenceScores.length
            : 0;

          // Calculate streaks
          const dates = data.map(s => new Date(s.created_at).toDateString());
          const uniqueDates = [...new Set(dates)];
          let currentStreak = 0;
          let longestStreak = 0;
          let streak = 0;
          const today = new Date().toDateString();

          for (let i = 0; i < uniqueDates.length; i++) {
            const date = new Date(uniqueDates[i]);
            const prevDate = i > 0 ? new Date(uniqueDates[i - 1]) : null;
            
            if (!prevDate || (date.getTime() - prevDate.getTime()) <= 86400000 * 1.5) {
              streak++;
            } else {
              longestStreak = Math.max(longestStreak, streak);
              streak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, streak);

          if (uniqueDates[0] === today) {
            currentStreak = streak;
          }

          // Favorite pattern
          const patternCounts: Record<string, number> = {};
          data.forEach(s => {
            patternCounts[s.pattern] = (patternCounts[s.pattern] || 0) + 1;
          });
          const favoritePattern = Object.entries(patternCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] as BreathingPattern || null;

          // Mood improvement
          const moodData = data.filter(s => s.mood_before !== null && s.mood_after !== null);
          const moodImprovement = moodData.length > 0
            ? moodData.reduce((sum, s) => sum + ((s.mood_after! - s.mood_before!) / Math.max(1, s.mood_before!)), 0) / moodData.length * 100
            : 0;

          setStats({
            totalSessions,
            totalMinutes: Math.round(totalMinutes),
            avgCoherence: Math.round(avgCoherence * 100) / 100,
            longestStreak,
            currentStreak,
            favoritePattern,
            moodImprovement: Math.round(moodImprovement),
          });
        }
      } catch (err) {
        logger.error('Failed to load breathing stats', err as Error, 'VR_BREATHING');
      }
    };

    loadStats();
  }, [user]);

  // Get pattern config
  const getPatternConfig = useCallback((pattern: BreathingPattern): BreathingPatternConfig => {
    return PATTERNS[pattern];
  }, []);

  // Play audio cue
  const playAudioCue = useCallback((phase: BreathingPhase) => {
    if (!audioEnabled) return;

    try {
      let audioFile = '';
      switch (phase) {
        case 'inhale':
          audioFile = AUDIO_FILES.inhale;
          break;
        case 'exhale':
          audioFile = AUDIO_FILES.exhale;
          break;
        case 'hold-in':
        case 'hold-out':
          audioFile = AUDIO_FILES.hold;
          break;
      }

      const audio = new Audio(audioFile);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {
      // Audio not available
    }
  }, [audioEnabled]);

  // Trigger haptic feedback
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'strong') => {
    if (!hapticEnabled || !navigator.vibrate) return;

    const durations = { light: 50, medium: 100, strong: 200 };
    navigator.vibrate(durations[intensity]);
  }, [hapticEnabled]);

  // Start session
  const startSession = useCallback(async (
    pattern: BreathingPattern,
    options: { vrMode?: boolean; cycles?: number; moodBefore?: number } = {}
  ) => {
    const config = PATTERNS[pattern];
    const sessionId = crypto.randomUUID();

    setSession({
      id: sessionId,
      pattern,
      status: 'preparing',
      currentPhase: 'inhale',
      phaseProgress: 0,
      currentCycle: 0,
      totalCycles: options.cycles || config.recommendedCycles,
      elapsedTime: 0,
      vrMode: options.vrMode || false,
      moodBefore: options.moodBefore || null,
      moodAfter: null,
      heartRateData: [],
      coherenceScore: null,
    });

    // Countdown before start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start ambient audio
    if (audioEnabled) {
      ambientAudioRef.current = new Audio(AUDIO_FILES.ambient);
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.1;
      ambientAudioRef.current.play().catch(() => {});
    }

    sessionStartRef.current = Date.now();
    phaseStartRef.current = Date.now();

    setSession(prev => ({ ...prev, status: 'active' }));
    playAudioCue('inhale');
    triggerHaptic('medium');

    // Start timing loop
    let phaseIndex = 0;

    intervalRef.current = setInterval(() => {
      setSession(prev => {
        if (prev.status !== 'active') return prev;

        const now = Date.now();
        const config = PATTERNS[prev.pattern];
        const currentPhaseConfig = config.phases[phaseIndex];
        const phaseDuration = currentPhaseConfig.duration * 1000;
        const phaseElapsed = now - phaseStartRef.current;
        const progress = Math.min(100, (phaseElapsed / phaseDuration) * 100);

        if (phaseElapsed >= phaseDuration) {
          // Move to next phase
          phaseIndex = (phaseIndex + 1) % config.phases.length;
          const newPhase = config.phases[phaseIndex].phase;
          
          // Check if cycle completed
          let newCycle = prev.currentCycle;
          if (phaseIndex === 0) {
            newCycle = prev.currentCycle + 1;
            triggerHaptic('medium');
            
            if (newCycle >= prev.totalCycles) {
              // Session complete
              clearInterval(intervalRef.current);
              ambientAudioRef.current?.pause();
              
              const audio = new Audio(AUDIO_FILES.complete);
              audio.play().catch(() => {});
              
              return {
                ...prev,
                status: 'completed',
                currentCycle: newCycle,
                elapsedTime: Math.floor((now - sessionStartRef.current) / 1000),
              };
            }
          }

          phaseStartRef.current = now;
          playAudioCue(newPhase);
          triggerHaptic('light');

          return {
            ...prev,
            currentPhase: newPhase,
            phaseProgress: 0,
            currentCycle: newCycle,
            elapsedTime: Math.floor((now - sessionStartRef.current) / 1000),
          };
        }

        return {
          ...prev,
          phaseProgress: progress,
          elapsedTime: Math.floor((now - sessionStartRef.current) / 1000),
        };
      });
    }, 50);

    logger.info('VR Breathing session started', { pattern, vrMode: options.vrMode }, 'VR_BREATHING');
  }, [audioEnabled, playAudioCue, triggerHaptic]);

  // Pause session
  const pauseSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    ambientAudioRef.current?.pause();
    setSession(prev => ({ ...prev, status: 'paused' }));
  }, []);

  // Resume session
  const resumeSession = useCallback(() => {
    if (session.status !== 'paused') return;

    phaseStartRef.current = Date.now();
    ambientAudioRef.current?.play().catch(() => {});
    
    setSession(prev => ({ ...prev, status: 'active' }));
    
    // Restart interval
    startSession(session.pattern, {
      vrMode: session.vrMode,
      cycles: session.totalCycles - session.currentCycle,
      moodBefore: session.moodBefore || undefined,
    });
  }, [session, startSession]);

  // Complete session
  const completeSession = useCallback(async (moodAfter?: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    ambientAudioRef.current?.pause();

    const finalSession = {
      ...session,
      status: 'completed' as const,
      moodAfter: moodAfter || null,
    };

    setSession(finalSession);

    // Save to database
    if (user && finalSession.elapsedTime > 10) {
      try {
        await supabase.from('breathing_vr_sessions').insert({
          user_id: user.id,
          pattern: mapPatternToDb(finalSession.pattern),
          vr_mode: finalSession.vrMode,
          duration_seconds: Math.max(1, Math.floor(finalSession.elapsedTime)),
          cycles_completed: finalSession.currentCycle,
          mood_before: finalSession.moodBefore,
          mood_after: finalSession.moodAfter,
          average_pace: finalSession.currentCycle > 0
            ? finalSession.elapsedTime / finalSession.currentCycle
            : 0,
          notes: null,
        });

        logger.info('VR Breathing session saved', {
          duration: finalSession.elapsedTime,
          cycles: finalSession.currentCycle,
        }, 'VR_BREATHING');
      } catch (err) {
        logger.error('Failed to save breathing session', err as Error, 'VR_BREATHING');
      }
    }
  }, [session, user]);

  // Stop session
  const stopSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    ambientAudioRef.current?.pause();
    
    setSession(prev => ({
      ...prev,
      status: 'idle',
      phaseProgress: 0,
      currentPhase: 'inhale',
    }));
  }, []);

  // Calculate coherence in real-time (simplified)
  const calculateCoherence = useCallback((): number => {
    if (session.status !== 'active') return 0;

    const config = PATTERNS[session.pattern];
    const idealCycleDuration = config.totalCycleDuration;
    const actualCycleDuration = session.currentCycle > 0
      ? session.elapsedTime / session.currentCycle
      : idealCycleDuration;

    const deviation = Math.abs(actualCycleDuration - idealCycleDuration) / idealCycleDuration;
    return Math.max(0, Math.round((1 - deviation) * 100));
  }, [session]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      ambientAudioRef.current?.pause();
    };
  }, []);

  return {
    // Session
    session,
    patterns: PATTERNS,
    
    // Actions
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    stopSession,
    
    // Helpers
    getPatternConfig,
    calculateCoherence,
    
    // Settings
    audioEnabled,
    setAudioEnabled,
    hapticEnabled,
    setHapticEnabled,
    
    // Stats & capabilities
    stats,
    isVRSupported,
    
    // Computed
    isActive: session.status === 'active',
    isPaused: session.status === 'paused',
    isCompleted: session.status === 'completed',
    currentPatternConfig: PATTERNS[session.pattern],
  };
}

export default useVRBreathingEnriched;
