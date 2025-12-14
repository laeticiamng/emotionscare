// @ts-nocheck

import { EmotionalData } from '@/types/emotional-data';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

class EmotionalDataService {
  // Get emotional data for a specific user from Supabase
  async getEmotionalData(userId: string): Promise<EmotionalData[]> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        valence: entry.valence,
        arousal: entry.arousal,
        summary: entry.summary,
        source: entry.source,
        timestamp: entry.created_at,
        metadata: entry.metadata
      }));
    } catch (error) {
      logger.error('Failed to fetch emotional data', error as Error, 'SERVICE');
      return [];
    }
  }

  // Save new emotional data to Supabase
  async saveEmotionalData(data: EmotionalData): Promise<EmotionalData> {
    try {
      const { data: inserted, error } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: data.user_id,
          valence: data.valence || 50,
          arousal: data.arousal || 50,
          summary: data.summary,
          source: data.source || 'manual',
          metadata: data.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        id: inserted.id,
        timestamp: inserted.created_at
      };
    } catch (error) {
      logger.error('Failed to save emotional data', error as Error, 'SERVICE');
      throw error;
    }
  }

  // Update existing emotional data
  async updateEmotionalData(id: string, updates: Partial<EmotionalData>): Promise<EmotionalData> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .update({
          valence: updates.valence,
          arousal: updates.arousal,
          summary: updates.summary,
          metadata: updates.metadata
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        valence: data.valence,
        arousal: data.arousal,
        summary: data.summary,
        source: data.source,
        timestamp: data.created_at,
        metadata: data.metadata
      };
    } catch (error) {
      logger.error('Failed to update emotional data', error as Error, 'SERVICE');
      throw error;
    }
  }

  // Delete emotional data entry
  async deleteEmotionalData(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('emotion_scans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to delete emotional data', error as Error, 'SERVICE');
      return false;
    }
  }
}

// Export a singleton instance
export const emotionalDataService = new EmotionalDataService();
export default emotionalDataService;
