// @ts-nocheck
import { useCallback } from 'react';
import { useOnboardingStore, ProfileDraft, GoalsDraft, SensorsDraft, ModuleSuggestion } from '@/store/onboarding.store';
import { logger } from '@/lib/logger';

export const useOnboarding = () => {
  const store = useOnboardingStore();

  const start = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);

    try {
      const response = await fetch('/api/onboarding/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }

      const { flow_id } = await response.json();
      store.setFlowId(flow_id);
      store.setStep(1); // Move to first actual step

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_start');
      }

      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erreur de démarrage');
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const saveProfile = useCallback(async (profile: ProfileDraft) => {
    store.setProfileDraft(profile);
    
    try {
      const response = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_profile_saved');
      }

      return true;
    } catch (error) {
      // Keep draft but show error
      store.setError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
      return false;
    }
  }, [store]);

  const saveGoals = useCallback(async (goals: GoalsDraft) => {
    store.setGoalsDraft(goals);
    
    try {
      const response = await fetch('/api/onboarding/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals),
      });

      if (!response.ok) {
        throw new Error('Failed to save goals');
      }

      const { recommendations } = await response.json();
      store.setModuleSuggestions(recommendations || []);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_goals_saved', {
          custom_goals: goals.objectives.join(',')
        });
      }

      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
      return false;
    }
  }, [store]);

  const saveSensors = useCallback(async (sensors: SensorsDraft) => {
    store.setSensorsDraft(sensors);
    
    try {
      const response = await fetch('/api/me/privacy_prefs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensors),
      });

      if (!response.ok) {
        throw new Error('Failed to save sensors');
      }

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_sensors_saved', {
          custom_enabled_count: Object.values(sensors).filter(Boolean).length
        });
      }

      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
      return false;
    }
  }, [store]);

  const enableNotifications = useCallback(async () => {
    if (!('Notification' in window)) {
      store.setError('Notifications non supportées');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        store.setNotificationsEnabled(true);
        
        // Register for push notifications if service worker available
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: null // Add your VAPID key here
            });

            // Send token to backend
            await fetch('/api/me/notifications/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscription }),
            });
          } catch (pushError) {
            logger.warn('Push subscription failed', { pushError }, 'SYSTEM');
          }
        }

        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'onboarding_push_granted');
        }

        return true;
      } else {
        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'onboarding_push_denied');
        }

        return false;
      }
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erreur de notifications');
      return false;
    }
  }, [store]);

  const complete = useCallback(async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      store.setCompleted(true);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_complete');
      }

      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erreur de finalisation');
      return false;
    }
  }, [store]);

  const skip = useCallback(() => {
    store.setCompleted(true);
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_skip', {
        custom_step: store.currentStep
      });
    }
  }, [store]);

  const next = useCallback(() => {
    store.nextStep();
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_step_view', {
        custom_step: store.currentStep + 1
      });
    }
  }, [store]);

  const prev = useCallback(() => {
    store.prevStep();
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_step_view', {
        custom_step: store.currentStep - 1
      });
    }
  }, [store]);

  return {
    // State
    step: store.currentStep,
    completed: store.completed,
    loading: store.loading,
    error: store.error,
    
    // Draft data
    profileDraft: store.profileDraft,
    goalsDraft: store.goalsDraft,
    sensorsDraft: store.sensorsDraft,
    notificationsEnabled: store.notificationsEnabled,
    moduleSuggestions: store.moduleSuggestions,
    
    // Actions
    start,
    saveProfile,
    saveGoals,
    saveSensors,
    enableNotifications,
    complete,
    skip,
    next,
    prev,
    reset: store.reset,
  };
};
