// @ts-nocheck
import { useCallback } from 'react';
import { useOnboardingStore, ProfileDraft, GoalsDraft, SensorsDraft, ModuleSuggestion } from '@/store/onboarding.store';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// Helper function to convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useOnboarding = () => {
  const store = useOnboardingStore();

  const start = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);

    try {
      // Generate flow_id locally (no backend needed for now)
      const flow_id = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_profile_saved');
      }

      return true;
    } catch (error) {
      // Keep draft but show error
      logger.error('Save profile failed', error as Error, 'AUTH');
      store.setError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
      return false;
    }
  }, [store]);

  const saveGoals = useCallback(async (goals: GoalsDraft) => {
    store.setGoalsDraft(goals);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate module recommendations based on objectives
      const { data: recommendationsData, error: rpcError } = await supabase
        .rpc('generate_module_recommendations', {
          user_objectives: goals.objectives
        });

      if (rpcError) {
        logger.warn('Failed to generate recommendations', { error: rpcError }, 'ONBOARDING');
      }

      const recommendations = recommendationsData || [];

      // Save goals and recommendations to database
      const { error } = await supabase
        .from('onboarding_goals')
        .upsert({
          user_id: user.id,
          objectives: goals.objectives,
          module_suggestions: recommendations,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update store with recommendations
      store.setModuleSuggestions(recommendations);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_goals_saved', {
          custom_goals: goals.objectives.join(','),
          recommendations_count: recommendations.length
        });
      }

      logger.info('Goals saved successfully', {
        objectives: goals.objectives,
        recommendationsCount: recommendations.length
      }, 'ONBOARDING');

      return true;
    } catch (error) {
      logger.error('Save goals failed', error as Error, 'ONBOARDING');
      store.setError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
      return false;
    }
  }, [store]);

  const saveSensors = useCallback(async (sensors: SensorsDraft) => {
    store.setSensorsDraft(sensors);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_preferences: sensors,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_sensors_saved', {
          custom_enabled_count: Object.values(sensors).filter(Boolean).length
        });
      }

      return true;
    } catch (error) {
      logger.error('Save sensors failed', error as Error, 'AUTH');
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
            const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

            if (!vapidPublicKey) {
              logger.warn('VAPID public key not configured - push notifications disabled', {}, 'SYSTEM');
              return true; // Continue onboarding even without push
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            // Send subscription to backend
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase
                .from('push_subscriptions')
                .upsert({
                  user_id: user.id,
                  subscription: subscription.toJSON(),
                  updated_at: new Date().toISOString()
                });
            }

            logger.info('Push subscription registered', { subscription }, 'SYSTEM');
          } catch (pushError) {
            logger.warn('Push subscription failed', { pushError }, 'SYSTEM');
            // Don't fail onboarding if push subscription fails
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
      // Mark onboarding as completed locally
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
