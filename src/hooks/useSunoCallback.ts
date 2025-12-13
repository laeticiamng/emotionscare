// @ts-nocheck
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SunoCallback } from '@/types/music-generation';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

/** État de la génération */
export type GenerationState = 'idle' | 'queued' | 'processing' | 'complete' | 'error' | 'timeout';

/** Étape de progression */
export interface ProgressStep {
  stage: string;
  progress: number;
  message?: string;
  timestamp: Date;
}

/** Détails de la piste générée */
export interface GeneratedTrack {
  taskId: string;
  audioUrl: string;
  signedUrl?: string;
  duration: number;
  title?: string;
  tags?: string[];
  waveformData?: number[];
  metadata?: Record<string, unknown>;
}

/** Historique de génération */
export interface GenerationHistoryEntry {
  taskId: string;
  state: GenerationState;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  track?: GeneratedTrack;
}

/** Configuration avancée */
export interface UseSunoCallbackOptions {
  taskId: string | null;
  onComplete?: (callback: SunoCallback, track: GeneratedTrack) => void;
  onError?: (error: string, taskId: string) => void;
  onProgress?: (step: ProgressStep) => void;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  pollInterval?: number;
  enableRealtime?: boolean;
  autoCleanup?: boolean;
  onStateChange?: (state: GenerationState) => void;
}

const DEFAULT_OPTIONS = {
  timeout: 300000, // 5 minutes
  maxRetries: 3,
  retryDelay: 2000,
  pollInterval: 1000,
  enableRealtime: true,
  autoCleanup: true
};

