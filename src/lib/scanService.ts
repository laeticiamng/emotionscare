
import { supabase } from './supabase-client';
import { Emotion } from '@/types';

export const createEmotionEntry = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  score?: number;
  emotion?: string;
}): Promise<Emotion> => {
  try {
    // Pour la démo, on génère un score et une émotion aléatoires si non fournis
    const score = data.score || Math.floor(Math.random() * 10) + 1;
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
    const emotion = data.emotion || emotions[Math.floor(Math.random() * emotions.length)];
    
    const nowDate = new Date().toISOString();
    
    const { data: result, error } = await supabase
      .from('emotions')
      .insert({
        user_id: data.user_id,
        text: data.text || null,
        emojis: data.emojis || null,
        audio_url: data.audio_url || null,
        score: score,
        emotion: emotion,
        date: nowDate,
      })
      .select('*')
      .single();
      
    if (error) throw new Error(error.message);
    
    return result as Emotion;
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    
    // Fallback pour la démo - retourne une entrée simulée
    const mockEmotion: Emotion = {
      id: `mock-${Date.now()}`,
      user_id: data.user_id,
      date: new Date().toISOString(),
      score: data.score || Math.floor(Math.random() * 10) + 1,
      emotion: data.emotion || 'neutral',
      text: data.text,
      emojis: data.emojis,
      audio_url: data.audio_url,
    };
    
    return mockEmotion;
  }
};

export const fetchEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (error) throw new Error(error.message);
    
    return data as Emotion[];
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    
    // Fallback pour la démo - retourne des données simulées
    return Array.from({ length: 10 }, (_, i) => ({
      id: `mock-${i}`,
      user_id: userId,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      score: Math.floor(Math.random() * 10) + 1,
      emotion: ['joy', 'sadness', 'fear', 'anger', 'surprise'][Math.floor(Math.random() * 5)],
    }));
  }
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(error.message);
    }
    
    return data as Emotion;
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    
    // Fallback pour la démo - retourne une entrée simulée ou null
    return null;
  }
};
