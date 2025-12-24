// @ts-nocheck
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import type { UserPreferences } from '@/types/preferences';
import { logger } from '@/lib/logger';

const DEFAULT_PREFERENCES: UserPreferences = {
  notifications_enabled: true,
  email_notifications: false,
  push_notifications: true,
  theme: 'system',
  fontSize: 'medium',
  emotionalCamouflage: false,
  aiSuggestions: true,
  fullAnonymity: false,
  language: 'fr',
  autoPlay: false,
  journalReminders: true,
  audioQuality: 'high'
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load preferences from Supabase on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('user_settings')
            .select('preferences')
            .eq('user_id', user.id)
            .single();

          if (data?.preferences) {
            setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences });
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    setIsLoading(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      const updatedPrefs = { ...preferences, ...newPrefs };

      if (user) {
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          preferences: updatedPrefs,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }

      setPreferences(updatedPrefs);

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été enregistrées avec succès"
      });
    } catch (error) {
      logger.error('Error updating preferences', error as Error, 'UI');

      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    setIsLoading(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          preferences: DEFAULT_PREFERENCES,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }

      setPreferences(DEFAULT_PREFERENCES);

      toast({
        title: "Réinitialisation réussie",
        description: "Vos préférences ont été réinitialisées aux valeurs par défaut"
      });
    } catch (error) {
      logger.error('Error resetting preferences', error as Error, 'UI');

      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser vos préférences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    resetToDefaults
  };
}