export const useSunoCallback = (options: UseSunoCallbackOptions) => {
  const {
    taskId,
    onComplete,
    onError,
    onProgress,
    timeout = DEFAULT_OPTIONS.timeout,
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    retryDelay = DEFAULT_OPTIONS.retryDelay,
    pollInterval = DEFAULT_OPTIONS.pollInterval,
    enableRealtime = DEFAULT_OPTIONS.enableRealtime,
    autoCleanup = DEFAULT_OPTIONS.autoCleanup,
    onStateChange
  } = options;

  const [latestCallback, setLatestCallback] = useState<SunoCallback | null>(null);
  const [state, setState] = useState<GenerationState>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([]);

  const retryCountRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  const isWaiting = state === 'queued' || state === 'processing';
  const isComplete = state === 'complete';
  const hasError = state === 'error' || state === 'timeout';

  // Notifier le changement d'état
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Ajouter une étape de progression
  const addProgressStep = useCallback((stage: string, progressValue: number, message?: string) => {
    const step: ProgressStep = {
      stage,
      progress: progressValue,
      message,
      timestamp: new Date()
    };
    setProgress(prev => [...prev, step]);
    onProgress?.(step);
  }, [onProgress]);

  // Ajouter à l'historique
  const addToHistory = useCallback((entry: Omit<GenerationHistoryEntry, 'id'>) => {
    const historyEntry: GenerationHistoryEntry = {
      ...entry,
      taskId: entry.taskId
    };
    setHistory(prev => [historyEntry, ...prev].slice(0, 50));
  }, []);

  // Nettoyer les ressources
  const cleanup = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    cleanup();
    setState('idle');
    setLatestCallback(null);
    setElapsedTime(0);
    setSignedUrl(null);
    setProgress([]);
    setError(null);
    setGeneratedTrack(null);
    retryCountRef.current = 0;
    startTimeRef.current = null;
  }, [cleanup]);

  // Obtenir URL signée depuis Storage avec retry
  const getSignedUrl = useCallback(async (id: string): Promise<string | null> => {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const { data, error: signError } = await supabase.functions.invoke('sign-emotion-track', {
          body: { taskId: id }
        });

        if (signError) {
          logger.error('Error signing URL', signError as Error, 'MUSIC');
          attempts++;
          if (attempts < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
            continue;
          }
          return null;
        }

        if (data?.url) {
          logger.info('Got signed URL for playback', { taskId: id }, 'MUSIC');
          setSignedUrl(data.url);
          return data.url;
        }

        return null;
      } catch (err) {
        logger.warn('Could not get signed URL', err as Error, 'MUSIC');
        attempts++;
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
        }
      }
    }

    return null;
  }, [maxRetries, retryDelay]);

  // Gérer la complétion
  const handleComplete = useCallback(async (
    callback: SunoCallback,
    audioUrl?: string,
    duration?: number
  ) => {
    cleanup();
    setState('complete');
    addProgressStep('complete', 100, 'Génération terminée');

    const url = await getSignedUrl(callback.taskId);

    const track: GeneratedTrack = {
      taskId: callback.taskId,
      audioUrl: audioUrl || '',
      signedUrl: url || undefined,
      duration: duration || 0,
      title: (callback.data as any)?.title,
      tags: (callback.data as any)?.tags,
      metadata: callback.data as Record<string, unknown>
    };

    setGeneratedTrack(track);

    addToHistory({
      taskId: callback.taskId,
      state: 'complete',
      startTime: startTimeRef.current || new Date(),
      endTime: new Date(),
      duration: elapsedTime,
      track
    });

    onComplete?.(callback, track);
  }, [cleanup, addProgressStep, getSignedUrl, addToHistory, elapsedTime, onComplete]);

  // Gérer les erreurs
  const handleError = useCallback((errorMessage: string, id: string) => {
    cleanup();
    setState('error');
    setError(errorMessage);

    addToHistory({
      taskId: id,
      state: 'error',
      startTime: startTimeRef.current || new Date(),
      endTime: new Date(),
      duration: elapsedTime,
      error: errorMessage
    });

    onError?.(errorMessage, id);
    toast.error('Erreur de génération', { description: errorMessage });
  }, [cleanup, addToHistory, elapsedTime, onError]);

  // Gérer le timeout
  const handleTimeout = useCallback((id: string) => {
    cleanup();
    setState('timeout');
    setError('La génération a pris trop de temps');

    addToHistory({
      taskId: id,
      state: 'timeout',
      startTime: startTimeRef.current || new Date(),
      endTime: new Date(),
      duration: elapsedTime,
      error: 'Timeout'
    });

    onError?.('Timeout - la génération a dépassé le délai maximum', id);
    toast.error('Timeout', { description: 'La génération musicale a pris trop de temps' });
  }, [cleanup, addToHistory, elapsedTime, onError]);

  // Vérifier le callback avec retry
  const checkCallback = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('suno_callbacks')
        .select('*')
        .eq('task_id', id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        logger.error('Error fetching callback', fetchError as Error, 'MUSIC');
        return false;
      }

      const row = data?.[0];
      if (row) {
        const callback: SunoCallback = {
          taskId: row.task_id,
          callbackType: row.callback_type,
          status: row.status,
          data: row.metadata
        };

        setLatestCallback(callback);

        if (row.callback_type === 'complete') {
          await handleComplete(callback, row.metadata?.audio_url, row.metadata?.duration);
          return true;
        } else if (row.callback_type === 'error') {
          handleError(row.metadata?.error || 'Erreur inconnue', id);
          return true;
        } else if (row.callback_type === 'progress') {
          const progressValue = row.metadata?.progress || 0;
          setState('processing');
          addProgressStep('processing', progressValue, row.metadata?.message);
        }
      }

      return false;
    } catch (err) {
      logger.error('Check callback error', err as Error, 'MUSIC');
      retryCountRef.current++;

      if (retryCountRef.current >= maxRetries) {
        handleError('Trop d\'erreurs de connexion', id);
        return true;
      }

      return false;
    }
  }, [handleComplete, handleError, addProgressStep, maxRetries]);

  // Polling de fallback
  const pollStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { data: pollData, error: pollError } = await supabase.functions.invoke('suno-poll-status', {
        body: { taskId: id }
      });

      if (pollError) {
        logger.warn('Poll status error', pollError as Error, 'MUSIC');
        return false;
      }

      if (pollData?.stage === 'complete') {
        const callback: SunoCallback = {
          taskId: id,
          callbackType: 'complete',
          status: 'success',
          data: { audio_url: pollData.downloadUrl, duration: pollData.duration }
        };
        await handleComplete(callback, pollData.downloadUrl, pollData.duration);
        return true;
      } else if (pollData?.stage === 'error') {
        handleError(pollData.error || 'Erreur de génération', id);
        return true;
      } else if (pollData?.progress) {
        addProgressStep('processing', pollData.progress, pollData.message);
      }

      return false;
    } catch (err) {
      logger.warn('Poll status exception', err as Error, 'MUSIC');
      return false;
    }
  }, [handleComplete, handleError, addProgressStep]);

  // Effet principal: Realtime + Polling
  useEffect(() => {
    if (!taskId) {
      reset();
      return;
    }

    // Initialiser
    setState('queued');
    setElapsedTime(0);
    setProgress([]);
    setError(null);
    retryCountRef.current = 0;
    startTimeRef.current = new Date();

    addProgressStep('queued', 0, 'En attente de traitement');

    // Timer pour le temps écoulé
    timeIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Timeout global
    timeoutRef.current = setTimeout(() => {
      handleTimeout(taskId);
    }, timeout);

    // Compteur de polls
    let pollCount = 0;

    // Vérification périodique
    const runCheck = async () => {
      pollCount++;

      // Vérifier le callback DB d'abord
      const found = await checkCallback(taskId);
      if (found) return;

      // Fallback polling toutes les 2 itérations
      if (pollCount % 2 === 0) {
        await pollStatus(taskId);
      }
    };

    pollIntervalRef.current = setInterval(runCheck, pollInterval);
    runCheck(); // Vérification initiale

    // Souscription realtime si activée
    if (enableRealtime) {
      channelRef.current = supabase.channel(`suno-cb-${taskId}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'suno_callbacks', filter: `task_id=eq.${taskId}` },
          async (payload) => {
            const row = payload.new as any;
            const callback: SunoCallback = {
              taskId: row.task_id,
              callbackType: row.callback_type,
              status: row.status,
              data: row.metadata
            };

            setLatestCallback(callback);

            if (row.callback_type === 'complete') {
              await handleComplete(callback, row.metadata?.audio_url, row.metadata?.duration);
            } else if (row.callback_type === 'error') {
              handleError(row.metadata?.error || 'Erreur', taskId);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info('Subscribed to suno callbacks', { taskId }, 'MUSIC');
          }
        });
    }

    return () => {
      if (autoCleanup) {
        cleanup();
      }
    };
  }, [taskId, timeout, pollInterval, enableRealtime, autoCleanup, checkCallback, pollStatus, handleComplete, handleError, handleTimeout, addProgressStep, cleanup, reset]);

  // Annuler la génération
  const cancel = useCallback(async () => {
    if (!taskId || !isWaiting) return false;

    try {
      await supabase.functions.invoke('suno-cancel', { body: { taskId } });
      cleanup();
      setState('idle');

      addToHistory({
        taskId,
        state: 'error',
        startTime: startTimeRef.current || new Date(),
        endTime: new Date(),
        duration: elapsedTime,
        error: 'Annulé par l\'utilisateur'
      });

      toast.info('Génération annulée');
      return true;
    } catch (err) {
      logger.error('Cancel error', err as Error, 'MUSIC');
      return false;
    }
  }, [taskId, isWaiting, cleanup, addToHistory, elapsedTime]);

  // Réessayer la génération
  const retry = useCallback(async () => {
    if (!taskId) return;

    reset();
    // Le useEffect se déclenchera à nouveau avec le même taskId
    setState('queued');
  }, [taskId, reset]);

  // Progression actuelle
  const currentProgress = useMemo(() => {
    if (progress.length === 0) return null;
    return progress[progress.length - 1];
  }, [progress]);

  // Durée estimée restante
  const estimatedTimeRemaining = useMemo(() => {
    if (!currentProgress || currentProgress.progress <= 0) return null;
    const elapsed = elapsedTime;
    const progressPercent = currentProgress.progress / 100;
    if (progressPercent === 0) return null;
    const estimated = elapsed / progressPercent;
    return Math.max(0, Math.round(estimated - elapsed));
  }, [currentProgress, elapsedTime]);

  // Stats de génération
  const stats = useMemo(() => ({
    totalGenerations: history.length,
    successfulGenerations: history.filter(h => h.state === 'complete').length,
    failedGenerations: history.filter(h => h.state === 'error' || h.state === 'timeout').length,
    averageDuration: history.length > 0
      ? history.reduce((sum, h) => sum + (h.duration || 0), 0) / history.length
      : 0,
    lastGeneration: history[0] || null
  }), [history]);

  return {
    // État principal
    latestCallback,
    state,
    isWaiting,
    isComplete,
    hasError,
    error,

    // Temps
    elapsedTime,
    estimatedTimeRemaining,

    // Progression
    progress,
    currentProgress,

    // Résultat
    signedUrl,
    generatedTrack,

    // Historique
    history,
    stats,

    // Actions
    cancel,
    retry,
    reset,

    // Utilitaires
    getSignedUrl
  };
};
