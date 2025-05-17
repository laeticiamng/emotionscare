
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';

export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        score: data.score,
        emojis: data.emojis,
        text: data.text,
        audio_url: data.audio_url,
        ai_feedback: data.ai_feedback,
        emotion: data.primary_emotion || 'neutral',
        source: data.source || 'manual',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
};

export const createEmotionEntry = async (emotion: Partial<EmotionResult>): Promise<EmotionResult> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .insert({
        id: emotion.id,
        user_id: emotion.user_id || emotion.userId,
        date: emotion.date || emotion.timestamp || new Date().toISOString(),
        score: emotion.score || 50,
        emojis: emotion.emojis || '',
        text: emotion.text || '',
        audio_url: emotion.audio_url || emotion.audioUrl,
        ai_feedback: emotion.ai_feedback || emotion.feedback,
        primary_emotion: emotion.primary_emotion || emotion.emotion,
        source: emotion.source || 'manual',
      })
      .select('*')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      score: data.score,
      emojis: data.emojis,
      text: data.text,
      audio_url: data.audio_url,
      ai_feedback: data.ai_feedback,
      emotion: data.primary_emotion || 'neutral',
      source: data.source || 'manual',
    };
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};
