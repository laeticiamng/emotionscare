
import { supabase } from '@/integrations/supabase/client';
import { Emotion } from '@/types';

export const createEmotionEntry = async (data: string | {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}) => {
  try {
    if (typeof data === 'string') {
      // Legacy API for backward compatibility
      return { id: 'mock-id', created_at: new Date().toISOString() };
    }
    
    // Modern implementation
    const { user_id, text, emojis, audio_url, is_confidential, share_with_coach } = data;
    
    const { data: entry, error } = await supabase
      .from('emotion_entries')
      .insert({
        user_id,
        text: text || '',
        emojis: emojis || '',
        audio_url: audio_url || null,
        is_confidential: is_confidential || false,
        share_with_coach: share_with_coach || false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating emotion entry:', error);
      throw error;
    }
    
    return entry;
  } catch (error) {
    console.error('Error in createEmotionEntry:', error);
    // Return mock data for development
    return { id: 'mock-id', created_at: new Date().toISOString() };
  }
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  try {
    const { data, error } = await supabase
      .from('emotion_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching latest emotion:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Map database entry to Emotion type
    return {
      id: data.id,
      name: data.emotion_name || 'neutral',
      intensity: data.intensity || 5,
      date: data.created_at,
      notes: data.text || '',
      color: data.color || '#7C7C7C',
    };
  } catch (error) {
    console.error('Error in fetchLatestEmotion:', error);
    return null;
  }
};

export const analyzeAudioStream = async (audioBlob: Blob): Promise<{
  emotion: string;
  confidence: number;
  transcript?: string;
}> => {
  try {
    // For development, just return mock data
    return {
      emotion: 'calm',
      confidence: 0.85,
      transcript: 'This is a simulated transcript from audio analysis.',
    };
    
    // In production, you would upload the audio blob and call an API:
    /*
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch('/api/analyze-audio', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Audio analysis failed: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return {
      emotion: 'neutral',
      confidence: 0.5,
    };
  }
};

export const getEmotionHistory = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('emotion_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching emotion history:', error);
      return [];
    }
    
    return data.map(entry => ({
      id: entry.id,
      name: entry.emotion_name || 'neutral',
      intensity: entry.intensity || 5,
      date: entry.created_at,
      notes: entry.text || '',
      color: entry.color || '#7C7C7C',
    }));
  } catch (error) {
    console.error('Error in getEmotionHistory:', error);
    return [];
  }
};
