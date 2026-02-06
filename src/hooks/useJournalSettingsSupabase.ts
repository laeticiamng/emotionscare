// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useJournalPrompts } from '@/hooks/useJournalPrompts';
import { useJournalReminders } from '@/hooks/useJournalReminders';

export interface JournalSettings {
  showPrompts: boolean;
  promptCategory: 'all' | 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'creativity' | 'mindfulness';
  autoSuggestPrompt: boolean;
  enableReminders: boolean;
}

const DEFAULT_SETTINGS: JournalSettings = {
  showPrompts: true,
  promptCategory: 'all',
  autoSuggestPrompt: false,
  enableReminders: true,
};

/**
 * Hook pour gérer les paramètres du journal avec persistance Supabase
 * Fallback sur localStorage si non connecté
 */
export const useJournalSettingsSupabase = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<JournalSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const { prompts, getRandomPrompt, incrementUsage } = useJournalPrompts();
  const { reminders, ...reminderActions } = useJournalReminders();

  // Load settings from Supabase or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      if (user?.id) {
        try {
          // Try to load from Supabase profiles.preferences
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('preferences')
            .eq('id', user.id)
            .single();

          if (!error && profile?.preferences?.journal_settings) {
            setSettings({
              ...DEFAULT_SETTINGS,
              ...profile.preferences.journal_settings,
            });
          } else {
            // Fallback: check localStorage and migrate if exists
            const stored = localStorage.getItem('journal-settings');
            if (stored) {
              const parsed = JSON.parse(stored);
              setSettings({ ...DEFAULT_SETTINGS, ...parsed });
              // Migrate to Supabase
              await saveToSupabase(user.id, { ...DEFAULT_SETTINGS, ...parsed });
              localStorage.removeItem('journal-settings');
            }
          }
        } catch (error) {
          logger.error('Error loading journal settings:', error, 'SYSTEM');
          // Fallback to localStorage
          const stored = localStorage.getItem('journal-settings');
          if (stored) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
          }
        }
      } else {
        // Not logged in, use localStorage
        const stored = localStorage.getItem('journal-settings');
        if (stored) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        }
      }
      
      setIsLoading(false);
    };

    loadSettings();
  }, [user?.id]);

  const saveToSupabase = async (userId: string, newSettings: JournalSettings) => {
    try {
      // Get current preferences
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      const currentPrefs = profile?.preferences || {};
      
      // Update with new journal settings
      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPrefs,
            journal_settings: newSettings,
          },
        })
        .eq('id', userId);
    } catch (error) {
      logger.error('Error saving journal settings to Supabase:', error, 'SYSTEM');
    }
  };

  const updateSettings = useCallback(async (updates: Partial<JournalSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    if (user?.id) {
      await saveToSupabase(user.id, newSettings);
    } else {
      // Fallback to localStorage
      localStorage.setItem('journal-settings', JSON.stringify(newSettings));
    }
  }, [settings, user?.id]);

  const getSuggestion = async () => {
    const category = settings.promptCategory === 'all' ? undefined : settings.promptCategory;
    const prompt = await getRandomPrompt(category);
    
    if (prompt) {
      await incrementUsage(prompt.id);
    }
    
    return prompt;
  };

  const hasActiveReminders = reminders.some(r => r.is_active);

  return {
    settings,
    updateSettings,
    prompts,
    getSuggestion,
    reminders,
    hasActiveReminders,
    isLoading,
    ...reminderActions,
  };
};

// Re-export as useJournalSettings for backwards compatibility
export { useJournalSettingsSupabase as useJournalSettings };
