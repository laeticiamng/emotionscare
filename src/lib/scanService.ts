// @ts-nocheck

// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';
import { logger } from '@/lib/logger';

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
        confidence: data.score || 0.5,
        intensity: data.intensity || 0.5,
        timestamp: data.date
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching latest emotion', error as Error, 'SCAN');
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
        primary_emotion: emotion.emotion || emotion.primaryEmotion,
        source: emotion.source || 'manual',
        intensity: emotion.intensity || 0.5
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
      confidence: data.score || 0.5,
      intensity: data.intensity || 0.5,
      timestamp: data.date
    };
  } catch (error) {
    logger.error('Error creating emotion entry', error as Error, 'SCAN');
    throw error;
  }
};

export const analyzeEmotion = async (text: string, userId?: string): Promise<EmotionResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('emotion-analysis', {
      body: { 
        text,
        userId,
        analysisType: 'text'
      }
    });

    if (error) throw error;

    const result: EmotionResult = {
      id: data.id || uuid(),
      timestamp: data.timestamp || new Date().toISOString(),
      emotion: data.emotion || 'neutral',
      intensity: data.intensity || 0.5,
      confidence: data.confidence || 0.5,
      source: 'text',
      valence: data.valence,
      arousal: data.arousal,
      insight: data.insight,
      recommendations: data.recommendations || [],
    };
    
    return result;
  } catch (error) {
    logger.error('Error analyzing emotion', error as Error, 'SCAN');
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
        confidence: entry.score || 0.5,
        intensity: entry.intensity || 0.5
      }));
    }
    
    return [];
  } catch (error) {
    logger.error('Error fetching emotion history', error as Error, 'SCAN');
    return [];
  }
};
