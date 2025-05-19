
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';

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
        confidence: data.score || 0.5, // Added confidence field
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
        primary_emotion: emotion.primaryEmotion || emotion.emotion,
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
      confidence: data.score || 0.5, // Added confidence field
    };
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};

export const analyzeEmotion = async (text: string): Promise<EmotionResult | null> => {
  try {
    // This would typically call an AI service or API endpoint
    // For now, we'll create a mock implementation
    const mockResult: EmotionResult = {
      id: uuid(),
      timestamp: new Date().toISOString(),
      emotion: text.toLowerCase().includes('happy') ? 'joy' : 
               text.toLowerCase().includes('sad') ? 'sadness' : 
               text.toLowerCase().includes('angry') ? 'anger' : 'neutral',
      intensity: 0.7,
      confidence: 0.8,
      source: 'text',
    };
    
    return mockResult;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return null;
  }
};

export const fetchEmotionHistory = async (userId: string, limit = 10): Promise<EmotionResult[]> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    if (data) {
      return data.map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        date: entry.date,
        timestamp: entry.date,
        score: entry.score,
        emojis: entry.emojis,
        text: entry.text,
        audio_url: entry.audio_url,
        ai_feedback: entry.ai_feedback,
        emotion: entry.primary_emotion || 'neutral',
        source: entry.source || 'manual',
        confidence: entry.score || 0.5, // Added confidence field
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    return [];
  }
};
