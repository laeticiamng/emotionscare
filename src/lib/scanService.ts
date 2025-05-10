
import { supabase } from './supabase-client';
import { Emotion, EmotionResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { mockEmotions } from '@/data/mockEmotions';

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
    
    if (data && data.length > 0) {
      return data as Emotion[];
    }
    
    // Si aucune donnée n'est trouvée, utiliser les données de mock
    console.log("No emotion data found for user, using mock data");
    return mockEmotions;
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    
    // Fallback pour la démo - retourne des données simulées
    return mockEmotions;
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
    return mockEmotions[0] || null;
  }
};

// Analyser le texte pour détecter l'émotion
export const analyzeText = async (text: string): Promise<Emotion> => {
  try {
    // Simuler une analyse pour la démo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'neutral'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const score = Math.floor(Math.random() * 10) + 1;
    
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      emotion,
      score,
      text,
      confidence: 0.7 + Math.random() * 0.3,
      intensity: 0.4 + Math.random() * 0.6,
      ai_feedback: `Votre texte révèle une émotion de type ${emotion} avec une intensité de ${score}/10.`
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    
    // Fallback en cas d'erreur
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      emotion: 'neutral',
      score: 5,
      text,
      confidence: 0.5,
      intensity: 0.5
    };
  }
};

// Analyser les emojis pour détecter l'émotion
export const analyzeEmojis = async (emojis: string, userId: string): Promise<EmotionResult> => {
  try {
    // Simuler une analyse pour la démo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const emojiMap: Record<string, { emotion: string, score: number }> = {
      '😊': { emotion: 'joy', score: 8 },
      '😢': { emotion: 'sadness', score: 3 },
      '😡': { emotion: 'anger', score: 2 },
      '😨': { emotion: 'fear', score: 4 },
      '😐': { emotion: 'neutral', score: 5 }
    };
    
    let detectedEmotion = 'neutral';
    let score = 5;
    
    for (const emoji of Object.keys(emojiMap)) {
      if (emojis.includes(emoji)) {
        detectedEmotion = emojiMap[emoji].emotion;
        score = emojiMap[emoji].score;
        break;
      }
    }
    
    return {
      id: uuidv4(),
      user_id: userId,
      emotion: detectedEmotion,
      score,
      emojis,
      confidence: 0.8,
      intensity: score / 10,
      feedback: `Vos emojis suggèrent une émotion de type ${detectedEmotion}.`,
      primaryEmotion: {
        name: detectedEmotion,
        score: score / 10
      }
    };
  } catch (error) {
    console.error('Error analyzing emojis:', error);
    
    // Fallback en cas d'erreur
    return {
      emotion: 'neutral',
      score: 5,
      confidence: 0.5,
      intensity: 0.5,
      primaryEmotion: {
        name: 'neutral',
        score: 0.5
      }
    };
  }
};

// Analyser l'audio pour détecter l'émotion
export const analyzeAudio = async (audioUrl: string, userId: string): Promise<EmotionResult> => {
  try {
    // Simuler une analyse pour la démo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const score = Math.floor(Math.random() * 10) + 1;
    
    return {
      id: uuidv4(),
      user_id: userId,
      emotion,
      score,
      confidence: 0.65 + Math.random() * 0.3,
      intensity: score / 10,
      transcript: "Transcription simulée de l'audio fourni.",
      feedback: `Votre voix révèle une émotion de type ${emotion} avec une intensité de ${score}/10.`,
      primaryEmotion: {
        name: emotion,
        score: score / 10
      }
    };
  } catch (error) {
    console.error('Error analyzing audio:', error);
    
    // Fallback en cas d'erreur
    return {
      emotion: 'neutral',
      score: 5,
      confidence: 0.5,
      intensity: 0.5,
      primaryEmotion: {
        name: 'neutral',
        score: 0.5
      }
    };
  }
};

// Traiter l'audio en streaming
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  try {
    // Simuler une analyse pour la démo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const score = Math.floor(Math.random() * 10) + 1;
    
    return {
      id: uuidv4(),
      emotion,
      score,
      confidence: 0.7 + Math.random() * 0.25,
      intensity: score / 10,
      transcript: "Ceci est une transcription simulée de l'audio en streaming.",
      feedback: `L'analyse de votre enregistrement audio révèle une émotion principalement ${emotion}.`,
      recommendations: [
        'Prenez quelques respirations profondes',
        'Écoutez de la musique adaptée à votre humeur',
        'Accordez-vous un moment de pause'
      ],
      primaryEmotion: {
        name: emotion,
        score: score / 10
      }
    };
  } catch (error) {
    console.error('Error analyzing audio stream:', error);
    
    // Fallback en cas d'erreur
    return {
      emotion: 'neutral',
      score: 5,
      confidence: 0.5,
      intensity: 0.5,
      primaryEmotion: {
        name: 'neutral',
        score: 0.5
      }
    };
  }
};

// Sauvegarder une émotion analysée
export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .insert({
        user_id: emotion.user_id,
        date: new Date().toISOString(),
        score: emotion.score,
        emotion: emotion.emotion,
        emojis: emotion.emojis || null,
        text: emotion.text || null,
        audio_url: emotion.audio_url || null,
        ai_feedback: emotion.ai_feedback || null
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Emotion;
  } catch (error) {
    console.error('Error saving emotion:', error);
    
    // Retourner l'émotion originale en cas d'erreur
    return {
      ...emotion,
      id: uuidv4(), // Assigner un ID temporaire
      date: new Date().toISOString()
    };
  }
};

// Fonction pour analyser l'émotion basée sur différentes entrées
export const analyzeEmotion = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  try {
    if (data.text && data.text.length > 0) {
      const emotion = await analyzeText(data.text);
      return {
        ...emotion,
        user_id: data.user_id
      };
    } 
    
    if (data.emojis && data.emojis.length > 0) {
      return analyzeEmojis(data.emojis, data.user_id);
    }
    
    if (data.audio_url) {
      return analyzeAudio(data.audio_url, data.user_id);
    }
    
    // Aucune donnée à analyser
    throw new Error('Aucune donnée fournie pour l\'analyse émotionnelle');
    
  } catch (error) {
    console.error('Error in analyzeEmotion:', error);
    
    // Fallback en cas d'erreur
    return {
      emotion: 'neutral',
      score: 5,
      feedback: "Impossible d'analyser l'émotion avec les données fournies."
    };
  }
};

// Alias pour compatibilité
export const getEmotionHistory = fetchEmotionHistory;
