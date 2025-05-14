
import { v4 as uuid } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/types';

// Create a new emotion entry
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  try {
    // Ensure required fields are present
    const emotionData = {
      id: data.id || uuid(),
      user_id: data.user_id,
      date: data.date || new Date().toISOString(),
      emotion: data.emotion || 'neutral',
      score: data.score || Math.round((data.confidence || 0.5) * 100),
      confidence: data.confidence || 0.5,
      text: data.text || '',
      emojis: Array.isArray(data.emojis) ? data.emojis : [],
      audio_url: data.audio_url || '',
      ai_feedback: data.ai_feedback || ''
    };

    const { data: insertedData, error } = await supabase
      .from('emotions')
      .insert(emotionData)
      .select()
      .single();

    if (error) throw error;
    
    return insertedData as EmotionResult;
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw error;
  }
};

// Fetch the latest emotion for a user
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (not an error, just no data yet)
        return null;
      }
      throw error;
    }

    return data as EmotionResult;
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
};

// Analyze audio stream (placeholder implementation)
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // In a real app, this would send the audio to an API for processing
  // For now, we'll return a mock response
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency
  
  return {
    id: uuid(),
    emotion: ['happy', 'sad', 'neutral', 'calm', 'excited'][Math.floor(Math.random() * 5)],
    confidence: 0.7 + Math.random() * 0.3,
    score: Math.floor(Math.random() * 100),
    transcript: "Ceci est une transcription simulée de l'enregistrement audio.",
    date: new Date().toISOString(),
    ai_feedback: "Analyse IA simulée basée sur l'audio soumis."
  };
};

// Save an emotion record
export const saveEmotion = async (emotion: EmotionResult): Promise<void> => {
  // Ensure the emotion object has the required fields
  const emotionToSave = {
    ...emotion,
    id: emotion.id || uuid(),
    date: emotion.date || new Date().toISOString(),
    score: emotion.score || Math.round((emotion.confidence || 0.5) * 100)
  };

  const { error } = await supabase
    .from('emotions')
    .upsert(emotionToSave);

  if (error) throw error;
};

// Analyze text/emoji input
export const analyzeEmotion = async (text?: string, emojis?: string[]): Promise<EmotionResult> => {
  // In a real app, this would call an API
  // For now, we'll return a mock response
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API latency
  
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral', 'calm'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuid(),
    emotion: randomEmotion,
    confidence: 0.7 + Math.random() * 0.3,
    score: Math.floor(Math.random() * 100),
    text: text || '',
    emojis: emojis || [],
    date: new Date().toISOString(),
    ai_feedback: `Basé sur votre entrée, je détecte principalement de la ${randomEmotion}.`,
    recommendations: [
      "Prenez 5 minutes pour méditer",
      "Essayez une séance de respiration profonde",
      "Écoutez une playlist relaxante"
    ]
  };
};
