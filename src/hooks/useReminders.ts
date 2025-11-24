// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useNotifyStore, type Reminder } from '@/store/notify.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export const useReminders = () => {
  const {
    reminders,
    loading,
    error,
    setReminders,
    addReminder,
    updateReminder,
    removeReminder,
    setLoading,
    setError
  } = useNotifyStore();

  const [initialized, setInitialized] = useState(false);

  // Load reminders from Supabase
  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setReminders([]);
        return;
      }

      // Fetch reminders from Supabase
      // Note: If reminders table doesn't exist yet, we'll handle the error gracefully
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, just use empty array
        if (error.code === '42P01') {
          logger.warn('Reminders table does not exist yet', undefined, 'SYSTEM');
          setReminders([]);
        } else {
          throw error;
        }
      } else {
        setReminders(data || []);
      }

    } catch (error: any) {
      logger.error('Load reminders failed', error as Error, 'SYSTEM');
      setError(error.message);
      setReminders([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setReminders, setLoading, setError]);

  // Create a new reminder
  const createReminder = useCallback(async (reminderData: Omit<Reminder, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create reminder in Supabase
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          ...reminderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        // If table doesn't exist, add to store only
        if (error.code === '42P01') {
          logger.warn('Reminders table does not exist, storing locally only', undefined, 'SYSTEM');
          const localReminder = { ...reminderData, id: crypto.randomUUID() };
          addReminder(localReminder);

          toast({
            title: "Rappel créé ✨",
            description: `Rappel ${reminderData.kind} programmé avec succès (local).`,
          });

          return localReminder;
        }
        throw error;
      }

      const newReminder = data as Reminder;
      addReminder(newReminder);

      toast({
        title: "Rappel créé ✨",
        description: `Rappel ${reminderData.kind} programmé avec succès.`,
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'notify.reminder.created', {
          kind: reminderData.kind
        });
      }

      return newReminder;

    } catch (error: any) {
      logger.error('Create reminder failed', error as Error, 'SYSTEM');
      setError(error.message);

      toast({
        title: "Erreur",
        description: "Impossible de créer le rappel.",
        variant: "destructive"
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [addReminder, setLoading, setError]);

  // Update a reminder
  const editReminder = useCallback(async (id: string, updates: Partial<Reminder>) => {
    setLoading(true);
    setError(null);

    // Optimistic update
    updateReminder(id, updates);

    try {
      const { error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id);

      if (error) {
        // If table doesn't exist, keep optimistic update
        if (error.code === '42P01') {
          logger.warn('Reminders table does not exist, local update only', undefined, 'SYSTEM');

          toast({
            title: "Rappel mis à jour",
            description: "Vos modifications ont été enregistrées (local).",
          });

          return true;
        }
        throw error;
      }

      toast({
        title: "Rappel mis à jour",
        description: "Vos modifications ont été enregistrées.",
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'notify.reminder.updated', {
          kind: reminders.find(r => r.id === id)?.kind
        });
      }

      return true;

    } catch (error: any) {
      // Rollback on error
      await loadReminders();

      logger.error('Update reminder failed', error as Error, 'SYSTEM');
      setError(error.message);

      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rappel.",
        variant: "destructive"
      });

      return false;
    } finally {
      setLoading(false);
    }
  }, [updateReminder, reminders, setLoading, setError, loadReminders]);

  // Delete a reminder
  const deleteReminder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    // Store for potential rollback
    const reminder = reminders.find(r => r.id === id);

    // Optimistic removal
    removeReminder(id);

    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) {
        // If table doesn't exist, keep optimistic update
        if (error.code === '42P01') {
          logger.warn('Reminders table does not exist, local delete only', undefined, 'SYSTEM');

          toast({
            title: "Rappel supprimé",
            description: "Le rappel a été supprimé avec succès (local).",
          });

          return true;
        }
        throw error;
      }

      toast({
        title: "Rappel supprimé",
        description: "Le rappel a été supprimé avec succès.",
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'notify.reminder.deleted', {
          kind: reminder?.kind
        });
      }

      return true;

    } catch (error: any) {
      // Rollback on error
      if (reminder) {
        addReminder(reminder);
      }

      logger.error('Delete reminder failed', error as Error, 'SYSTEM');
      setError(error.message);

      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rappel.",
        variant: "destructive"
      });

      return false;
    } finally {
      setLoading(false);
    }
  }, [reminders, removeReminder, addReminder, setLoading, setError]);

  // Initialize on mount
  useEffect(() => {
    if (!initialized) {
      loadReminders();
    }
  }, [initialized, loadReminders]);

  return {
    reminders,
    loading,
    error,
    loadReminders,
    createReminder,
    editReminder,
    deleteReminder
  };
};