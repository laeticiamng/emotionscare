
import { useState, useEffect } from 'react';
import { OnboardingProgress, OnboardingLog } from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';

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

  // Load progress from localStorage on mount
  useEffect(() => {
    const storedProgress = localStorage.getItem(`onboarding-progress-${userId}`);
    const storedLogs = localStorage.getItem(`onboarding-logs-${userId}`);
    
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.error('Failed to parse onboarding progress:', e);
      }
    }
    
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error('Failed to parse onboarding logs:', e);
      }
    }
  }, [userId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress.totalSteps > 0) {
      localStorage.setItem(`onboarding-progress-${userId}`, JSON.stringify(progress));
    }
    
    if (logs.length > 0) {
      localStorage.setItem(`onboarding-logs-${userId}`, JSON.stringify(logs));
    }
  }, [progress, logs, userId]);

  // Log a step view or completion
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
  
  // Update progress
  const updateProgress = (updates: Partial<OnboardingProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };
  
  // Complete onboarding
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
    
    // Log completion
    logStep('completion', 'complete', totalTimeSpent);
    
    // Show confetti celebration
    try {
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.warn('Confetti effect unavailable:', e);
    }
    
    return {
      completed: true,
      timeSpent: totalTimeSpent,
      responses: progress.responses
    };
  };
  
  // Reset onboarding progress
  const resetProgress = () => {
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
  };
  
  // Initialize onboarding
  const initOnboarding = (totalSteps: number) => {
    if (!progress.startedAt) {
      updateProgress({
        currentStep: 0,
        totalSteps,
        completed: false,
        startedAt: new Date().toISOString()
      });
    } else if (totalSteps !== progress.totalSteps) {
      // If steps count changed, update it
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
    initOnboarding
  };
}
