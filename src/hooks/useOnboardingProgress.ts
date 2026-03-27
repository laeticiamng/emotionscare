// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { OnboardingProgress, OnboardingLog } from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const SETTINGS_KEY_PROGRESS = 'onboarding_progress';
const SETTINGS_KEY_LOGS = 'onboarding_logs';

export function useOnboardingProgress() {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    totalSteps: 0,
    completed: false,
    responses: {},
    startedAt: '',
    timeSpent: 0
  });
  const [logs, setLogs] = useState<OnboardingLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sauvegarder vers Supabase
  const saveToSupabase = useCallback(async (key: string, value: unknown) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });
    } catch (error) {
      logger.error(`Error saving ${key} to Supabase:`, error, 'ONBOARDING');
    }
  }, [user]);

  // Charger depuis Supabase ou localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          // Charger depuis Supabase
          const { data: settings } = await supabase
            .from('user_settings')
            .select('key, value')
            .eq('user_id', user.id)
            .in('key', [SETTINGS_KEY_PROGRESS, SETTINGS_KEY_LOGS]);

          if (settings) {
            const progressData = settings.find(s => s.key === SETTINGS_KEY_PROGRESS);
            const logsData = settings.find(s => s.key === SETTINGS_KEY_LOGS);

            if (progressData?.value) {
              const parsed = typeof progressData.value === 'string'
                ? JSON.parse(progressData.value)
                : progressData.value;
              setProgress(parsed);
            }

            if (logsData?.value) {
              const parsed = typeof logsData.value === 'string'
                ? JSON.parse(logsData.value)
                : logsData.value;
              setLogs(Array.isArray(parsed) ? parsed : []);
            }
          }

          // Migrer depuis localStorage
          const localProgress = localStorage.getItem(`onboarding-progress-${userId}`);
          const localLogs = localStorage.getItem(`onboarding-logs-${userId}`);

          if (localProgress) {
            const parsed = JSON.parse(localProgress);
            setProgress(prev => {
              const merged = { ...parsed, ...prev };
              saveToSupabase(SETTINGS_KEY_PROGRESS, merged);
              return merged;
            });
            localStorage.removeItem(`onboarding-progress-${userId}`);
          }

          if (localLogs) {
            const parsed = JSON.parse(localLogs);
            if (Array.isArray(parsed)) {
              setLogs(prev => {
                const merged = [...prev, ...parsed];
                saveToSupabase(SETTINGS_KEY_LOGS, merged);
                return merged;
              });
              localStorage.removeItem(`onboarding-logs-${userId}`);
            }
          }
        } else {
          // Fallback localStorage
          const localProgress = localStorage.getItem(`onboarding-progress-${userId}`);
          const localLogs = localStorage.getItem(`onboarding-logs-${userId}`);

          if (localProgress) {
            setProgress(JSON.parse(localProgress));
          }

          if (localLogs) {
            setLogs(JSON.parse(localLogs));
          }
        }
      } catch (error) {
        logger.error('Failed to load onboarding data', error as Error, 'ONBOARDING');
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user?.id, userId, saveToSupabase]);

  // Sauvegarder automatiquement les changements
  useEffect(() => {
    if (!isLoaded) return;
    
    if (user) {
      if (progress.totalSteps > 0) {
        saveToSupabase(SETTINGS_KEY_PROGRESS, progress);
      }
      if (logs.length > 0) {
        saveToSupabase(SETTINGS_KEY_LOGS, logs);
      }
    } else {
      // Fallback localStorage
      if (progress.totalSteps > 0) {
        localStorage.setItem(`onboarding-progress-${userId}`, JSON.stringify(progress));
      }
      if (logs.length > 0) {
        localStorage.setItem(`onboarding-logs-${userId}`, JSON.stringify(logs));
      }
    }
  }, [progress, logs, user, userId, isLoaded, saveToSupabase]);

  const logStep = (stepId: string, action: 'view' | 'complete' | 'skip' | 'back', timeSpent?: number, responses?: any) => {
    const log: OnboardingLog = {
      userId,
      stepId,
      action,
      timestamp: new Date().toISOString(),
      timeSpent,
      responses
    };
    
    setLogs(prevLogs => [...prevLogs, log]);
    return log;
  };
  
  const updateProgress = (updates: Partial<OnboardingProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };
  
  const completeOnboarding = () => {
    const completedAt = new Date().toISOString();
    const startTime = progress.startedAt ? new Date(progress.startedAt).getTime() : 0;
    const endTime = new Date(completedAt).getTime();
    const totalTimeSpent = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    
    updateProgress({
      completed: true,
      completedAt,
      timeSpent: totalTimeSpent
    });
    
    logStep('completion', 'complete', totalTimeSpent);
    
    try {
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      logger.warn('Confetti effect unavailable', { error: e }, 'UI');
    }
    
    return {
      completed: true,
      timeSpent: totalTimeSpent,
      responses: progress.responses
    };
  };
  
  const resetProgress = useCallback(async () => {
    if (user) {
      try {
        await supabase
          .from('user_settings')
          .delete()
          .eq('user_id', user.id)
          .in('key', [SETTINGS_KEY_PROGRESS, SETTINGS_KEY_LOGS]);
      } catch (error) {
        logger.error('Failed to reset onboarding in Supabase', error as Error, 'ONBOARDING');
      }
    }
    
    localStorage.removeItem(`onboarding-progress-${userId}`);
    localStorage.removeItem(`onboarding-logs-${userId}`);
    
    setProgress({
      currentStep: 0,
      totalSteps: 0, 
      completed: false,
      responses: {},
      startedAt: new Date().toISOString(),
      timeSpent: 0
    });
    
    setLogs([]);
  }, [user, userId]);
  
  const initOnboarding = (totalSteps: number) => {
    if (!progress.startedAt) {
      updateProgress({
        currentStep: 0,
        totalSteps,
        completed: false,
        startedAt: new Date().toISOString()
      });
    } else if (totalSteps !== progress.totalSteps) {
      updateProgress({ totalSteps });
    }
  };

  return {
    progress,
    logs,
    logStep,
    updateProgress,
    completeOnboarding,
    resetProgress,
    initOnboarding,
    isLoaded
  };
}
