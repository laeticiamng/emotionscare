/**
 * useReminders - Gestion des rappels avec persistance Supabase
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface Reminder {
  id: string;
  kind: 'breathwork' | 'journal' | 'scan' | 'meditation' | 'check-in' | 'custom';
  title: string;
  message?: string;
  time: string;
  days_of_week: number[];
  is_active: boolean;
  last_sent_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load reminders from Supabase
  const loadReminders = useCallback(async () => {
    if (!user) {
      setReminders([]);
      setInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('user_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (fetchError) throw fetchError;

      setReminders((data || []) as Reminder[]);
      logger.info('[Reminders] Loaded', { count: data?.length || 0 }, 'REMINDERS');
    } catch (err: any) {
      logger.error('Load reminders failed', err as Error, 'SYSTEM');
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  // Create a new reminder
  const createReminder = useCallback(async (reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer des rappels.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('user_reminders')
        .insert({
          user_id: user.id,
          kind: reminderData.kind,
          title: reminderData.title,
          message: reminderData.message,
          time: reminderData.time,
          days_of_week: reminderData.days_of_week,
          is_active: reminderData.is_active ?? true
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newReminder = data as Reminder;
      setReminders(prev => [...prev, newReminder]);

      toast({
        title: "Rappel créé ✨",
        description: `Rappel "${reminderData.title}" programmé avec succès.`,
      });

      logger.info('[Reminders] Created', { kind: reminderData.kind }, 'REMINDERS');
      return newReminder;
    } catch (err: any) {
      logger.error('Create reminder failed', err as Error, 'SYSTEM');
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rappel.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update a reminder
  const editReminder = useCallback(async (id: string, updates: Partial<Reminder>) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    // Optimistic update
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

    try {
      const { error: updateError } = await supabase
        .from('user_reminders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Rappel mis à jour",
        description: "Vos modifications ont été enregistrées.",
      });

      logger.info('[Reminders] Updated', { id }, 'REMINDERS');
      return true;
    } catch (err: any) {
      // Rollback on error
      await loadReminders();
      logger.error('Update reminder failed', err as Error, 'SYSTEM');
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rappel.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadReminders]);

  // Delete a reminder
  const deleteReminder = useCallback(async (id: string) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    // Store for potential rollback
    const reminder = reminders.find(r => r.id === id);
    
    // Optimistic removal
    setReminders(prev => prev.filter(r => r.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Rappel supprimé",
        description: "Le rappel a été supprimé avec succès.",
      });

      logger.info('[Reminders] Deleted', { id }, 'REMINDERS');
      return true;
    } catch (err: any) {
      // Rollback on error
      if (reminder) {
        setReminders(prev => [...prev, reminder]);
      }
      logger.error('Delete reminder failed', err as Error, 'SYSTEM');
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rappel.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, reminders]);

  // Toggle reminder active state
  const toggleReminder = useCallback(async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return false;
    return editReminder(id, { is_active: !reminder.is_active });
  }, [reminders, editReminder]);

  // Initialize on mount
  useEffect(() => {
    if (!initialized) {
      loadReminders();
    }
  }, [initialized, loadReminders]);

  // Reload when user changes
  useEffect(() => {
    if (user) {
      loadReminders();
    } else {
      setReminders([]);
    }
  }, [user?.id]);

  return {
    reminders,
    loading,
    error,
    loadReminders,
    createReminder,
    editReminder,
    deleteReminder,
    toggleReminder
  };
};

export default useReminders;
