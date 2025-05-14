
import { Emotion, EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AnalyzeEmotionParams {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}

export const analyzeEmotion = async (params: AnalyzeEmotionParams): Promise<EmotionResult> => {
  // This would normally call an API endpoint
  // For now, we'll mock the response
  console.log('Analyzing emotion with params:', params);
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock result
  return {
    id: 'emotion-' + Date.now(),
    emotion: params.emojis?.includes('😊') ? 'joy' : 
             params.emojis?.includes('😔') ? 'sadness' :
             params.emojis?.includes('😡') ? 'anger' :
             params.emojis?.includes('😨') ? 'fear' : 'neutral',
    score: Math.floor(Math.random() * 10) + 1,
    confidence: Math.random() * 0.5 + 0.5,
    dominantEmotion: params.emojis?.includes('😊') ? 'joy' : 'calm',
    text: params.text || '',
    emojis: params.emojis || '',
    timestamp: new Date().toISOString(),
    triggers: ['work stress', 'social interaction'],
    feedback: 'Your emotions reflect your current environment. Try taking a short break.',
    ai_feedback: 'I notice you may be feeling a bit overwhelmed. Taking a few deep breaths can help center your thoughts.'
  };
};

export const saveEmotion = async (emotion: Emotion): Promise<void> => {
  // This would normally save to a database
  console.log('Saving emotion:', emotion);
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const createEmotionEntry = async (emotion: Emotion): Promise<string> => {
  // This would normally create a new emotion entry in the database
  console.log('Creating emotion entry:', emotion);
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return 'emotion-' + Date.now();
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // This would normally fetch from a database
  console.log('Fetching latest emotion for user:', userId);
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock result
  return {
    id: 'emotion-' + Date.now(),
    user_id: userId,
    emotion: 'calm',
    score: 7,
    text: 'Feeling relaxed after meditation',
    emojis: '😌',
    date: new Date().toISOString(),
    ai_feedback: 'Great job on maintaining your calm state!'
  };
};
