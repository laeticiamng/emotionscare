/**
 * Hook pour gérer l'onboarding du dashboard (3 étapes)
 * Persiste les réponses dans user_preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface OnboardingAnswers {
  current_feeling: string;
  motivation: string;
  goal: string;
  completed_at: string;
}

interface OnboardingState {
  shouldShow: boolean;
  isLoading: boolean;
  answers: OnboardingAnswers | null;
}

export const useDashboardOnboarding = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    shouldShow: false,
    isLoading: true,
    answers: null,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Vérifier si l'utilisateur a déjà complété l'onboarding
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          logger.error('Error checking onboarding status:', error, 'ONBOARDING');
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const preferences = data?.preferences as Record<string, unknown> | null;
        const onboardingData = preferences?.onboarding as OnboardingAnswers | undefined;

        if (onboardingData?.completed_at) {
          // Onboarding déjà fait
          setState({
            shouldShow: false,
            isLoading: false,
            answers: onboardingData,
          });
        } else {
          // Premier accès, afficher l'onboarding
          setState({
            shouldShow: true,
            isLoading: false,
            answers: null,
          });
        }
      } catch (error) {
        logger.error('Error in useDashboardOnboarding:', error, 'ONBOARDING');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const completeOnboarding = useCallback(async (answers: Omit<OnboardingAnswers, 'completed_at'>) => {
    if (!user) return;

    const onboardingData: OnboardingAnswers = {
      ...answers,
      completed_at: new Date().toISOString(),
    };

    try {
      // Récupérer les préférences existantes
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      const existingPrefs = (existingData?.preferences as Record<string, unknown>) || {};

      // Mettre à jour avec les données d'onboarding
      const newPreferences = {
        ...existingPrefs,
        onboarding: onboardingData,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: newPreferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      // Logger le premier mood entry basé sur l'émotion sélectionnée
      const moodMapping: Record<string, number> = {
        happy: 9,
        calm: 7,
        neutral: 5,
        sad: 3,
        anxious: 2,
        angry: 2,
      };

      await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_level: moodMapping[answers.current_feeling] || 5,
          emotions: [answers.current_feeling],
          notes: `Premier check-in - Objectif: ${answers.goal}`,
        });

      setState({
        shouldShow: false,
        isLoading: false,
        answers: onboardingData,
      });

      logger.info('Onboarding completed', { userId: user.id }, 'ONBOARDING');
    } catch (error) {
      logger.error('Error completing onboarding:', error, 'ONBOARDING');
      throw error;
    }
  }, [user]);

  const skipOnboarding = useCallback(async () => {
    if (!user) return;

    try {
      // Marquer comme skipped
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      const existingPrefs = (existingData?.preferences as Record<string, unknown>) || {};

      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: {
            ...existingPrefs,
            onboarding: { skipped_at: new Date().toISOString() },
          },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      setState(prev => ({ ...prev, shouldShow: false }));
    } catch (error) {
      logger.error('Error skipping onboarding:', error, 'ONBOARDING');
      // Fermer quand même en cas d'erreur
      setState(prev => ({ ...prev, shouldShow: false }));
    }
  }, [user]);

  return {
    shouldShowOnboarding: state.shouldShow,
    isLoading: state.isLoading,
    onboardingAnswers: state.answers,
    completeOnboarding,
    skipOnboarding,
  };
};

export default useDashboardOnboarding;
