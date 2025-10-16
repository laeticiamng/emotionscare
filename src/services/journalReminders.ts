import { supabase } from '@/integrations/supabase/client';

export interface JournalReminder {
  id: string;
  user_id: string;
  reminder_time: string;
  days_of_week: number[];
  is_active: boolean;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderParams {
  reminder_time: string;
  days_of_week: number[];
  message?: string;
  is_active?: boolean;
}

/**
 * Service pour gérer les rappels de journal
 */
export const journalRemindersService = {
  /**
   * Récupère tous les rappels de l'utilisateur
   */
  async getUserReminders(): Promise<JournalReminder[]> {
    try {
      const { data, error } = await supabase
        .from('journal_reminders')
        .select('*')
        .order('reminder_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crée un nouveau rappel
   */
  async createReminder(params: CreateReminderParams): Promise<JournalReminder> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('journal_reminders')
        .insert({
          user_id: user.id,
          reminder_time: params.reminder_time,
          days_of_week: params.days_of_week,
          message: params.message || null,
          is_active: params.is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour un rappel existant
   */
  async updateReminder(
    reminderId: string,
    updates: Partial<CreateReminderParams>
  ): Promise<JournalReminder> {
    try {
      const { data, error } = await supabase
        .from('journal_reminders')
        .update(updates)
        .eq('id', reminderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Active/désactive un rappel
   */
  async toggleReminder(reminderId: string, isActive: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('journal_reminders')
        .update({ is_active: isActive })
        .eq('id', reminderId);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprime un rappel
   */
  async deleteReminder(reminderId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('journal_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },
};
