// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface Reminder {
  id: string;
  userId?: string;
  kind: 'breathing' | 'journal' | 'meditation' | 'scan' | 'custom';
  title: string;
  message?: string;
  time: string; // HH:mm format
  days: number[]; // 0-6 for Sunday-Saturday
  enabled: boolean;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'reminders:v2';

export const useRemindersEnriched = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  // Load from localStorage
  const loadFromStorage = useCallback((): Reminder[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((items: Reminder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      logger.error('Failed to save reminders to storage', err, 'NOTIFY');
    }
  }, []);

  // Load reminders
  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        // Use localStorage if not authenticated
        const localReminders = loadFromStorage();
        setReminders(localReminders);
        return;
      }

      // Try to load from Supabase
      const { data, error: fetchError } = await supabase
        .from('user_reminders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        logger.warn('Failed to fetch from server, using localStorage', { error: fetchError }, 'NOTIFY');
        const localReminders = loadFromStorage();
        setReminders(localReminders);
        return;
      }

      if (data && data.length > 0) {
        const mappedReminders: Reminder[] = data.map(row => ({
          id: row.id,
          userId: row.user_id,
          kind: row.kind || 'custom',
          title: row.title,
          message: row.message,
          time: row.time,
          days: row.days || [1, 2, 3, 4, 5],
          enabled: row.enabled ?? true,
          lastTriggered: row.last_triggered,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        
        setReminders(mappedReminders);
        saveToStorage(mappedReminders);
        logger.info('Reminders loaded from server', { count: mappedReminders.length }, 'NOTIFY');
      } else {
        // Use localStorage data
        const localReminders = loadFromStorage();
        setReminders(localReminders);
      }
    } catch (err) {
      logger.error('Load reminders failed', err, 'NOTIFY');
      setError(err instanceof Error ? err.message : 'Failed to load reminders');
      const localReminders = loadFromStorage();
      setReminders(localReminders);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [userId, loadFromStorage, saveToStorage]);

  // Create reminder
  const createReminder = useCallback(async (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder | null> => {
    setLoading(true);
    setError(null);

    try {
      const newReminder: Reminder = {
        ...data,
        id: `rem_${Date.now()}`,
        userId: userId || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Supabase if authenticated
      if (userId) {
        const { data: inserted, error: insertError } = await supabase
          .from('user_reminders')
          .insert({
            id: newReminder.id,
            user_id: userId,
            kind: newReminder.kind,
            title: newReminder.title,
            message: newReminder.message,
            time: newReminder.time,
            days: newReminder.days,
            enabled: newReminder.enabled
          })
          .select()
          .single();

        if (insertError) {
          logger.warn('Failed to save to server, using localStorage', { error: insertError }, 'NOTIFY');
        } else if (inserted) {
          newReminder.id = inserted.id;
        }
      }

      const updatedReminders = [newReminder, ...reminders];
      setReminders(updatedReminders);
      saveToStorage(updatedReminders);

      toast({
        title: "Rappel créé ✨",
        description: `${newReminder.title} programmé avec succès.`,
      });

      logger.info('Reminder created', { id: newReminder.id, kind: newReminder.kind }, 'NOTIFY');
      return newReminder;

    } catch (err) {
      logger.error('Create reminder failed', err, 'NOTIFY');
      setError(err instanceof Error ? err.message : 'Failed to create reminder');
      toast({
        title: "Erreur",
        description: "Impossible de créer le rappel.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, reminders, saveToStorage]);

  // Update reminder
  const updateReminder = useCallback(async (id: string, updates: Partial<Reminder>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updatedReminders = reminders.map(r => 
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      );
      
      setReminders(updatedReminders);
      saveToStorage(updatedReminders);

      // Sync to server
      if (userId) {
        const { error: updateError } = await supabase
          .from('user_reminders')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) {
          logger.warn('Failed to sync update to server', { error: updateError }, 'NOTIFY');
        }
      }

      toast({
        title: "Rappel mis à jour",
        description: "Vos modifications ont été enregistrées.",
      });

      return true;
    } catch (err) {
      logger.error('Update reminder failed', err, 'NOTIFY');
      setError(err instanceof Error ? err.message : 'Failed to update reminder');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, reminders, saveToStorage]);

  // Delete reminder
  const deleteReminder = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updatedReminders = reminders.filter(r => r.id !== id);
      setReminders(updatedReminders);
      saveToStorage(updatedReminders);

      if (userId) {
        const { error: deleteError } = await supabase
          .from('user_reminders')
          .delete()
          .eq('id', id);

        if (deleteError) {
          logger.warn('Failed to delete from server', { error: deleteError }, 'NOTIFY');
        }
      }

      toast({
        title: "Rappel supprimé",
        description: "Le rappel a été supprimé avec succès.",
      });

      return true;
    } catch (err) {
      logger.error('Delete reminder failed', err, 'NOTIFY');
      setError(err instanceof Error ? err.message : 'Failed to delete reminder');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, reminders, saveToStorage]);

  // Toggle reminder enabled status
  const toggleReminder = useCallback(async (id: string): Promise<boolean> => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return false;
    
    return updateReminder(id, { enabled: !reminder.enabled });
  }, [reminders, updateReminder]);

  // Initialize on mount
  useEffect(() => {
    if (!initialized && userId !== null) {
      loadReminders();
    }
  }, [initialized, userId, loadReminders]);

  // Get reminders for today
  const getTodayReminders = useCallback((): Reminder[] => {
    const today = new Date().getDay();
    return reminders.filter(r => r.enabled && r.days.includes(today));
  }, [reminders]);

  // Get upcoming reminders
  const getUpcomingReminders = useCallback((limit: number = 5): Reminder[] => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.getDay();

    return reminders
      .filter(r => r.enabled)
      .filter(r => r.days.includes(today) && r.time >= currentTime)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, limit);
  }, [reminders]);

  return {
    reminders,
    loading,
    error,
    initialized,
    loadReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    getTodayReminders,
    getUpcomingReminders
  };
};

export default useRemindersEnriched;
