
import { UserPreferences } from '@/types/preferences';
import { supabase } from '@/integrations/supabase/client';

export class PreferencesService {
  /**
   * Sauvegarder les préférences utilisateur
   */
  static async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Charger les préférences utilisateur
   */
  static async loadPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.preferences || null;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  }

  /**
   * Exporter les préférences (conformité RGPD)
   */
  static async exportPreferences(userId: string): Promise<UserPreferences | null> {
    return this.loadPreferences(userId);
  }

  /**
   * Supprimer toutes les préférences (conformité RGPD)
   */
  static async deleteAllPreferences(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: null })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting preferences:', error);
      throw error;
    }
  }
}
