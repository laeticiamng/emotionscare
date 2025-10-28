// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useNotifyStore, type Reminder } from '@/store/notify.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

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

  // Load reminders from API
  const loadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement with Supabase edge function
      // For now, return empty array (reminders stored locally)
      setReminders([]);
      
    } catch (error: any) {
      logger.error('Load reminders failed', error as Error, 'SYSTEM');
      setError(error.message);
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
      const response = await fetch('/api/me/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }

      const result = await response.json();
      const newReminder = { ...reminderData, id: result.id };
      
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
      const response = await fetch(`/api/me/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update reminder');
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
      const response = await fetch(`/api/me/reminders/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete reminder');
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