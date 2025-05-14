
import { EmotionResult, Emotion, Json } from '@/types';
import { supabase } from '@/integrations/supabase';
import { v4 as uuid } from 'uuid';

// Analyze emotion from text and emojis
export const analyzeEmotion = async (text: string, emojis: string[]): Promise<EmotionResult> => {
  try {
    // This is a mock implementation
    // In a real app, you'd call an AI service or use a model to analyze the emotion
    
    const result: EmotionResult = {
      id: uuid(),
      emotion: 'neutral',
      confidence: 0.7,
      intensity: 50,
      score: 50,
      date: new Date().toISOString(),
      emojis: emojis,
      text: text,
      category: 'neutral',
      ai_feedback: 'Votre émotion semble être neutre. Comment puis-je vous aider à vous sentir mieux aujourd'hui?'
    };
    
    // Simulate analyzing text content
    if (text.toLowerCase().includes('heureux') || text.toLowerCase().includes('content')) {
      result.emotion = 'joy';
      result.confidence = 0.85;
      result.score = 80;
      result.intensity = 80;
      result.category = 'positive';
      result.ai_feedback = 'Je détecte de la joie dans vos mots. C'est formidable!';
    } else if (text.toLowerCase().includes('triste') || text.toLowerCase().includes('déprimé')) {
      result.emotion = 'sadness';
      result.confidence = 0.82;
      result.score = 30;
      result.intensity = 70;
      result.category = 'negative';
      result.ai_feedback = 'Vous semblez triste. Que diriez-vous d'une activité pour vous remonter le moral?';
    } else if (text.toLowerCase().includes('stress') || text.toLowerCase().includes('anxieux')) {
      result.emotion = 'stress';
      result.confidence = 0.78;
      result.score = 40;
      result.intensity = 65;
      result.category = 'negative';
      result.ai_feedback = 'Je détecte du stress. Une session de respiration pourrait vous aider.';
    }
    
    // Update based on emojis
    if (emojis.includes('😀') || emojis.includes('😊')) {
      result.emotion = 'joy';
      result.confidence = Math.min(result.confidence + 0.1, 1.0);
      result.category = 'positive';
    } else if (emojis.includes('😢') || emojis.includes('😔')) {
      result.emotion = 'sadness';
      result.confidence = Math.min(result.confidence + 0.1, 1.0);
      result.category = 'negative';
    } else if (emojis.includes('😠') || emojis.includes('😡')) {
      result.emotion = 'anger';
      result.confidence = Math.min(result.confidence + 0.1, 1.0);
      result.category = 'negative';
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

// Analyze emotion from audio stream
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  try {
    // This would be replaced with actual audio analysis in a real implementation
    console.log('Analyzing audio of size:', audioBlob.size);
    
    // Mock emotion analysis from audio
    const result: EmotionResult = {
      id: uuid(),
      emotion: 'neutral',
      confidence: 0.75,
      intensity: 50,
      score: 50,
      date: new Date().toISOString(),
      transcript: 'Transcription would appear here in a real implementation',
      category: 'neutral',
      ai_feedback: 'Based on your voice tone, you seem to be in a neutral state.'
    };
    
    // In a real implementation, you would:
    // 1. Send the audio to a speech-to-text service
    // 2. Analyze the text for emotional content
    // 3. Analyze the audio features (tone, pitch, etc.) for emotional content
    
    return result;
  } catch (error) {
    console.error('Error analyzing audio stream:', error);
    throw error;
  }
};

// Save emotion to database
export const saveEmotion = async (emotion: Emotion | EmotionResult): Promise<void> => {
  try {
    // Ensure we have a proper format for the database
    const emotionData = {
      id: emotion.id || uuid(),
      user_id: emotion.user_id || 'anonymous',
      date: emotion.date || new Date().toISOString(),
      emotion: emotion.emotion,
      score: emotion.score || emotion.confidence ? Math.round(emotion.confidence * 100) : 50,
      text: emotion.text || emotion.transcript || '',
      emojis: Array.isArray(emotion.emojis) ? emotion.emojis : [],
      ai_feedback: emotion.ai_feedback || emotion.feedback || '',
      audio_url: 'audio_url' in emotion ? emotion.audio_url : undefined,
      category: emotion.category || 'neutral'
    };

    const { error } = await supabase
      .from('emotions')
      .insert(emotionData);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving emotion:', error);
    throw error;
  }
};

// Utility function to help with type compatibility
export const convertToEmotionResult = (data: any): EmotionResult => {
  return {
    emotion: data.emotion || 'neutral',
    confidence: data.confidence || data.score / 100 || 0.5,
    score: data.score || data.confidence ? Math.round(data.confidence * 100) : 50,
    intensity: data.intensity || data.score || 50,
    date: data.date || new Date().toISOString(),
    emojis: Array.isArray(data.emojis) ? data.emojis : [],
    text: data.text || data.transcript || '',
    transcript: data.transcript || data.text || '',
    ai_feedback: data.ai_feedback || data.feedback || '',
    feedback: data.feedback || data.ai_feedback || '',
    category: data.category || 'neutral',
    audio_url: data.audio_url || null,
    id: data.id || uuid(),
    user_id: data.user_id || 'anonymous'
  };
};

// Update the utility function used in the component
export const getUserEmotions = async (userId: string): Promise<Emotion[]> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as Emotion[];
  } catch (error) {
    console.error('Error fetching user emotions:', error);
    return [];
  }
};
