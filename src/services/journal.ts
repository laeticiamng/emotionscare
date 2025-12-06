// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  emotion_analysis?: any;
  created_at: string;
  updated_at: string;
}

export interface VoiceEntry {
  id: string;
  user_id: string;
  audio_url: string;
  transcription?: string;
  emotion_analysis?: any;
  created_at: string;
}

export class JournalService {
  static async getEntries(): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Erreur lors de la récupération des entrées', error, 'JournalService.getEntries');
        throw new Error('Impossible de récupérer les entrées du journal');
      }

      return data || [];
    } catch (error) {
      logger.error('Erreur service journal', error, 'JournalService.getEntries');
      throw error;
    }
  }

  static async createEntry(content: string): Promise<JournalEntry> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Erreur lors de la création de l\'entrée', error, 'JournalService.createEntry');
        throw new Error('Impossible de créer l\'entrée du journal');
      }

      return data;
    } catch (error) {
      logger.error('Erreur création entrée', error, 'JournalService.createEntry');
      throw error;
    }
  }

  static async createVoiceEntry(audioBlob: Blob): Promise<VoiceEntry> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      // Upload audio file
      const fileName = `voice_${Date.now()}.wav`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) {
        logger.error('Erreur upload audio', uploadError, 'JournalService.createVoiceEntry');
        throw new Error('Impossible d\'uploader l\'enregistrement audio');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(fileName);

      // Create voice entry record
      const { data, error } = await supabase
        .from('voice_entries')
        .insert({
          user_id: user.id,
          audio_url: publicUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Erreur création entrée vocale', error, 'JournalService.createVoiceEntry');
        throw new Error('Impossible de créer l\'entrée vocale');
      }

      return data;
    } catch (error) {
      logger.error('Erreur création entrée vocale', error, 'JournalService.createVoiceEntry');
      throw error;
    }
  }

  static async updateEntry(id: string, content: string): Promise<JournalEntry> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Erreur mise à jour entrée', error, 'JournalService.updateEntry');
        throw new Error('Impossible de mettre à jour l\'entrée');
      }

      return data;
    } catch (error) {
      logger.error('Erreur mise à jour', error, 'JournalService.updateEntry');
      throw error;
    }
  }

  static async deleteEntry(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Erreur suppression entrée', error, 'JournalService.deleteEntry');
        throw new Error('Impossible de supprimer l\'entrée');
      }
    } catch (error) {
      logger.error('Erreur suppression', error, 'JournalService.deleteEntry');
      throw error;
    }
  }

  // Instance methods for production service compatibility
  async createEntry(userId: string, content: string, options?: {
    title?: string;
    emotion?: string;
    tags?: string[];
    mood_score?: number;
    is_private?: boolean;
    analyze?: boolean;
  }): Promise<JournalEntry> {
    return JournalService.createEntry(content);
  }

  async getUserAnalytics(userId: string, days: number): Promise<any> {
    // Mock analytics for now - in real implementation would query by user
    return {
      totalEntries: 0,
      avgMoodScore: 5,
      emotionalTrends: []
    };
  }

  async getUserEntries(userId: string, options?: { limit: number }): Promise<JournalEntry[]> {
    return JournalService.getEntries();
  }
}

// Export instance for production service
export const journalService = new JournalService();