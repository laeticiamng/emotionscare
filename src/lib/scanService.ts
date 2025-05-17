
import { EmotionResult } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { mockEmotions } from '@/data/mockEmotions';

export const saveEmotion = async (emotionData: Partial<EmotionResult>): Promise<EmotionResult | null> => {
  try {
    // Try to save to Supabase if available
    if (supabase) {
      const { data, error } = await supabase
        .from('emotions')
        .insert({
          ...emotionData,
          date: new Date().toISOString()
        })
        .select('*')
        .single();
        
      if (error) throw error;
      return data as EmotionResult;
    } else {
      // Mock saving for development
      const newEmotion: EmotionResult = {
        id: `emo-${Date.now()}`,
        date: new Date().toISOString(),
        emotion: emotionData.emotion || 'neutral',
        user_id: emotionData.user_id || 'user-123',
        text: emotionData.text,
        emojis: emotionData.emojis,
        audio_url: emotionData.audio_url,
        score: emotionData.score || 50
      };
      
      mockEmotions.unshift(newEmotion);
      return newEmotion;
    }
  } catch (error) {
    console.error('Error saving emotion:', error);
    return null;
  }
};

export const getEmotions = async (userId: string): Promise<EmotionResult[]> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data as EmotionResult[];
    } else {
      return mockEmotions.filter(e => e.user_id === userId);
    }
  } catch (error) {
    console.error('Error fetching emotions:', error);
    return [];
  }
};

export const getEmotionById = async (id: string): Promise<EmotionResult | null> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as EmotionResult;
    } else {
      return mockEmotions.find(e => e.id === id) || null;
    }
  } catch (error) {
    console.error('Error fetching emotion by id:', error);
    return null;
  }
};

export const deleteEmotion = async (id: string): Promise<boolean> => {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('emotions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } else {
      const index = mockEmotions.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmotions.splice(index, 1);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error deleting emotion:', error);
    return false;
  }
};
