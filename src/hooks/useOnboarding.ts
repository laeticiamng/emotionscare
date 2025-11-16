/**
 * Hook pour gérer l'onboarding utilisateur
 * Sauvegarde le profil initial dans user_profiles
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface OnboardingProfile {
  goals: string[];
  experience: string;
  preferences: string[];
}

export function useOnboarding() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserProfile = async (profile: OnboardingProfile) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const profileData = {
        user_id: user.id,
        preferences: {
          goals: profile.goals,
          experience_level: profile.experience,
          feature_preferences: profile.preferences,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        }
      };

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (updateError) {
          throw updateError;
        }

        logger.info('User profile updated from onboarding', { userId: user.id }, 'HOOK');
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(profileData);

        if (insertError) {
          throw insertError;
        }

        logger.info('User profile created from onboarding', { userId: user.id }, 'HOOK');
      }

      return true;
    } catch (err) {
      logger.error('Failed to save onboarding profile', err as Error, 'HOOK');
      setError('Impossible de sauvegarder votre profil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const skipOnboarding = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          preferences: {
            onboarding_completed: true,
            onboarding_skipped: true,
            onboarding_completed_at: new Date().toISOString(),
          }
        });

      if (error) {
        throw error;
      }

      logger.info('Onboarding skipped', { userId: user.id }, 'HOOK');
      return true;
    } catch (err) {
      logger.error('Failed to skip onboarding', err as Error, 'HOOK');
      setError('Impossible de sauvegarder vos préférences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUserProfile,
    skipOnboarding,
    loading,
    error,
  };
}
