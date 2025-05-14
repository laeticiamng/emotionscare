
import { supabase } from '@/integrations/supabase/client';
import { Emotion, EmotionResult } from '@/types/emotion';

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
      emotion: data.emotion_name || 'neutral',
      score: data.intensity || 5,
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
  id?: string;
  score?: number;
  text?: string;
  feedback?: string;
  recommendations?: string[];
}> => {
  try {
    // For development, just return mock data
    return {
      emotion: 'calm',
      confidence: 0.85,
      transcript: 'This is a simulated transcript from audio analysis.',
      id: 'mock-id',
      score: 70,
      text: 'This is a simulated transcript from audio analysis.',
      feedback: 'You seem calm and collected.',
      recommendations: ['Take a moment to appreciate this calm state', 'Practice mindfulness']
    };
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
      emotion: entry.emotion_name || 'neutral',
      score: entry.intensity || 5,
      text: entry.text || '',
    }));
  } catch (error) {
    console.error('Error in getEmotionHistory:', error);
    return [];
  }
};

export const analyzeEmotion = async (data: string | {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  try {
    // For demo purposes, create a mock analysis result
    const mockResult: EmotionResult = {
      id: 'generated-id-' + Date.now(),
      emotion: 'calm',
      score: 70,
      confidence: 0.8,
      timestamp: new Date().toISOString(),
      feedback: "Vous semblez calme et équilibré. C'est un excellent état pour prendre des décisions réfléchies.",
      recommendations: [
        "Profitez de cette clarté mentale pour planifier votre journée",
        "Pratiquez la méditation pour renforcer cet état de calme"
      ]
    };
    
    // In a real implementation, we would call an API endpoint to analyze the emotion
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Also save this emotion to the database
    if (typeof data !== 'string') {
      await createEmotionEntry(data);
    }
    
    return mockResult;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return {
      emotion: 'neutral',
      score: 50,
      confidence: 0.5,
      timestamp: new Date().toISOString()
    };
  }
};

export const saveEmotion = async (emotion: Emotion): Promise<void> => {
  try {
    if (!emotion.user_id) {
      console.error('Cannot save emotion without user_id');
      return;
    }
    
    const { error } = await supabase
      .from('emotions')
      .insert({
        user_id: emotion.user_id,
        date: new Date().toISOString(),
        score: emotion.score || emotion.intensity || 5,
        emojis: '',
        text: emotion.text || '',
        ai_feedback: emotion.ai_feedback || ''
      });
    
    if (error) {
      console.error('Error saving emotion:', error);
    }
  } catch (error) {
    console.error('Error in saveEmotion:', error);
  }
};
