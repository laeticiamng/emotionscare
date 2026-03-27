// @ts-nocheck
/**
 * useScanReminders - Hook pour gérer les rappels de scan émotionnel
 * Intègre les notifications et la persistance
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface ScanReminder {
  id: string;
  time: string; // HH:mm
  days: number[]; // 0 = Dimanche, 1 = Lundi, etc.
  enabled: boolean;
  message?: string;
  lastTriggered?: string;
}

export interface ScanReminderSettings {
  reminders: ScanReminder[];
  notificationsEnabled: boolean;
  defaultMessage: string;
}

const DEFAULT_SETTINGS: ScanReminderSettings = {
  reminders: [],
  notificationsEnabled: true,
  defaultMessage: '🧠 C\'est le moment de faire un scan émotionnel !'
};

export function useScanReminders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ScanReminderSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      try {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'scan:reminders')
          .single();

        if (data?.value) {
          setSettings(JSON.parse(data.value));
        }
      } catch (e) {
        logger.warn('[useScanReminders] Could not load settings', {}, 'SCAN');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Sauvegarder les paramètres
  const saveSettings = useCallback(async (newSettings: ScanReminderSettings) => {
    if (!user) return;

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'scan:reminders',
          value: JSON.stringify(newSettings),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });

      setSettings(newSettings);
    } catch (e) {
      logger.error('[useScanReminders] Save failed', e, 'SCAN');
      throw e;
    }
  }, [user]);

  // Ajouter un rappel
  const addReminder = useCallback(async (reminder: Omit<ScanReminder, 'id'>) => {
    const newReminder: ScanReminder = {
      ...reminder,
      id: crypto.randomUUID()
    };

    const newSettings = {
      ...settings,
      reminders: [...settings.reminders, newReminder]
    };

    await saveSettings(newSettings);
    
    toast({
      title: '⏰ Rappel créé',
      description: `Rappel programmé à ${reminder.time}`
    });

    return newReminder;
  }, [settings, saveSettings, toast]);

  // Supprimer un rappel
  const removeReminder = useCallback(async (id: string) => {
    const newSettings = {
      ...settings,
      reminders: settings.reminders.filter(r => r.id !== id)
    };

    await saveSettings(newSettings);
    
    toast({
      title: 'Rappel supprimé',
      description: 'Le rappel a été supprimé avec succès.'
    });
  }, [settings, saveSettings, toast]);

  // Activer/désactiver un rappel
  const toggleReminder = useCallback(async (id: string) => {
    const newSettings = {
      ...settings,
      reminders: settings.reminders.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    };

    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Mettre à jour un rappel
  const updateReminder = useCallback(async (id: string, updates: Partial<ScanReminder>) => {
    const newSettings = {
      ...settings,
      reminders: settings.reminders.map(r =>
        r.id === id ? { ...r, ...updates } : r
      )
    };

    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Activer/désactiver les notifications globalement
  const toggleNotifications = useCallback(async (enabled: boolean) => {
    const newSettings = {
      ...settings,
      notificationsEnabled: enabled
    };

    await saveSettings(newSettings);
    
    if (enabled) {
      // Demander la permission de notification
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  }, [settings, saveSettings]);

  // Vérifier si un rappel doit être déclenché
  const checkReminders = useCallback(() => {
    if (!settings.notificationsEnabled) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    settings.reminders.forEach(reminder => {
      if (!reminder.enabled) return;
      if (!reminder.days.includes(currentDay)) return;
      if (reminder.time !== currentTime) return;

      // Vérifier qu'on n'a pas déjà déclenché ce rappel aujourd'hui
      const today = now.toDateString();
      if (reminder.lastTriggered === today) return;

      // Déclencher la notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('EmotionsCare', {
          body: reminder.message || settings.defaultMessage,
          icon: '/favicon.ico',
          tag: `scan-reminder-${reminder.id}`
        });
      }

      // Marquer comme déclenché
      updateReminder(reminder.id, { lastTriggered: today });
    });
  }, [settings, updateReminder]);

  // Vérifier les rappels toutes les minutes
  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  // Obtenir le prochain rappel prévu
  const getNextReminder = useCallback((): { reminder: ScanReminder; date: Date } | null => {
    const now = new Date();
    const enabledReminders = settings.reminders.filter(r => r.enabled);
    
    if (enabledReminders.length === 0) return null;

    let closest: { reminder: ScanReminder; date: Date } | null = null;

    enabledReminders.forEach(reminder => {
      reminder.days.forEach(day => {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const date = new Date(now);
        
        // Calculer le nombre de jours jusqu'au prochain occurrence
        let daysUntil = day - now.getDay();
        if (daysUntil < 0 || (daysUntil === 0 && (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes())))) {
          daysUntil += 7;
        }
        
        date.setDate(date.getDate() + daysUntil);
        date.setHours(hours, minutes, 0, 0);

        if (!closest || date < closest.date) {
          closest = { reminder, date };
        }
      });
    });

    return closest;
  }, [settings.reminders]);

  return {
    reminders: settings.reminders,
    notificationsEnabled: settings.notificationsEnabled,
    defaultMessage: settings.defaultMessage,
    isLoading,
    addReminder,
    removeReminder,
    toggleReminder,
    updateReminder,
    toggleNotifications,
    getNextReminder
  };
}

export default useScanReminders;
