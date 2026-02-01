/**
 * Hook pour gérer l'état d'onboarding du journal
 * Utilise Supabase pour la persistance cross-device
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

const ONBOARDING_KEY = 'journal_onboarding_completed';
const LOCAL_STORAGE_KEY = 'journal-onboarding-completed';

export function useJournalOnboarding() {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      // Fallback to localStorage for unauthenticated users
      const localValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      setHasCompletedOnboarding(localValue === 'true');
      setIsLoading(false);
      return;
    }

    const fetchOnboardingStatus = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', ONBOARDING_KEY)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          logger.warn('Failed to fetch journal onboarding status', error, 'SYSTEM');
        }

        setHasCompletedOnboarding(data?.value === 'true');
      } catch (err) {
        logger.error('Error fetching journal onboarding status', err as Error, 'SYSTEM');
        // Fallback to localStorage
        const localValue = localStorage.getItem(LOCAL_STORAGE_KEY);
        setHasCompletedOnboarding(localValue === 'true');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [user?.id]);

  const markOnboardingComplete = useCallback(async () => {
    // Update local state immediately
    setHasCompletedOnboarding(true);
    
    // Also set localStorage for fallback
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');

    if (!user?.id) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            key: ONBOARDING_KEY,
            value: 'true',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,key' }
        );

      if (error) {
        logger.warn('Failed to save journal onboarding status', error, 'SYSTEM');
      }
    } catch (err) {
      logger.error('Error saving journal onboarding status', err as Error, 'SYSTEM');
    }
  }, [user?.id]);

  const shouldShowOnboarding = !isLoading && hasCompletedOnboarding === false;
  const shouldShowTips = !isLoading && hasCompletedOnboarding === true;

  return {
    shouldShowOnboarding,
    shouldShowTips,
    isLoading,
    markOnboardingComplete,
  };
}
