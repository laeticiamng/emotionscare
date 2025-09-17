/**
 * useFlashGlowMachine - State machine pour Flash Glow
 * Pattern : idle → loading → active → ending → success|error
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { flashGlowService, FlashGlowSession } from './flash-glowService';
import { toast } from '@/hooks/use-toast';
import { createFlashGlowJournalEntry } from './journal';
import type { JournalEntry } from '@/modules/journal/journalService';

interface FlashGlowConfig {
  glowType: string;
  intensity: number;
  duration: number;
}

interface StartSessionOptions {
  moodBaseline?: number | null;
}

interface CompleteSessionOptions {
  label: 'gain' | 'léger' | 'incertain';
  extend?: boolean;
  moodAfter?: number | null;
}

interface FlashGlowMachineReturn {
  // État de la machine
  state: 'idle' | 'loading' | 'active' | 'ending' | 'success' | 'error';
  isActive: boolean;

  // Configuration
  config: FlashGlowConfig;
  setConfig: (config: Partial<FlashGlowConfig>) => void;

  // Contrôles
  startSession: (options?: StartSessionOptions) => Promise<void>;
  stopSession: () => void;
  extendSession: (additionalSeconds: number) => Promise<void>;

  // Données de progression
  sessionDuration: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  sessionProgress: number;

  // Humeur
  moodBaseline: number | null;
  moodAfter: number | null;
  moodDelta: number | null;
  setMoodBaseline: (value: number | null) => void;

  // Résultats
  result: any;
  error: Error | null;

  // Callbacks pour les composants UI
  onSessionComplete: (options: CompleteSessionOptions) => Promise<void>;

  // Stats
  stats: { totalSessions: number; avgDuration: number } | null;
  loadStats: () => Promise<void>;
}

const clampMood = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const useFlashGlowMachine = (): FlashGlowMachineReturn => {
  const [config, setConfigState] = useState<FlashGlowConfig>({
    glowType: 'energy',
    intensity: 75,
    duration: 90
  });

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(config.duration);
  const [stats, setStats] = useState<{ totalSessions: number; avgDuration: number } | null>(null);
  const [moodBaselineState, setMoodBaselineState] = useState<number | null>(null);
  const [moodAfterState, setMoodAfterState] = useState<number | null>(null);
  const [lastMoodDelta, setLastMoodDelta] = useState<number | null>(null);

  const durationRef = useRef(config.duration);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moodBaselineRef = useRef<number | null>(null);
  const moodAfterRef = useRef<number | null>(null);
  const sessionExtendedRef = useRef(false);

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    durationRef.current = config.duration;
    if (!progressTimerRef.current) {
      setRemainingSeconds(config.duration);
    }
  }, [config.duration]);

  useEffect(() => () => {
    clearProgressTimer();
  }, [clearProgressTimer]);

  const setMoodBaseline = useCallback((value: number | null) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      const clamped = clampMood(value);
      setMoodBaselineState(clamped);
      moodBaselineRef.current = clamped;
    } else {
      setMoodBaselineState(null);
      moodBaselineRef.current = null;
    }
  }, []);

  const setMoodAfter = useCallback((value: number | null) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      const clamped = clampMood(value);
      setMoodAfterState(clamped);
      moodAfterRef.current = clamped;
    } else {
      setMoodAfterState(null);
      moodAfterRef.current = null;
    }
  }, []);

  const setConfig = useCallback((newConfig: Partial<FlashGlowConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  const machine = useAsyncMachine<any>({
    run: async (signal: AbortSignal) => {
      const sessionStart = await flashGlowService.startSession(config);
      const startedAt = Date.now();
      setSessionStartTime(startedAt);
      sessionExtendedRef.current = false;
      setSessionDuration(0);
      setSessionProgress(0);
      setElapsedSeconds(0);
      setRemainingSeconds(durationRef.current);
      clearProgressTimer();

      await new Promise<void>((resolve, reject) => {
        const tick = () => {
          if (signal.aborted) {
            clearProgressTimer();
            reject(new Error('Session interrupted'));
            return;
          }

          const targetSeconds = Math.max(1, Math.round(durationRef.current));
          const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
          setElapsedSeconds(elapsed);
          setRemainingSeconds(Math.max(targetSeconds - elapsed, 0));
          setSessionProgress(targetSeconds > 0 ? Math.min(1, elapsed / targetSeconds) : 1);

          if (elapsed >= targetSeconds) {
            clearProgressTimer();
            resolve();
          }
        };

        tick();
        progressTimerRef.current = setInterval(tick, 1000);

        signal.addEventListener('abort', () => {
          clearProgressTimer();
          reject(new Error('Session interrupted'));
        });
      });

      if (signal.aborted) throw new Error('Session aborted');

      const actualDuration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      setSessionDuration(actualDuration);
      setSessionProgress(1);
      setElapsedSeconds(actualDuration);
      setRemainingSeconds(0);

      flashGlowService.triggerHapticFeedback();

      return {
        sessionId: sessionStart.sessionId,
        duration: actualDuration,
        completed: true
      };
    },
    onSuccess: (result) => {
      console.log('✅ Flash Glow session completed:', result);
    },
    onError: (error) => {
      clearProgressTimer();
      console.error('❌ Flash Glow session error:', error);
      toast({
        title: "Session interrompue",
        description: "La session Flash Glow a été interrompue",
        variant: "destructive",
      });
    },
    retryLimit: 0,
    timeout: (config.duration + 15) * 1000
  });

  const startSession = useCallback(async (options?: StartSessionOptions) => {
    if (machine.isActive || machine.isLoading) return;

    const providedBaseline = options?.moodBaseline ?? moodBaselineRef.current ?? moodBaselineState ?? null;
    if (typeof providedBaseline === 'number') {
      const clamped = clampMood(providedBaseline);
      setMoodBaselineState(clamped);
      moodBaselineRef.current = clamped;
    }

    durationRef.current = config.duration;
    sessionExtendedRef.current = false;
    setLastMoodDelta(null);
    setMoodAfter(null);
    setSessionDuration(0);
    setSessionProgress(0);
    setElapsedSeconds(0);
    setRemainingSeconds(config.duration);

    console.log('🌟 Starting Flash Glow session:', config);
    await machine.start();
  }, [machine, config, setMoodAfter, moodBaselineState]);

  const stopSession = useCallback(() => {
    clearProgressTimer();
    machine.stop();
    setSessionStartTime(null);
    setSessionDuration(0);
    setSessionProgress(0);
    setElapsedSeconds(0);
    setRemainingSeconds(config.duration);
  }, [machine, config.duration, clearProgressTimer]);

  const extendSession = useCallback(async (additionalSeconds: number) => {
    if (!machine.isActive) return;

    const safeAdditional = Math.max(1, Math.round(additionalSeconds));
    const newDuration = Math.max(1, durationRef.current + safeAdditional);
    durationRef.current = newDuration;
    sessionExtendedRef.current = true;
    setConfig({ duration: newDuration });
    setRemainingSeconds(prev => prev + safeAdditional);

    toast({
      title: "Session prolongée",
      description: `+${safeAdditional}s ajoutées à votre session`,
    });
  }, [machine.isActive, setConfig]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await flashGlowService.getStats();
      setStats({
        totalSessions: statsData.total_sessions,
        avgDuration: statsData.avg_duration
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const onSessionComplete = useCallback(async ({
    label,
    extend = false,
    moodAfter: providedMoodAfter
  }: CompleteSessionOptions) => {
    if (extend) {
      await extendSession(60);
      return;
    }

    try {
      const recordedDuration = sessionDuration || elapsedSeconds || config.duration;
      const recommendation = flashGlowService.getRecommendation(label, 3);

      const baseline = moodBaselineRef.current;
      const explicitMoodAfter = typeof providedMoodAfter === 'number' ? clampMood(providedMoodAfter) : null;
      const resolvedMoodAfter = explicitMoodAfter ?? moodAfterRef.current ?? baseline ?? null;

      setMoodAfter(resolvedMoodAfter);

      const moodDelta = baseline !== null && resolvedMoodAfter !== null
        ? resolvedMoodAfter - baseline
        : null;

      setLastMoodDelta(moodDelta);

      let journalEntry: JournalEntry | null = await createFlashGlowJournalEntry({
        label,
        duration: recordedDuration,
        intensity: config.intensity,
        glowType: config.glowType,
        recommendation,
        context: 'Flash Glow Ultra',
        moodBefore: baseline,
        moodAfter: resolvedMoodAfter,
        moodDelta
      });

      const sessionData: FlashGlowSession = {
        duration_s: recordedDuration,
        label,
        glow_type: config.glowType,
        intensity: config.intensity,
        result: 'completed',
        metadata: {
          timestamp: new Date().toISOString(),
          extended: sessionExtendedRef.current,
          autoJournal: Boolean(journalEntry),
          journalEntryId: journalEntry?.id,
          journalSummary: journalEntry?.summary,
          journalTone: journalEntry?.tone,
          moodBefore: baseline,
          moodAfter: resolvedMoodAfter,
          moodDelta
        }
      };

      await flashGlowService.endSession(sessionData);

      if (!journalEntry) {
        journalEntry = await createFlashGlowJournalEntry({
          label,
          duration: recordedDuration,
          intensity: config.intensity,
          glowType: config.glowType,
          recommendation,
          context: 'Flash Glow Ultra',
          moodBefore: baseline,
          moodAfter: resolvedMoodAfter,
          moodDelta
        });
      }

      const deltaDescription = moodDelta === null
        ? null
        : `Δ humeur : ${moodDelta > 0 ? '+' : ''}${moodDelta}`;

      toast({
        title: "Session terminée ! ✨",
        description: [
          recommendation,
          deltaDescription,
          journalEntry
            ? '📝 Votre expérience a été ajoutée automatiquement au journal.'
            : '📝 Journalisation automatique indisponible, pensez à noter votre ressenti manuellement.'
        ].filter(Boolean).join('\n')
      });

      sessionExtendedRef.current = false;

      await loadStats();

    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session",
        variant: "destructive",
      });
    }
  }, [extendSession, sessionDuration, elapsedSeconds, config, loadStats, setMoodAfter]);

  const computedMoodDelta = useMemo(() => {
    if (lastMoodDelta === null) return null;
    return lastMoodDelta;
  }, [lastMoodDelta]);

  return {
    // État
    state: machine.state,
    isActive: machine.isActive,

    // Configuration
    config,
    setConfig,

    // Contrôles
    startSession,
    stopSession,
    extendSession,

    // Données de progression
    sessionDuration,
    elapsedSeconds,
    remainingSeconds,
    sessionProgress,

    // Humeur
    moodBaseline: moodBaselineState,
    moodAfter: moodAfterState,
    moodDelta: computedMoodDelta,
    setMoodBaseline,

    // Résultats
    result: machine.result,
    error: machine.error,

    // Callbacks
    onSessionComplete,

    // Stats
    stats,
    loadStats
  };
};
