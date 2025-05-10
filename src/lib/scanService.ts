
import { Emotion, EmotionResult } from '@/types';

// Mock implementation of createEmotionEntry
export const createEmotionEntry = async (data: Partial<Emotion>): Promise<Emotion> => {
  // Simulating API call
  return {
    id: crypto.randomUUID(),
    user_id: data.user_id || '',
    date: new Date().toISOString(),
    emotion: data.emotion || 'neutral',
    confidence: data.confidence || 0.8,
    score: data.score || 50,
    text: data.text || '',
    name: 'Emotion Name', // Added missing properties
    intensity: 5,
    category: 'Basic',
    is_confidential: data.is_confidential
  };
};

// Mock implementation of fetchLatestEmotion
export const fetchLatestEmotion = async (userId: string): Promise<Emotion> => {
  // Simulating API call
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: 'happy',
    confidence: 0.9,
    score: 85,
    text: '',
    name: 'Happy', // Added missing properties
    intensity: 7,
    category: 'Positive'
  };
};

// Mock implementation of fetchEmotionHistory
export const fetchEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulating API call
  return [
    {
      id: crypto.randomUUID(),
      user_id: userId,
      date: new Date().toISOString(),
      emotion: 'happy',
      confidence: 0.9,
      score: 85,
      text: 'J\'ai passé une excellente journée!',
      name: 'Happy', // Added missing properties
      intensity: 7,
      category: 'Positive'
    },
    {
      id: crypto.randomUUID(),
      user_id: userId,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      emotion: 'calm',
      confidence: 0.8,
      score: 70,
      text: 'Journée tranquille et productive.',
      name: 'Calm', // Added missing properties
      intensity: 5,
      category: 'Positive'
    },
    {
      id: crypto.randomUUID(),
      user_id: userId,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      emotion: 'stressed',
      confidence: 0.75,
      score: 30,
      text: 'Beaucoup de pression au travail aujourd\'hui.',
      name: 'Stressed', // Added missing properties
      intensity: 6,
      category: 'Negative'
    }
  ];
};

// Ajout de la méthode analyzeEmotion manquante
export const analyzeEmotion = async (data: {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  console.log('Analyzing emotion with data:', data);
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock result based on input
  let emotion = 'neutral';
  let score = 50;
  let confidence = 0.7;
  let feedback = 'Votre état émotionnel semble être neutre.';
  
  // Simple logic to determine emotion based on inputs
  if (data.emojis) {
    if (data.emojis.includes('😊') || data.emojis.includes('😄')) {
      emotion = 'joyeux';
      score = 85;
      confidence = 0.9;
      feedback = 'Vous semblez être dans un état émotionnel positif et joyeux!';
    } else if (data.emojis.includes('😔') || data.emojis.includes('😢')) {
      emotion = 'triste';
      score = 30;
      confidence = 0.85;
      feedback = 'Vous semblez ressentir de la tristesse. Prenez soin de vous.';
    } else if (data.emojis.includes('😡') || data.emojis.includes('😠')) {
      emotion = 'en colère';
      score = 20;
      confidence = 0.8;
      feedback = 'Vous semblez ressentir de la colère. Essayez des exercices de respiration.';
    }
  } else if (data.text) {
    if (data.text.toLowerCase().includes('heureux') || data.text.toLowerCase().includes('content')) {
      emotion = 'joyeux';
      score = 80;
      confidence = 0.85;
      feedback = 'Votre texte reflète des émotions positives. Continuez ainsi!';
    } else if (data.text.toLowerCase().includes('triste') || data.text.toLowerCase().includes('déprimé')) {
      emotion = 'triste';
      score = 25;
      confidence = 0.8;
      feedback = 'Vous exprimez de la tristesse. N\'hésitez pas à parler à quelqu\'un.';
    }
  }
  
  return {
    id: crypto.randomUUID(),
    emotion,
    score,
    confidence,
    feedback,
    recommendations: [
      'Pratiquez 5 minutes de méditation',
      'Écoutez de la musique relaxante',
      'Prenez une courte pause'
    ],
    description: `Vous êtes actuellement dans un état émotionnel ${emotion}.`,
    date: new Date().toISOString(),
    user_id: data.user_id
  };
};

// Ajout de la méthode analyzeAudioStream manquante
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  console.log('Analyzing audio stream with size:', audioBlob.size);
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock result for audio analysis
  return {
    id: crypto.randomUUID(),
    emotion: 'calm',
    score: 65,
    confidence: 0.75,
    feedback: 'Votre voix indique un état de calme et de sérénité.',
    transcript: 'Transcription simulée de l\'audio...',
    recommendations: [
      'Continuez vos exercices de respiration',
      'Écoutez de la musique apaisante',
      'Prenez quelques moments pour vous'
    ],
    description: 'Analyse basée sur les modulations vocales et le ton.',
    date: new Date().toISOString()
  };
};

// Ajout de la méthode analyzeEmojis pour compatibilité
export const analyzeEmojis = async (emojis: string, userId: string): Promise<EmotionResult> => {
  console.log('Analyzing emojis:', emojis);
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock result based on emojis
  let emotion = 'neutral';
  let score = 50;
  
  if (emojis.includes('😊') || emojis.includes('😄')) {
    emotion = 'joyeux';
    score = 85;
  } else if (emojis.includes('😔') || emojis.includes('😢')) {
    emotion = 'triste';
    score = 30;
  }
  
  return {
    id: crypto.randomUUID(),
    emotion,
    score,
    confidence: 0.8,
    feedback: `Vos émojis indiquent un état ${emotion}.`,
    recommendations: [
      'Continuez à exprimer vos émotions',
      'Réfléchissez à ce qui vous fait ressentir cette émotion'
    ],
    user_id: userId,
    date: new Date().toISOString()
  };
};

// Ajout de la méthode analyzeAudio pour compatibilité
export const analyzeAudio = async (audioUrl: string, userId: string): Promise<EmotionResult> => {
  console.log('Analyzing audio:', audioUrl);
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: 'calm',
    score: 70,
    confidence: 0.8,
    audio_url: audioUrl,
    feedback: 'Votre voix indique un état de calme.',
    name: 'Calm',
    intensity: 5,
    category: 'Positive'
  };
};

// Additional helper methods
export const saveEmotionReaction = async (emotionId: string, reaction: string): Promise<boolean> => {
  console.log(`Saving reaction ${reaction} for emotion ${emotionId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const getEmotionStats = async (userId: string, period: 'day' | 'week' | 'month' = 'week'): Promise<any> => {
  console.log(`Getting emotion stats for user ${userId} for period ${period}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return {
    averageScore: 65,
    dominantEmotion: 'calm',
    emotionCounts: {
      'happy': 12,
      'calm': 15,
      'neutral': 8,
      'anxious': 5,
      'sad': 2
    },
    trendDirection: 'improving'
  };
};
