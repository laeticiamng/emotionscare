import { useState } from 'react';
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
 * Hook pour gérer les paramètres du journal
 */
export const useJournalSettings = () => {
  const [settings, setSettings] = useState<JournalSettings>(() => {
    const stored = localStorage.getItem('journal-settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  const { prompts, getRandomPrompt, incrementUsage } = useJournalPrompts();
  const { reminders, ...reminderActions } = useJournalReminders();

  const updateSettings = (updates: Partial<JournalSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('journal-settings', JSON.stringify(newSettings));
  };

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
    ...reminderActions,
  };
};
