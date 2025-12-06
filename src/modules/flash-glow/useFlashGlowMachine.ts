/**
 * useFlashGlowMachine - State machine pour Flash Glow
 * Pattern : idle → loading → active → ending → success|error
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { flashGlowService, FlashGlowSession } from './flash-glowService';
import { toast } from '@/hooks/use-toast';
import { createFlashGlowJournalEntry } from './journal';
import type { JournalEntry } from '@/modules/journal/journalService';
import { useSessionClock } from '@/modules/sessions/hooks/useSessionClock';
import { logAndJournal } from '@/services/sessions/sessionsApi';
import { computeMoodDelta } from '@/services/sessions/moodDelta';

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

  const [stats, setStats] = useState<{ totalSessions: number; avgDuration: number } | null>(null);
  const [moodBaselineState, setMoodBaselineState] = useState<number | null>(null);
  const [moodAfterState, setMoodAfterState] = useState<number | null>(null);
  const [lastMoodDelta, setLastMoodDelta] = useState<number | null>(null);

  const durationRef = useRef(config.duration);
  const moodBaselineRef = useRef<number | null>(null);
  const moodAfterRef = useRef<number | null>(null);
  const sessionExtendedRef = useRef(false);
  const clock = useSessionClock({ durationMs: config.duration > 0 ? config.duration * 1000 : undefined });

  useEffect(() => {
    durationRef.current = config.duration;
  }, [config.duration]);

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
      sessionExtendedRef.current = false;
      clock.reset();

      await new Promise<void>((resolve, reject) => {
        const unsubscribe = clock.onTick(() => {
          if (clock.state === 'completed') {
            unsubscribe();
            signal.removeEventListener('abort', abortHandler);
            resolve();
          }
        });

        function abortHandler() {
          unsubscribe();
          signal.removeEventListener('abort', abortHandler);
          clock.reset();
          reject(new Error('Session interrupted'));
        }

        if (signal.aborted) {
          abortHandler();
          return;
        }

        signal.addEventListener('abort', abortHandler);
        clock.start();
      });
      clock.complete();
      const actualDuration = Math.max(0, Math.round(clock.elapsedMs / 1000));
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
      clock.reset();
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
    clock.reset();
    Sentry.addBreadcrumb({
      category: 'session',
      message: 'session:start',
      level: 'info',
      data: { module: 'flash_glow', duration: config.duration }
    });
    await machine.start();
  }, [machine, config, setMoodAfter, moodBaselineState, clock]);

  const stopSession = useCallback(() => {
    clock.reset();
    sessionExtendedRef.current = false;
    machine.stop();
    Sentry.addBreadcrumb({
      category: 'session',
      message: 'session:reset',
      level: 'info',
      data: { module: 'flash_glow' }
    });
  }, [clock, machine]);

  const extendSession = useCallback(async (additionalSeconds: number) => {
    if (!machine.isActive) return;

    const safeAdditional = Math.max(1, Math.round(additionalSeconds));
    const newDuration = Math.max(1, durationRef.current + safeAdditional);
    durationRef.current = newDuration;
    sessionExtendedRef.current = true;
    setConfig({ duration: newDuration });

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
      clock.complete();
      const elapsedSec = Math.max(1, Math.round(clock.elapsedMs / 1000) || config.duration || 1);
      const recommendation = flashGlowService.getRecommendation(label, 3);

      const baseline = moodBaselineRef.current;
      const explicitMoodAfter = typeof providedMoodAfter === 'number' ? clampMood(providedMoodAfter) : null;
      const resolvedMoodAfter = explicitMoodAfter ?? moodAfterRef.current ?? baseline ?? null;

      setMoodAfter(resolvedMoodAfter);

      const baselineSnapshot = baseline !== null ? { valence: baseline / 50 - 1, arousal: 0 } : null;
      const afterSnapshot = resolvedMoodAfter !== null ? { valence: resolvedMoodAfter / 50 - 1, arousal: 0 } : null;
      const computedDelta = computeMoodDelta(baselineSnapshot, afterSnapshot);

      setLastMoodDelta(computedDelta);

      let journalEntry: JournalEntry | null = await createFlashGlowJournalEntry({
        label,
        duration: elapsedSec,
        intensity: config.intensity,
        glowType: config.glowType,
        recommendation,
        context: 'Flash Glow Ultra',
        moodBefore: baseline,
        moodAfter: resolvedMoodAfter,
        moodDelta: computedDelta
      });

      const sessionData: FlashGlowSession = {
        duration_s: elapsedSec,
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
          moodDelta: computedDelta,
          context: 'Flash Glow Ultra',
          mode: sessionExtendedRef.current ? 'extended' : 'core',
          elapsed_ms: clock.elapsedMs
        }
      };

      const serviceResponse = await flashGlowService.endSession(sessionData);

      const resolvedMoodDelta = typeof serviceResponse?.mood_delta === 'number'
        ? serviceResponse.mood_delta
        : computedDelta;

      if (typeof resolvedMoodDelta === 'number') {
        setLastMoodDelta(resolvedMoodDelta);
      }

      if (!journalEntry) {
        journalEntry = await createFlashGlowJournalEntry({
          label,
          duration: elapsedSec,
          intensity: config.intensity,
          glowType: config.glowType,
          recommendation,
          context: 'Flash Glow Ultra',
          moodBefore: baseline,
          moodAfter: resolvedMoodAfter,
          moodDelta: resolvedMoodDelta ?? computedDelta ?? null
        });
      }

      const summaryBase = label === 'gain'
        ? 'Séance FlashGlow terminée, je ressens un regain lumineux.'
        : label === 'léger'
          ? 'Séance FlashGlow terminée avec une douceur paisible.'
          : 'Séance FlashGlow terminée, je reste à l’écoute de mes sensations.';
      const glowComment = config.glowType === 'calm'
        ? 'La lumière est restée très enveloppante.'
        : config.glowType === 'energy'
          ? 'Je conserve une belle vitalité intérieure.'
          : 'Je laisse cette lumière teinter mon esprit.';
      const summaryText = `${summaryBase} ${glowComment}`.trim();

      await logAndJournal({
        type: 'flash_glow',
        duration_sec: elapsedSec,
        mood_delta: resolvedMoodDelta ?? computedDelta ?? null,
        journalText: summaryText,
        meta: {
          glowType: config.glowType,
          intensity: config.intensity,
          label,
          extended: sessionExtendedRef.current,
          mood_before: baseline,
          mood_after: resolvedMoodAfter,
          mood_delta: resolvedMoodDelta ?? computedDelta ?? null,
          elapsed_ms: clock.elapsedMs
        }
      });

      const deltaDescription = resolvedMoodDelta == null
        ? null
        : `Δ humeur : ${resolvedMoodDelta > 0 ? '+' : ''}${resolvedMoodDelta}`;

      toast({
        title: "Session terminée ! ✨",
        description: [
          recommendation,
          deltaDescription,
          '📝 Votre expérience a été ajoutée automatiquement au journal.'
        ].filter(Boolean).join('\n')
      });

      sessionExtendedRef.current = false;
      Sentry.addBreadcrumb({
        category: 'session',
        message: 'session:complete',
        level: 'info',
        data: { module: 'flash_glow', duration_sec: elapsedSec }
      });

      await loadStats();

    } catch (error) {
      console.error('Error completing session:', error);
      Sentry.captureException(error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session",
        variant: "destructive",
      });
    }
  }, [extendSession, config, loadStats, setMoodAfter, clock]);

  const targetSeconds = Math.max(1, Math.round(durationRef.current || config.duration || 0));
  const elapsedSeconds = Math.max(0, Math.round(clock.elapsedMs / 1000));
  const sessionDuration = elapsedSeconds;
  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);
  const sessionProgress = targetSeconds > 0
    ? Math.min(1, clock.progress ?? elapsedSeconds / targetSeconds)
    : 1;

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
